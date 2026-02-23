/**
 * EduTube Extension — side panel app.
 * Auth, journeys list (create/delete), and per-journey videos (add/delete).
 * All data persists in backend (MongoDB).
 */

const API_BASE = 'https://d69mtih07yogo.cloudfront.net/api/v1';
const FRONTEND_BASE = 'https://vashishta.d12rp6k6j03qru.amplifyapp.com';
const STORAGE_TOKEN_KEY = 'edutube_token';
const STORAGE_USER_KEY = 'edutube_user';

// ----- Storage helpers -----
function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_TOKEN_KEY], (data) => resolve(data[STORAGE_TOKEN_KEY] || null));
  });
}

function setToken(token) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_TOKEN_KEY]: token }, resolve);
  });
}

function setUser(user) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_USER_KEY]: user }, resolve);
  });
}

function getUser() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_USER_KEY], (data) => resolve(data[STORAGE_USER_KEY] || null));
  });
}

function clearAuth() {
  return new Promise((resolve) => {
    chrome.storage.local.remove([STORAGE_TOKEN_KEY, STORAGE_USER_KEY], resolve);
  });
}

// ----- API helpers -----
async function api(method, path, body = null, token = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  const t = token ?? await getToken();
  if (t) opts.headers['Authorization'] = `Bearer ${t}`;
  if (body && (method === 'POST' || method === 'PUT')) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {}
  if (!res.ok) {
    const msg = (data && data.detail) ? (Array.isArray(data.detail) ? data.detail.map(d => d.msg).join(', ') : data.detail) : res.statusText;
    throw new Error(msg || 'Request failed');
  }
  return data;
}

// ----- Auth API -----
async function login(email, password) {
  const data = await api('POST', '/users/login', { email, password });
  return data.token;
}

async function fetchProfile() {
  return api('GET', '/users/profile');
}

// ----- Journeys API -----
async function getJourneys() {
  return api('GET', '/journeys');
}

async function createJourney(title, description = '') {
  return api('POST', '/journeys', {
    title: title || 'Untitled Journey',
    description: description || '',
    is_public: true,
  });
}

async function deleteJourney(id) {
  return api('DELETE', `/journeys/${id}`);
}

// ----- Chapters (videos) API -----
async function getChapters(journeyId) {
  return api('GET', `/journeys/${journeyId}/chapters`);
}

async function addChapter(journeyId, { title, video_link, chapter_no }) {
  return api('POST', `/journeys/${journeyId}/chapters`, {
    title: title || 'Untitled',
    description: '',
    video_link,
    external_link: '',
    chapter_no: chapter_no ?? 1,
  });
}

async function deleteChapter(chapterId) {
  return api('DELETE', `/journeys/chapters/${chapterId}`);
}

// ----- DOM: show view -----
function showView(viewId) {
  document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'));
  const el = document.getElementById(viewId);
  if (el) el.classList.remove('hidden');
}

// ----- Auth view -----
function initAuthView() {
  const loginForm = document.getElementById('login-form-el');
  const authError = document.getElementById('auth-error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    authError.textContent = '';
    const btn = document.getElementById('login-btn');
    btn.disabled = true;
    try {
      const token = await login(email, password);
      await setToken(token);
      const user = await fetchProfile();
      await setUser(user);
      showDashboard();
    } catch (err) {
      authError.textContent = err.message || 'Sign in failed';
    } finally {
      btn.disabled = false;
    }
  });
}

// ----- Dashboard view -----
function showDashboard() {
  showView('dashboard-view');
  renderGreeting();
  loadJourneys();
}

function renderGreeting() {
  const nameEl = document.getElementById('user-name');
  getUser().then((user) => {
    nameEl.textContent = user ? user.username || user.email || 'User' : 'User';
  });
}

async function loadJourneys() {
  const list = document.getElementById('journeys-list');
  const empty = document.getElementById('journeys-empty');
  list.innerHTML = '';
  empty.classList.add('hidden');
  try {
    const journeys = await getJourneys();
    if (!journeys || journeys.length === 0) {
      empty.classList.remove('hidden');
      return;
    }
    journeys.forEach((j) => {
      const card = document.createElement('div');
      card.className = 'card card-clickable';
      card.setAttribute('data-journey-id', j.id);
      card.innerHTML = `
        <span class="card-title">${escapeHtml(j.title || 'Untitled')}</span>
        <div class="card-actions">
          <button type="button" class="btn btn-ghost btn-sm btn-view-journey" data-id="${escapeHtml(j.id)}" title="Open journey on website">View</button>
          <button type="button" class="btn btn-danger btn-delete-journey" data-id="${escapeHtml(j.id)}" title="Delete journey">Delete</button>
        </div>
      `;
      card.querySelector('.card-title').addEventListener('click', () => openJourney(j.id, j.title));
      card.querySelector('.btn-view-journey').addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(`${FRONTEND_BASE}/journey/${j.id}`, '_blank', 'noopener');
      });
      card.querySelector('.btn-delete-journey').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteJourneyConfirm(j.id, j.title, card);
      });
      list.appendChild(card);
    });
  } catch (err) {
    empty.textContent = err.message || 'Failed to load journeys';
    empty.classList.remove('hidden');
  }
}

function deleteJourneyConfirm(id, title, cardEl) {
  if (!confirm(`Delete journey "${title || 'Untitled'}"? This cannot be undone.`)) return;
  deleteJourney(id)
    .then(() => {
      cardEl.remove();
      const list = document.getElementById('journeys-list');
      if (list.children.length === 0) document.getElementById('journeys-empty').classList.remove('hidden');
    })
    .catch((err) => alert(err.message || 'Delete failed'));
}

function openJourney(journeyId, title) {
  document.getElementById('journey-view-title').textContent = title || 'Journey';
  document.getElementById('journey-view').setAttribute('data-journey-id', journeyId);
  showView('journey-view');
  loadVideos(journeyId);
}

// ----- Journey (videos) view -----
function getCurrentJourneyId() {
  return document.getElementById('journey-view').getAttribute('data-journey-id');
}

async function loadVideos(journeyId) {
  const list = document.getElementById('videos-list');
  const empty = document.getElementById('videos-empty');
  list.innerHTML = '';
  empty.classList.add('hidden');
  try {
    const chapters = await getChapters(journeyId);
    if (!chapters || chapters.length === 0) {
      empty.classList.remove('hidden');
      return;
    }
    chapters.forEach((ch) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <span class="card-title" title="${escapeHtml(ch.video_link || '')}">${escapeHtml(ch.title || 'Untitled')}</span>
        <div class="card-actions">
          <button type="button" class="btn btn-ghost btn-sm btn-view-video" title="Open video">View</button>
          <button type="button" class="btn btn-danger btn-delete-video" data-id="${escapeHtml(ch.id)}" title="Remove video">Delete</button>
        </div>
      `;
      const playerUrl = `${FRONTEND_BASE}/player/${ch.id}`;
      card.querySelector('.card-title').addEventListener('click', () => {
        window.open(playerUrl, '_blank', 'noopener');
      });
      card.querySelector('.btn-view-video').addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(playerUrl, '_blank', 'noopener');
      });
      card.querySelector('.btn-delete-video').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteVideoConfirm(ch.id, card);
      });
      list.appendChild(card);
    });
  } catch (err) {
    empty.textContent = err.message || 'Failed to load videos';
    empty.classList.remove('hidden');
  }
}

function deleteVideoConfirm(chapterId, cardEl) {
  if (!confirm('Remove this video from the journey?')) return;
  deleteChapter(chapterId)
    .then(() => {
      cardEl.remove();
      const list = document.getElementById('videos-list');
      if (list.children.length === 0) document.getElementById('videos-empty').classList.remove('hidden');
    })
    .catch((err) => alert(err.message || 'Delete failed'));
}

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

// ----- Modals & buttons -----
function initDashboardButtons() {
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await clearAuth();
    showView('auth-view');
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
  });

  const createBtn = document.getElementById('create-journey-btn');
  const modal = document.getElementById('create-journey-modal');
  const form = document.getElementById('create-journey-form');
  const cancelBtn = document.getElementById('cancel-create-journey');

  createBtn.addEventListener('click', () => {
    document.getElementById('new-journey-title').value = '';
    document.getElementById('new-journey-desc').value = '';
    modal.showModal();
  });

  cancelBtn.addEventListener('click', () => modal.close());

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('new-journey-title').value.trim() || 'Untitled Journey';
    const description = document.getElementById('new-journey-desc').value.trim();
    modal.close();
    try {
      await createJourney(title, description);
      loadJourneys();
    } catch (err) {
      alert(err.message || 'Failed to create journey');
    }
  });
}

function initJourneyViewButtons() {
  document.getElementById('back-to-dashboard').addEventListener('click', () => showDashboard());

  const addVideoBtn = document.getElementById('add-video-btn');
  const modal = document.getElementById('add-video-modal');
  const form = document.getElementById('add-video-form');
  const cancelBtn = document.getElementById('cancel-add-video');

  addVideoBtn.addEventListener('click', () => {
    document.getElementById('new-video-title').value = '';
    document.getElementById('new-video-url').value = '';
    modal.showModal();
  });

  cancelBtn.addEventListener('click', () => modal.close());

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const journeyId = getCurrentJourneyId();
    const title = document.getElementById('new-video-title').value.trim() || 'Untitled';
    const videoLink = document.getElementById('new-video-url').value.trim();
    if (!videoLink) {
      alert('Please enter a video URL');
      return;
    }
    modal.close();
    try {
      const chapters = await getChapters(journeyId);
      const chapterNo = (chapters && chapters.length) ? chapters.length + 1 : 1;
      await addChapter(journeyId, { title, video_link: videoLink, chapter_no: chapterNo });
      loadVideos(journeyId);
    } catch (err) {
      alert(err.message || 'Failed to add video');
    }
  });
}

// ----- Init -----
function init() {
  initAuthView();
  initDashboardButtons();
  initJourneyViewButtons();

  getToken().then((token) => {
    if (token) {
      fetchProfile()
        .then((user) => setUser(user).then(() => showDashboard()))
        .catch(() => {
          clearAuth();
          showView('auth-view');
        });
    } else {
      showView('auth-view');
    }
  });
}

init();
