#!/usr/bin/env bash
set -euo pipefail

# Local wrapper script: deploy one or many Next.js frontends to a VPS.
# It uploads and executes deploy/bootstrap-vps-frontend.sh remotely.
#
# Single app example:
# ./deploy/deploy-vps.sh \
#   --vps-user root \
#   --vps-host 69.62.107.197 \
#   --app-name auth-frontend \
#   --domain auth.analogueshifts.com \
#   --api-url https://api.analogueshifts.com \
#   --repo git@github.com:analogueshifts/auth.analogueshifts.com.git \
#   --port 3000 \
#   --email ops@analogueshifts.com
#
# Batch example (CSV file with header):
# ./deploy/deploy-vps.sh --vps-user root --vps-host 69.62.107.197 --batch-file deploy/apps.csv --email ops@analogueshifts.com
#
# CSV header:
# app_name,domain,repo,api_url,port,branch,app_dir

VPS_USER=""
VPS_HOST=""
SSH_KEY=""
SSH_PORT="22"
REMOTE_BOOTSTRAP_PATH="/tmp/bootstrap-vps-frontend.sh"
LOCAL_BOOTSTRAP_PATH="deploy/bootstrap-vps-frontend.sh"

APP_NAME=""
DOMAIN=""
API_URL=""
AUTH_URL=""
SITE_ID=""
REPO_URL=""
APP_DIR=""
BRANCH="master"
PORT="3000"
EMAIL=""

BATCH_FILE=""
DRY_RUN="false"

print_help() {
  cat <<'EOF'
Usage:
  deploy-vps.sh --vps-user <user> --vps-host <host> [single-app flags]
  deploy-vps.sh --vps-user <user> --vps-host <host> --batch-file <csv> [--email <email>]

VPS connection (required):
  --vps-user      SSH user on the VPS
  --vps-host      VPS hostname or IP

Single-app deploy flags:
  --app-name      PM2 app name
  --domain        Frontend domain
  --api-url       Backend API URL
  --auth-url      Auth frontend URL used by this app (optional)
  --site-id       App identifier appended as ?app=<site-id> (optional)
  --repo          Git repo URL
  --app-dir       Remote app dir (optional, default /var/www/<domain>)
  --branch        Git branch (default: master)
  --port          App port behind Nginx (default: 3000)
  --email         Certbot email (recommended)

Batch deploy flags:
  --batch-file    CSV file containing app rows with header:
                  app_name,domain,repo,api_url,auth_url,site_id,port,branch,app_dir
                  auth_url/site_id/app_dir can be empty; branch defaults to master if empty

Optional:
  --ssh-key       SSH private key path
  --ssh-port      SSH port (default: 22)
  --dry-run       Print remote commands without executing
  --help          Show this help

Notes:
  - This script must be run from repository root (or provide valid LOCAL_BOOTSTRAP_PATH).
  - On remote host, script attempts sudo first, then falls back to direct bash.
EOF
}

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: required command not found: $cmd"
    exit 1
  fi
}

ssh_base_cmd() {
  local ssh_cmd=(ssh)
  ssh_cmd+=( -o "ConnectTimeout=12" )
  ssh_cmd+=( -p "$SSH_PORT" )
  if [[ -n "$SSH_KEY" ]]; then
    ssh_cmd+=( -i "$SSH_KEY" )
  fi
  ssh_cmd+=("$VPS_USER@$VPS_HOST")
  printf '%q ' "${ssh_cmd[@]}"
}

scp_base_cmd() {
  local scp_cmd=(scp)
  scp_cmd+=( -o "ConnectTimeout=12" )
  scp_cmd+=( -P "$SSH_PORT" )
  if [[ -n "$SSH_KEY" ]]; then
    scp_cmd+=( -i "$SSH_KEY" )
  fi
  printf '%q ' "${scp_cmd[@]}"
}

upload_bootstrap() {
  if [[ ! -f "$LOCAL_BOOTSTRAP_PATH" ]]; then
    echo "Error: bootstrap script not found at $LOCAL_BOOTSTRAP_PATH"
    exit 1
  fi

  local scp_cmd
  scp_cmd="$(scp_base_cmd) \"$LOCAL_BOOTSTRAP_PATH\" \"$VPS_USER@$VPS_HOST:$REMOTE_BOOTSTRAP_PATH\""

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] $scp_cmd"
    return
  fi

  eval "$scp_cmd"

  local ssh_cmd
  ssh_cmd="$(ssh_base_cmd) \"chmod +x '$REMOTE_BOOTSTRAP_PATH'\""
  eval "$ssh_cmd"
}

run_remote_bootstrap() {
  local app_name="$1"
  local domain="$2"
  local repo="$3"
  local api_url="$4"
  local auth_url="$5"
  local site_id="$6"
  local port="$7"
  local branch="$8"
  local app_dir="$9"

  local remote_args=()
  remote_args+=("--app-name" "$app_name")
  remote_args+=("--domain" "$domain")
  remote_args+=("--api-url" "$api_url")
  remote_args+=("--repo" "$repo")
  remote_args+=("--port" "$port")
  remote_args+=("--branch" "$branch")

  if [[ -n "$auth_url" ]]; then
    remote_args+=("--auth-url" "$auth_url")
  fi

  if [[ -n "$site_id" ]]; then
    remote_args+=("--site-id" "$site_id")
  fi

  if [[ -n "$app_dir" ]]; then
    remote_args+=("--app-dir" "$app_dir")
  fi

  if [[ -n "$EMAIL" ]]; then
    remote_args+=("--email" "$EMAIL")
  fi

  local quoted_args
  quoted_args=$(printf ' %q' "${remote_args[@]}")

  local remote_cmd="sudo bash '$REMOTE_BOOTSTRAP_PATH'$quoted_args || bash '$REMOTE_BOOTSTRAP_PATH'$quoted_args"
  local ssh_cmd
  ssh_cmd="$(ssh_base_cmd) \"$remote_cmd\""

  echo
  echo "Deploying $domain (PM2: $app_name, port: $port, branch: $branch)"

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] $ssh_cmd"
    return
  fi

  eval "$ssh_cmd"
}

validate_single_inputs() {
  if [[ -z "$APP_NAME" || -z "$DOMAIN" || -z "$API_URL" || -z "$REPO_URL" ]]; then
    echo "Error: single deploy requires --app-name, --domain, --api-url, --repo"
    print_help
    exit 1
  fi
}

run_single() {
  validate_single_inputs
  run_remote_bootstrap "$APP_NAME" "$DOMAIN" "$REPO_URL" "$API_URL" "$AUTH_URL" "$SITE_ID" "$PORT" "$BRANCH" "$APP_DIR"
}

run_batch() {
  if [[ ! -f "$BATCH_FILE" ]]; then
    echo "Error: batch file not found: $BATCH_FILE"
    exit 1
  fi

  local line_no=0
  while IFS=, read -r app_name domain repo api_url auth_url site_id port branch app_dir || [[ -n "${app_name:-}" ]]; do
    line_no=$((line_no + 1))

    # Skip header row
    if [[ $line_no -eq 1 && "$app_name" == "app_name" ]]; then
      continue
    fi

    # Skip empty lines
    if [[ -z "${app_name// }" ]]; then
      continue
    fi

    app_name="${app_name//$'\r'/}"
    domain="${domain//$'\r'/}"
    repo="${repo//$'\r'/}"
    api_url="${api_url//$'\r'/}"
    auth_url="${auth_url//$'\r'/}"
    site_id="${site_id//$'\r'/}"
    port="${port//$'\r'/}"
    branch="${branch//$'\r'/}"
    app_dir="${app_dir//$'\r'/}"

    if [[ -z "$app_name" || -z "$domain" || -z "$repo" || -z "$api_url" || -z "$port" ]]; then
      echo "Error: invalid row $line_no in $BATCH_FILE"
      echo "Expected at least app_name,domain,repo,api_url,port"
      exit 1
    fi

    if [[ -z "$branch" ]]; then
      branch="master"
    fi

    run_remote_bootstrap "$app_name" "$domain" "$repo" "$api_url" "$auth_url" "$site_id" "$port" "$branch" "$app_dir"
  done < "$BATCH_FILE"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --vps-user)
      VPS_USER="$2"
      shift 2
      ;;
    --vps-host)
      VPS_HOST="$2"
      shift 2
      ;;
    --ssh-key)
      SSH_KEY="$2"
      shift 2
      ;;
    --ssh-port)
      SSH_PORT="$2"
      shift 2
      ;;
    --app-name)
      APP_NAME="$2"
      shift 2
      ;;
    --domain)
      DOMAIN="$2"
      shift 2
      ;;
    --api-url)
      API_URL="$2"
      shift 2
      ;;
    --auth-url)
      AUTH_URL="$2"
      shift 2
      ;;
    --site-id)
      SITE_ID="$2"
      shift 2
      ;;
    --repo)
      REPO_URL="$2"
      shift 2
      ;;
    --app-dir)
      APP_DIR="$2"
      shift 2
      ;;
    --branch)
      BRANCH="$2"
      shift 2
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    --email)
      EMAIL="$2"
      shift 2
      ;;
    --batch-file)
      BATCH_FILE="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN="true"
      shift
      ;;
    --help)
      print_help
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      print_help
      exit 1
      ;;
  esac
done

if [[ -z "$VPS_USER" || -z "$VPS_HOST" ]]; then
  echo "Error: --vps-user and --vps-host are required"
  print_help
  exit 1
fi

require_command ssh
require_command scp

upload_bootstrap

if [[ -n "$BATCH_FILE" ]]; then
  run_batch
else
  run_single
fi

echo
echo "Done."
echo "Check PM2 status: ssh $VPS_USER@$VPS_HOST 'pm2 status'"
