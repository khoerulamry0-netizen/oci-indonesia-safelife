# OCI Indonesia Safelife

Render-ready Web Service for the SWC & Safelife inventory dashboard.

The frontend is served locally by `server.mjs`. Requests to `/api/online` are proxied to the current public online inventory feed so the dashboard keeps refreshing its Google Sheets-backed data.
