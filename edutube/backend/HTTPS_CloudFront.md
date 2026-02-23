# Serve API over HTTPS (fix Mixed Content with Amplify)

Your frontend is on **HTTPS** (Amplify). Browsers block **HTTP** API calls from HTTPS pages (Mixed Content). The API must be called over **HTTPS**.

**Easiest option (no domain):** Put your EC2 backend behind **AWS CloudFront**. CloudFront gives you an HTTPS URL (e.g. `https://d1234abcd.cloudfront.net`). The browser talks to CloudFront over HTTPS; CloudFront talks to EC2 over HTTP.

---

## 1. Create a CloudFront distribution

1. **AWS Console** → **CloudFront** → **Create distribution**.

2. **Origin:**
   - **Origin domain:** Choose **Create custom origin** or enter your EC2 address.
   - **Origin domain:** `65.1.133.54` (or your EC2 public IP).
   - **Protocol:** **HTTP only**.
   - **Port:** **5000** (if the app runs on 5000) or **80** (if you use Nginx on 80).
   - **Name** (auto-filled): e.g. `EC2-API`.

3. **Default cache behavior:**
   - **Viewer protocol policy:** **Redirect HTTP to HTTPS** (so all requests use HTTPS).
   - **Allowed HTTP methods:** GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE.
   - **Cache policy:** **CachingDisabled** (or a custom policy that disables caching for `/api/*`) so API responses are not cached.

4. **Settings:**
   - **Price class:** Use default or “Use only North America and Europe” to save cost.
   - **Alternate domain (CNAME):** Leave empty unless you have a domain.

5. **Create distribution.** Wait until status is **Deployed**.

6. Copy the **Distribution domain name** (e.g. `d1234abcd.cloudfront.net`). Your API base URL is:
   ```text
   https://d1234abcd.cloudfront.net
   ```
   (no trailing slash, no port)

---

## 2. Update frontend API URL

In the frontend code, set the API base to this **HTTPS** URL:

- **`src/api/index.js`:** `apiurl = "https://YOUR_DISTRIBUTION_ID.cloudfront.net/api/v1"`
- **`src/components/Chatbot.jsx`:** use `"https://YOUR_DISTRIBUTION_ID.cloudfront.net/api/v1/chatbot/chat"`

Replace `YOUR_DISTRIBUTION_ID` with your actual CloudFront domain (e.g. `d1234abcd`).

Redeploy the frontend (e.g. push to trigger Amplify build).

---

## 3. Backend CORS

On EC2, the backend `.env` should allow the Amplify origin:

```env
FRONTEND_URL=https://vashishta.d12rp6k6j03qru.amplifyapp.com
```

Restart the backend after changing `.env`.

---

## 4. (Optional) Restrict CloudFront to your API

If you want CloudFront to only forward to your API path, you can use a custom cache behavior with path pattern `/api/*` and forward to the same origin. Default behavior with “CachingDisabled” is enough for a single API origin.

---

## Summary

| Step | Action |
|------|--------|
| 1 | CloudFront → Create distribution, origin = EC2 IP, port 5000 (or 80), HTTP only |
| 2 | Viewer protocol: Redirect HTTP to HTTPS; cache: CachingDisabled |
| 3 | Copy CloudFront URL (e.g. `https://d1234.cloudfront.net`) |
| 4 | In frontend, set API base to `https://d1234.cloudfront.net` (and `/api/v1` where used) |
| 5 | Redeploy frontend; ensure backend has `FRONTEND_URL` for CORS |

After this, the Amplify app will call the API over HTTPS and Mixed Content errors will stop.
