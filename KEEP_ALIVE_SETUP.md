# Keep-Alive Setup Guide

Prevent cold starts on Render, Railway, or other hosting platforms by keeping your backend warm.

## Option 1: External Monitoring Service (Recommended)

### UptimeRobot (Free - 50 monitors)

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Sign up for free account
3. Add New Monitor:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: McFleet Backend Keep-Alive
   - **URL**: `https://your-backend-url.onrender.com/ping`
   - **Monitoring Interval**: 5 minutes
4. Save monitor

### Cron-job.org (Free)

1. Go to [cron-job.org](https://cron-job.org)
2. Sign up for free account
3. Create Cronjob:
   - **Title**: McFleet Keep-Alive
   - **Address**: `https://your-backend-url.onrender.com/ping`
   - **Schedule**: Every 5 minutes (`*/5 * * * *`)
4. Save cronjob

### EasyCron (Free)

1. Go to [easycron.com](https://www.easycron.com)
2. Sign up for free account
3. Create Cron Job:
   - **URL**: `https://your-backend-url.onrender.com/ping`
   - **Schedule**: Every 5 minutes
4. Save

## Option 2: Render Cron Job

If using Render:

1. Go to your Render dashboard
2. Create a new **Cron Job** service
3. Settings:
   - **Name**: `mcfleet-keep-alive`
   - **Schedule**: `*/5 * * * *` (every 5 minutes)
   - **Command**: `curl https://your-backend-url.onrender.com/ping`
   - **Plan**: Free

## Option 3: Local Keep-Alive Script

Run the keep-alive script locally (requires your computer to be on):

```bash
cd backend
export KEEP_ALIVE_URL=https://your-backend-url.onrender.com
npm run keep-alive
```

## Health Check Endpoints

Your backend now has two public endpoints:

1. **`GET /health`** - Health check with status and uptime
2. **`GET /ping`** - Simple keep-alive endpoint (returns "pong")

Both endpoints are public (no authentication required) and can be used by monitoring services.

## Recommended Setup

**Best Practice**: Use UptimeRobot or similar service
- Free tier available
- Reliable and doesn't require your computer
- Can also alert you if the backend goes down
- Works 24/7

## Testing

Test your endpoints:
```bash
# Health check
curl https://your-backend-url.onrender.com/health

# Keep-alive ping
curl https://your-backend-url.onrender.com/ping
```

Both should return JSON responses.

