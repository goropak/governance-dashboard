const LANG_KEY = 'lang';

export function getLang() {
  return localStorage.getItem(LANG_KEY) || 'en';
}

export function initLang() {
  const lang = getLang();
  document.documentElement.setAttribute('data-lang', lang);
  updateBtn(lang);
}

export function toggleLang(onToggle) {
  const next = getLang() === 'en' ? 'ko' : 'en';
  localStorage.setItem(LANG_KEY, next);
  document.documentElement.setAttribute('data-lang', next);
  updateBtn(next);
  if (typeof onToggle === 'function') onToggle();
}

function updateBtn(lang) {
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = lang === 'en' ? 'KO' : 'EN';
}
