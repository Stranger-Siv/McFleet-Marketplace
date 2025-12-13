/**
 * Keep-alive script to prevent cold starts
 * Run this script periodically (e.g., every 5 minutes) using a cron job or external service
 * 
 * Usage:
 * - Set KEEP_ALIVE_URL environment variable to your deployed backend URL
 * - Run: node keep-alive.js
 * 
 * Or use external services like:
 * - UptimeRobot (free tier: 50 monitors)
 * - Cron-job.org (free tier available)
 * - EasyCron (free tier available)
 */

import https from 'https';
import http from 'http';

const BACKEND_URL = process.env.KEEP_ALIVE_URL || process.env.BACKEND_URL || 'http://localhost:5001';

const pingBackend = () => {
    const url = new URL(`${BACKEND_URL}/ping`);
    const client = url.protocol === 'https:' ? https : http;

    const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'GET',
        timeout: 10000
    };

    const req = client.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log(`✅ Keep-alive ping successful: ${new Date().toISOString()}`);
            } else {
                console.log(`⚠️  Keep-alive ping returned status ${res.statusCode}`);
            }
        });
    });

    req.on('error', (error) => {
        console.error(`❌ Keep-alive ping failed: ${error.message}`);
    });

    req.on('timeout', () => {
        req.destroy();
        console.error('❌ Keep-alive ping timed out');
    });

    req.end();
};

// Ping immediately
pingBackend();

// Ping every 5 minutes (300000 ms)
// Adjust interval as needed (minimum recommended: 5 minutes for Render free tier)
const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

setInterval(pingBackend, INTERVAL_MS);

console.log(`🔄 Keep-alive service started. Pinging ${BACKEND_URL} every ${INTERVAL_MS / 1000} seconds`);

