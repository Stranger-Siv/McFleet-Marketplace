# Environment Variables for Deployment

## Backend (.env file)

Create a `.env` file in the `backend/` directory with the following variables:

```bash
# Server Configuration
PORT=5001
HOST=0.0.0.0

# Database
MONGODB_URI=mongodb://localhost:27017/mcfleet
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mcfleet

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters

# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=https://api.mcfleet.shop/api/auth/discord/callback

# Frontend URL (IMPORTANT: No spaces, no special characters, just the URL)
FRONTEND_URL=https://mcfleet.shop
# OR if using www:
# FRONTEND_URL=https://www.mcfleet.shop

# Node Environment
NODE_ENV=production
```

## ⚠️ CRITICAL: FRONTEND_URL Format

**CORRECT:**
```bash
FRONTEND_URL=https://mcfleet.shop
FRONTEND_URL=https://www.mcfleet.shop
FRONTEND_URL=http://localhost:5173  # for local development
```

**WRONG (Will cause errors):**
```bash
FRONTEND_URL=www.mcfleet.shop || mcfleet.shop  # ❌ NO spaces or || operators
FRONTEND_URL=mcfleet.shop  # ❌ Missing https://
FRONTEND_URL=https://mcfleet.shop/  # ⚠️ Trailing slash is OK (will be removed automatically)
FRONTEND_URL="https://mcfleet.shop"  # ⚠️ Quotes are OK but not necessary
```

## Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# API Base URL
VITE_API_BASE_URL=https://api.mcfleet.shop
```

## Discord Developer Portal Configuration

1. Go to https://discord.com/developers/applications
2. Select your application
3. Go to "OAuth2" → "General"
4. Add Redirect URI:
   ```
   https://api.mcfleet.shop/api/auth/discord/callback
   ```
5. Save changes

## Verification Checklist

- [ ] Backend `.env` file exists with all variables
- [ ] `FRONTEND_URL` is set correctly (no spaces, includes https://)
- [ ] `DISCORD_CALLBACK_URL` matches Discord Developer Portal
- [ ] `MONGODB_URI` is correct and accessible
- [ ] `JWT_SECRET` is a strong random string (32+ characters)
- [ ] Frontend `.env` has correct `VITE_API_BASE_URL`
- [ ] Backend is running on `0.0.0.0:5001`
- [ ] Nginx is configured correctly

## Testing

After setting environment variables:

1. **Restart backend:**
   ```bash
   pm2 restart mcfleet-api
   ```

2. **Test backend directly:**
   ```bash
   curl http://127.0.0.1:5001/api/auth/me
   ```

3. **Test Discord OAuth:**
   - Visit: `https://api.mcfleet.shop/api/auth/discord`
   - Should redirect to Discord
   - After authorization, should redirect to: `https://mcfleet.shop/auth/success?token=...`

## Common Errors

### "Cannot GET /api/auth/discord/www.mcfleet.shop..."
- **Cause:** `FRONTEND_URL` has spaces or special characters
- **Fix:** Set `FRONTEND_URL=https://mcfleet.shop` (no spaces, no || operators)

### "Bad Gateway"
- **Cause:** Backend not running or wrong port
- **Fix:** Check `pm2 status` and ensure backend listens on `0.0.0.0:5001`

### "Invalid redirect_uri"
- **Cause:** Discord callback URL doesn't match
- **Fix:** Ensure Discord Developer Portal has: `https://api.mcfleet.shop/api/auth/discord/callback`

