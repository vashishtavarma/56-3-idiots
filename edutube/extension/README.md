# EduTube Chrome Extension

Opens a **right side panel** when you click the extension icon. The panel shows the EduTube **sign-in page**; after login it shows your **dashboard** (home).

## Flow

1. **Click extension icon** → Side panel opens with the sign-in page.
2. **Click "Sign up here"** → Opens the **landing page** in a new browser tab at `/land` (with WebP scroll section and Sign up at top right).
3. **On the landing page, click "Sign up"** (top right) → Opens the **signup page** in the same or new tab (`/auth?tab=signup`).
4. **After signing in** in the panel → The panel content switches to your **dashboard** (home). Other flows you can add later.

## Setup

1. **Icons**  
   Add PNGs to `icons/`: `icon16.png`, `icon48.png`, `icon128.png`.  
   See `icons/README.md`. Without them, Chrome may show a default icon.

2. **App URL**  
   In `sidepanel.js`, set `APP_ORIGIN`:
   - Dev: `http://localhost:5173` (with frontend running).
   - Production: your deployed app URL (e.g. `https://edutube.example.com`).

3. **Load the extension**
   - Open `chrome://extensions`.
   - Turn on **Developer mode**.
   - Click **Load unpacked** and select the `edutube/extension` folder.

4. **Use it**
   - Pin the extension if needed (puzzle icon → pin EduTube).
   - Click the EduTube icon to open the side panel.

## Files

- `manifest.json` – Extension config (side panel, permissions).
- `sidepanel.html` / `sidepanel.js` – Panel UI and iframe URL.
- `background.js` – Ensures the side panel opens when the action (icon) is clicked.
