#!/usr/bin/env bash
set -euo pipefail

# Bootstrap and deploy this Next.js frontend to a VPS using PM2 + Nginx.
# Run as root or with sudo:
# sudo bash deploy/bootstrap-vps-frontend.sh \
#   --domain auth.analogueshifts.com \
#   --api-url https://api.analogueshifts.com \
#   --repo git@github.com:analogueshifts/auth.analogueshifts.com.git

DOMAIN=""
API_URL=""
REPO_URL=""
APP_DIR=""
BRANCH="master"
PORT="3000"
PUBLIC_KEY=""
SECRET_KEY=""
EMAIL=""

print_help() {
  cat <<'EOF'
Usage:
  bootstrap-vps-frontend.sh --domain <domain> --api-url <api-url> --repo <git-url> [options]

Required:
  --domain       Frontend domain (example: auth.analogueshifts.com)
  --api-url      Backend API base URL (example: https://api.analogueshifts.com)
  --repo         GitHub repo URL (SSH or HTTPS)

Optional:
  --app-dir      App directory (default: /var/www/<domain>)
  --branch       Git branch (default: master)
  --port         Node app port behind Nginx (default: 3000)
  --public-key   Value for NEXT_PUBLIC_PUBLIC_KEY
  --secret-key   Value for NEXT_PUBLIC_SECRET_KEY
  --email        Email for certbot registration (recommended)
  --help         Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain)
      DOMAIN="$2"
      shift 2
      ;;
    --api-url)
      API_URL="$2"
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
    --public-key)
      PUBLIC_KEY="$2"
      shift 2
      ;;
    --secret-key)
      SECRET_KEY="$2"
      shift 2
      ;;
    --email)
      EMAIL="$2"
      shift 2
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

if [[ -z "$DOMAIN" || -z "$API_URL" || -z "$REPO_URL" ]]; then
  echo "Error: --domain, --api-url, and --repo are required."
  print_help
  exit 1
fi

if [[ -z "$APP_DIR" ]]; then
  APP_DIR="/var/www/$DOMAIN"
fi

if [[ -z "$PUBLIC_KEY" ]]; then
  read -r -p "Enter NEXT_PUBLIC_PUBLIC_KEY: " PUBLIC_KEY
fi

if [[ -z "$SECRET_KEY" ]]; then
  read -r -s -p "Enter NEXT_PUBLIC_SECRET_KEY: " SECRET_KEY
  echo
fi

echo "[1/9] Installing system dependencies"
apt update
apt install -y nginx curl git certbot python3-certbot-nginx

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

echo "[2/9] Preparing app directory"
mkdir -p "$APP_DIR"

if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "[3/9] Pulling latest source"
git -C "$APP_DIR" fetch origin
if git -C "$APP_DIR" show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git -C "$APP_DIR" checkout "$BRANCH"
else
  git -C "$APP_DIR" checkout -b "$BRANCH" "origin/$BRANCH"
fi
git -C "$APP_DIR" pull --ff-only origin "$BRANCH" || {
  echo "Fast-forward pull failed. Resolve local changes in $APP_DIR, then rerun."
  exit 1
}

echo "[4/9] Installing Node dependencies"
cd "$APP_DIR"
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

echo "[5/9] Writing production environment"
cat > "$APP_DIR/.env.production" <<EOF
NEXT_PUBLIC_BACKEND_URL=$API_URL
NEXT_PUBLIC_PUBLIC_KEY=$PUBLIC_KEY
NEXT_PUBLIC_SECRET_KEY=$SECRET_KEY
PORT=$PORT
NODE_ENV=production
EOF

echo "[6/9] Building Next.js app"
npm run build

echo "[7/9] Starting app with PM2"
PORT="$PORT" NODE_ENV=production pm2 start ecosystem.config.cjs --update-env || PORT="$PORT" NODE_ENV=production pm2 restart auth-frontend --update-env
pm2 save

PM2_STARTUP_CMD="$(pm2 startup systemd -u root --hp /root | tail -n 1)"
if [[ -n "$PM2_STARTUP_CMD" ]]; then
  eval "$PM2_STARTUP_CMD"
fi

echo "[8/9] Configuring Nginx"
cat > "/etc/nginx/sites-available/$DOMAIN" <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sfn "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t
systemctl reload nginx

echo "[9/9] Enabling HTTPS"
if [[ -n "$EMAIL" ]]; then
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect
else
  certbot --nginx -d "$DOMAIN"
fi

echo
echo "Deployment complete"
echo "Frontend URL: https://$DOMAIN"
echo "Check logs: pm2 logs auth-frontend"
