# Deploy Next.js Frontend To VPS (With Laravel API On Same Server)

This frontend is a Next.js app and must run as a Node.js process.
Your Laravel API can continue running with PHP-FPM/Nginx as-is.

## Quick path: one command bootstrap

This repo includes an automation script at deploy/bootstrap-vps-frontend.sh.

Run on your VPS as root:

sudo bash deploy/bootstrap-vps-frontend.sh \
    --domain auth.analogueshifts.com \
    --api-url https://api.analogueshifts.com \
    --repo git@github.com:analogueshifts/auth.analogueshifts.com.git \
    --branch master \
    --email you@example.com

You can also pass keys directly:

sudo bash deploy/bootstrap-vps-frontend.sh \
    --domain auth.analogueshifts.com \
    --api-url https://api.analogueshifts.com \
    --repo git@github.com:analogueshifts/auth.analogueshifts.com.git \
    --public-key your-public-key \
    --secret-key your-secret-key

## 1) Prepare server packages

On your VPS:

- Install Node.js 20 LTS
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

NEXT_PUBLIC_BACKEND_URL=https://api.analogueshifts.com
NEXT_PUBLIC_PUBLIC_KEY=your-public-key
NEXT_PUBLIC_SECRET_KEY=your-secret-key
PORT=3000
NODE_ENV=production

Important:

- NEXT_PUBLIC_BACKEND_URL must point to your deployed Laravel API base URL
- If your API is under a path, include it (example: https://api.example.com/api)

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

cd /var/www/auth.analogueshifts.com
git pull
npm install
npm run build
pm2 restart auth-frontend

## 8) CORS and API notes

Because frontend and API are on different subdomains, ensure Laravel CORS allows:

- https://auth.analogueshifts.com

Also ensure any auth/session settings in Laravel match your auth strategy.
This frontend stores token in browser cookie and sends Bearer tokens on requests.

## 9) Quick troubleshooting

- 502 Bad Gateway: frontend app is not running on port 3000
- API calls failing: incorrect NEXT_PUBLIC_BACKEND_URL
- CORS error: Laravel CORS config missing frontend origin
- Mixed content: ensure both frontend and API use HTTPS
