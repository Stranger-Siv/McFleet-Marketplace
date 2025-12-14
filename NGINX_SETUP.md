# Nginx Configuration for McFleet Marketplace API

## Backend API Setup

### 1. Backend Server Configuration

The backend server is configured to listen on `0.0.0.0` (all interfaces) on port `5001` by default.

**Environment Variables:**
```bash
PORT=5001  # or your preferred port
HOST=0.0.0.0  # Required for nginx to connect
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=https://api.mcfleet.shop/api/auth/discord/callback
FRONTEND_URL=https://mcfleet.shop  # or your frontend URL
```

### 2. Nginx Configuration

Create or edit `/etc/nginx/sites-available/api.mcfleet.shop`:

```nginx
server {
    listen 80;
    server_name api.mcfleet.shop;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.mcfleet.shop;

    # SSL Certificate Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Increase timeouts for long-running requests
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    # Increase body size for file uploads
    client_max_body_size 10M;

    # Proxy to Node.js backend
    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers (if needed, though backend handles CORS)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # Health check endpoint (optional)
    location /health {
        proxy_pass http://127.0.0.1:5001/api/auth/me;
        access_log off;
    }
}
```

### 3. Enable the Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/api.mcfleet.shop /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4. Backend Process Management (PM2)

Install PM2 to keep the backend running:

```bash
# Install PM2 globally
npm install -g pm2

# Navigate to backend directory
cd /path/to/backend

# Start the backend with PM2
pm2 start src/server.js --name mcfleet-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### 5. Troubleshooting Bad Gateway Error

**Check if backend is running:**
```bash
# Check if Node.js process is running
ps aux | grep node

# Check if port 5001 is listening
netstat -tulpn | grep 5001
# or
ss -tulpn | grep 5001

# Check PM2 status
pm2 status
pm2 logs mcfleet-api
```

**Check nginx error logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

**Test backend directly:**
```bash
# Test if backend responds on localhost
curl http://127.0.0.1:5001/api/auth/me

# Test from server
curl http://localhost:5001/api/auth/me
```

**Common Issues:**

1. **Backend not running:**
   - Start with PM2: `pm2 start src/server.js --name mcfleet-api`
   - Check logs: `pm2 logs mcfleet-api`

2. **Wrong port in nginx config:**
   - Ensure nginx `proxy_pass` matches backend PORT (default: 5001)
   - Check: `proxy_pass http://127.0.0.1:5001;`

3. **Backend listening on wrong interface:**
   - Backend should listen on `0.0.0.0` (all interfaces)
   - Check server.js: `app.listen(PORT, '0.0.0.0', ...)`

4. **Firewall blocking:**
   - Ensure port 5001 is accessible locally (nginx → backend)
   - External access not needed (nginx handles external traffic)

5. **Environment variables missing:**
   - Check `.env` file exists in backend directory
   - Verify all required variables are set

### 6. Verify Setup

```bash
# Test backend health
curl http://127.0.0.1:5001/api/auth/me

# Test through nginx
curl https://api.mcfleet.shop/api/auth/me

# Check nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### 7. Frontend Configuration

Update frontend `.env` or `axios.js`:
```javascript
// frontend/src/api/axios.js
baseURL: 'https://api.mcfleet.shop'
```

### 8. Discord OAuth Configuration

Update Discord Developer Portal:
- Redirect URI: `https://api.mcfleet.shop/api/auth/discord/callback`
- Update `.env`: `DISCORD_CALLBACK_URL=https://api.mcfleet.shop/api/auth/discord/callback`

---

## Quick Fix Checklist

- [ ] Backend is running (check with `pm2 status`)
- [ ] Backend listens on `0.0.0.0:5001` (check server.js)
- [ ] Nginx config points to `http://127.0.0.1:5001`
- [ ] Nginx config is valid (`sudo nginx -t`)
- [ ] Nginx is reloaded (`sudo systemctl reload nginx`)
- [ ] Environment variables are set correctly
- [ ] MongoDB is connected (check backend logs)
- [ ] SSL certificate is valid
- [ ] Firewall allows localhost connections

