// App origin: use your deployed URL in production, or localhost for dev
const APP_ORIGIN = 'http://localhost:5173';

const frame = document.getElementById('app-frame');
// Start on auth; after login the app will redirect to / inside the iframe (dashboard)
frame.src = `${APP_ORIGIN}/auth`;
