# Deploy Next.js Frontend To VPS (With Laravel API On Same Server)

This frontend is a Next.js app and must run as a Node.js process.
Your Laravel API can continue running with PHP-FPM/Nginx as-is.

## Quick path: one command bootstrap

This repo includes an automation script at deploy/bootstrap-vps-frontend.sh.

Run on your VPS as root:

```bash
sudo bash deploy/bootstrap-vps-frontend.sh \
  --app-name auth-frontend \
  --domain auth.analogueshifts.com \
  --api-url https://api.analogueshifts.com \
  --repo git@github.com:analogueshifts/auth.analogueshifts.com.git \
  --branch master \
  --email you@example.com
```

For additional Next.js apps on the same server, use different ports:

```bash
sudo bash deploy/bootstrap-vps-frontend.sh \
  --app-name jobs-frontend \
  --domain jobs.analogueshifts.com \
  --api-url https://api.analogueshifts.com \
  --repo git@github.com:analogueshifts/jobs.analogueshifts.com.git \
  --port 3001 \
  --email you@example.com
```

Each app runs on its own port (3000, 3001, 3002, etc) and Nginx routes requests by domain.

The script will:
1. Install Node, PM2, Nginx, Certbot (first app only)
2. Pull the repo into /var/www/<domain>
3. Create .env.production
4. Build and start with PM2
5. Configure Nginx reverse proxy per domain
6. Issue SSL certificate
- Install PM2
- Ensure Nginx is installed

Recommended commands:

sudo apt update
sudo apt install -y nginx curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

## 2) Place project on server

Example target directory:

- /var/www/auth.analogueshifts.com

Copy code there, then:

cd /var/www/auth.analogueshifts.com
npm install

## 3) Create production env

Create .env.production in the project root:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.analogueshifts.com
PORT=3000
NODE_ENV=production
```

Important:

- NEXT_PUBLIC_BACKEND_URL must point to your deployed Laravel API base URL
- If your API is under a path, include it (example: https://api.example.com/api)
- PORT should differ if you run multiple Next.js apps on same server (3000, 3001, 3002, etc)

## 4) Build and run with PM2

cd /var/www/auth.analogueshifts.com
npm run build
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup

Verify process:

pm2 list
pm2 logs auth-frontend

## 5) Configure Nginx for frontend domain

Create Nginx site file, for example:

- /etc/nginx/sites-available/auth.analogueshifts.com

Server block example:

server {
    listen 80;
    server_name auth.analogueshifts.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

Enable and reload:

sudo ln -s /etc/nginx/sites-available/auth.analogueshifts.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

## 6) Add SSL (Let us Encrypt)

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d auth.analogueshifts.com

## 7) Deploy updates

On each deploy:

```bash
cd /var/www/auth.analogueshifts.com
git pull
npm install
npm run build
pm2 restart auth-frontend
```

## 8) Multiple Next.js apps on same server

You can deploy multiple Next.js apps to the same VPS, each on its own port.

Example setup:
- auth.analogueshifts.com → port 3000
- jobs.analogueshifts.com → port 3001
- admin.analogueshifts.com → port 3002

For each app:
1. Get the repo URL
2. Pick a unique port (3000, 3001, 3002, etc)
3. Run bootstrap with that port:

```bash
sudo bash deploy/bootstrap-vps-frontend.sh \
  --app-name jobs-frontend \
  --domain jobs.analogueshifts.com \
  --api-url https://api.analogueshifts.com \
  --repo git@github.com:analogueshifts/jobs.analogueshifts.com.git \
  --port 3001 \
  --email you@example.com
```

PM2 manages all apps. Check status with:

```bash
pm2 list
pm2 logs auth-frontend
pm2 logs jobs-frontend
```

Nginx automatically routes by domain to the correct port.

## 9) CORS and API notes

Because frontend and API are on different subdomains, ensure Laravel CORS allows:

- https://auth.analogueshifts.com
- https://jobs.analogueshifts.com (if deployed)
- etc

Also ensure any auth/session settings in Laravel match your auth strategy.
This frontend stores token in browser cookie and sends Bearer tokens on requests.

## 10) Quick troubleshooting

- 502 Bad Gateway: frontend app is not running on the assigned port
- API calls failing: incorrect NEXT_PUBLIC_BACKEND_URL
- CORS error: Laravel CORS config missing frontend origin
- Mixed content: ensure both frontend and API use HTTPS
- Port conflict: if port 3000 is already in use, assign different port with --port flag
