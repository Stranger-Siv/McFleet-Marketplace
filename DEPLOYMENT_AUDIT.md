# 🚨 Production Deployment Audit Report

**Date:** 2025-01-14  
**Frontend:** Netlify (https://mcfleet.shop)  
**Backend:** Render (https://mcfleet-marketplace-4inq.onrender.com)

---

## ✅ CORRECT CONFIGURATIONS

### Frontend
- ✅ All API calls use `import.meta.env.VITE_API_BASE_URL` with fallback
- ✅ OAuth login correctly redirects to `${apiBaseUrl}/api/auth/discord`
- ✅ Auth success handler exists at `/auth/success` route
- ✅ No hardcoded backend URLs in source code (only in docs)
- ✅ Environment variable name is consistent: `VITE_API_BASE_URL`

### Backend
- ✅ Discord OAuth routes exist:
  - `/api/auth/discord` (line 24 in auth.routes.js)
  - `/api/auth/discord/callback` (line 26 in auth.routes.js)
- ✅ Server listens on `0.0.0.0` for Render deployment
- ✅ FRONTEND_URL sanitization and validation implemented
- ✅ Passport Discord strategy correctly configured

### OAuth Flow
- ✅ Callback redirects to `${FRONTEND_URL}/auth/success?token=...`
- ✅ Token is properly extracted and stored in frontend

---

## ❌ CRITICAL ISSUES

### 1. **CORS Configuration - SECURITY RISK** 🔴

**Location:** `backend/src/app.js:9`

**Issue:**
```javascript
app.use(cors()); // ❌ Allows ALL origins - SECURITY RISK
```

**Risk:** Any website can make requests to your API, potentially leading to:
- CSRF attacks
- Unauthorized data access
- API abuse

**Fix:**
```javascript
// backend/src/app.js
import cors from 'cors';

const corsOptions = {
  origin: [
    'https://mcfleet.shop',
    'https://www.mcfleet.shop',
    'http://localhost:5173', // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

---

### 2. **Discord OAuth Callback URL Mismatch** 🔴

**Issue:** Documentation and environment variables reference `api.mcfleet.shop`, but backend is deployed on Render.

**Current State:**
- Backend URL: `https://mcfleet-marketplace-4inq.onrender.com`
- Documentation says: `https://api.mcfleet.shop/api/auth/discord/callback`
- Discord Developer Portal likely configured with wrong URL

**Required Actions:**

1. **Update Discord Developer Portal:**
   - Go to: https://discord.com/developers/applications
   - Navigate to: OAuth2 → General
   - Set Redirect URI to:
     ```
     https://mcfleet-marketplace-4inq.onrender.com/api/auth/discord/callback
     ```

2. **Update Backend Environment Variables (Render Dashboard):**
   ```bash
   DISCORD_CALLBACK_URL=https://mcfleet-marketplace-4inq.onrender.com/api/auth/discord/callback
   FRONTEND_URL=https://mcfleet.shop
   ```

3. **Verify in `backend/src/config/passport.js`:**
   - Line 11 uses `process.env.DISCORD_CALLBACK_URL` ✅ (Correct)

---

### 3. **Netlify Redirects File - Syntax Error** 🟡

**Location:** `frontend/public/_redirects`

**Current Content:**
```
/*    /index.html   200
```

**Issue:** Missing proper redirect rule format. This may not work correctly for SPA routing.

**Fix:**
```
/*    /index.html   200
```

**OR better (with force):**
```
/*    /index.html   200!
```

**Note:** The `200` status tells Netlify to serve `index.html` for all routes (SPA routing). The `!` forces the rewrite even if the file exists.

---

### 4. **Environment Variable Name Mismatch** 🟡

**User Query Mentioned:** `VITE_API_URL`  
**Actual Code Uses:** `VITE_API_BASE_URL`

**Impact:** If Netlify environment variable is set as `VITE_API_URL`, it won't work.

**Fix Options:**

**Option A:** Update Netlify to use `VITE_API_BASE_URL` (Recommended)
- In Netlify Dashboard → Site Settings → Environment Variables
- Set: `VITE_API_BASE_URL` = `https://mcfleet-marketplace-4inq.onrender.com`

**Option B:** Update code to use `VITE_API_URL` (Not recommended - requires code changes)

---

### 5. **Missing Netlify Environment Variable** 🟡

**Issue:** Frontend `.env` file was removed, but Netlify may not have the environment variable set.

**Required Action:**
1. Go to Netlify Dashboard
2. Site Settings → Environment Variables
3. Add:
   ```
   VITE_API_BASE_URL = https://mcfleet-marketplace-4inq.onrender.com
   ```
4. Redeploy frontend

---

### 6. **Documentation Outdated** 🟡

**Files with outdated URLs:**
- `DEPLOYMENT_ENV.md` - References `api.mcfleet.shop`
- `NGINX_SETUP.md` - References `api.mcfleet.shop` (not applicable for Render)
- `frontend/src/api/API_REFERENCE.md` - References `api.mcfleet.shop`

**Impact:** Low - Only affects documentation, not runtime

**Fix:** Update documentation to reflect Render deployment

---

## 🔧 REQUIRED FIXES (Priority Order)

### Priority 1: CRITICAL (Fix Immediately)

1. **Fix CORS Configuration**
   ```javascript
   // backend/src/app.js
   const corsOptions = {
     origin: ['https://mcfleet.shop', 'https://www.mcfleet.shop'],
     credentials: true,
   };
   app.use(cors(corsOptions));
   ```

2. **Update Discord OAuth Callback URL**
   - Discord Developer Portal: `https://mcfleet-marketplace-4inq.onrender.com/api/auth/discord/callback`
   - Render Environment: `DISCORD_CALLBACK_URL=https://mcfleet-marketplace-4inq.onrender.com/api/auth/discord/callback`

3. **Set Netlify Environment Variable**
   - `VITE_API_BASE_URL` = `https://mcfleet-marketplace-4inq.onrender.com`

### Priority 2: IMPORTANT (Fix Soon)

4. **Fix Netlify Redirects File**
   ```
   /*    /index.html   200!
   ```

5. **Verify Render Environment Variables**
   ```bash
   # Required in Render Dashboard:
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_CLIENT_SECRET=your_client_secret
   DISCORD_CALLBACK_URL=https://mcfleet-marketplace-4inq.onrender.com/api/auth/discord/callback
   FRONTEND_URL=https://mcfleet.shop
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_uri
   NODE_ENV=production
   PORT=10000  # Render default, or your custom port
   ```

### Priority 3: NICE TO HAVE

6. **Update Documentation** - Reflect Render deployment instead of Nginx/api.mcfleet.shop

---

## ✅ VERIFICATION CHECKLIST

After applying fixes, verify:

- [ ] CORS only allows `https://mcfleet.shop`
- [ ] Discord OAuth callback URL matches Render URL exactly
- [ ] Netlify has `VITE_API_BASE_URL` environment variable set
- [ ] Render has all required environment variables
- [ ] Frontend can make API calls to backend
- [ ] Discord login flow works end-to-end
- [ ] SPA routing works (try direct URL: `https://mcfleet.shop/seller/dashboard`)
- [ ] No CORS errors in browser console
- [ ] No 401/403 errors on authenticated routes

---

## 🧪 TESTING COMMANDS

### Test Backend CORS
```bash
curl -H "Origin: https://mcfleet.shop" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS \
     https://mcfleet-marketplace-4inq.onrender.com/api/auth/me
```

### Test Discord OAuth
1. Visit: `https://mcfleet.shop/login`
2. Click "Login with Discord"
3. Should redirect to: `https://discord.com/oauth2/authorize?...`
4. After authorization, should redirect to: `https://mcfleet-marketplace-4inq.onrender.com/api/auth/discord/callback`
5. Then redirect to: `https://mcfleet.shop/auth/success?token=...`

---

## 📝 SUMMARY

**Critical Issues:** 2 (CORS, Discord OAuth URL)  
**Important Issues:** 2 (Netlify redirects, Environment variables)  
**Minor Issues:** 1 (Documentation)

**Overall Status:** ⚠️ **NOT PRODUCTION READY** - Fix critical issues before going live.

---

## 🚀 DEPLOYMENT FLOW VERIFICATION

### Expected Flow:
1. User visits `https://mcfleet.shop/login`
2. Clicks "Login with Discord"
3. Redirects to: `https://mcfleet-marketplace-4inq.onrender.com/api/auth/discord`
4. Discord OAuth page
5. Callback: `https://mcfleet-marketplace-4inq.onrender.com/api/auth/discord/callback`
6. Backend redirects to: `https://mcfleet.shop/auth/success?token=...`
7. Frontend extracts token and stores it
8. User redirected to role-based dashboard

**All URLs must match exactly in:**
- Frontend code
- Backend environment variables
- Discord Developer Portal
- Netlify environment variables

