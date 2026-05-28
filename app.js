const url = location.href;
const shareBtn = document.getElementById('shareBtn');
const copyBtn = document.getElementById('copyBtn');

// Comprueba si el dispositivo es Android leyendo el user-agent.
function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

// Detecta si la página va dentro de otra app (Instagram, Facebook, WebView).
// Gmail no: abre con Custom Tabs y el user-agent parece Chrome normal.
function isInAppBrowser() {
  const ua = navigator.userAgent || '';
  if (/FBAN|FBAV|Instagram|Line\/|Twitter|Snapchat|LinkedIn/i.test(ua)) return true;
  if (/wv\)/.test(ua) && /Android/i.test(ua)) return true;
  return false;
}

// Copia la URL actual. Sirve cuando Share no está o falla.
function tryCopy() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
    copyBtn.classList.add('copied');
    setTimeout(function () {
      copyBtn.classList.remove('copied');
    }, 1200);
  } else {
    prompt('Copia la URL:', url);
  }
}

// Abre el menú de compartir del sistema con esta página.
// En Gmail el usuario elige Chrome y sale del cliente de correo.
function tryShare() {
  if (!navigator.share) return false;
  navigator.share({ url: url }).catch(function (err) {
    if (err && err.name !== 'AbortError') {
      tryCopy();
    }
  });
  return true;
}

// Pide a Android abrir la misma URL vía intent:// (útil en algunos in-app).
function tryIntent() {
  let u;
  try {
    u = new URL(url);
  } catch (e) {
    return false;
  }
  const path = (u.pathname || '/') + (u.search || '');
  const intentUrl = 'intent://' + u.host + path + '#Intent;scheme=https;end';
  window.location.replace(intentUrl);
  return true;
}

copyBtn.onclick = tryCopy;

// Escritorio sin Web Share: el botón principal solo copia el enlace.
if (!navigator.share && !isAndroid()) {
  shareBtn.textContent = 'Copiar enlace';
  shareBtn.onclick = tryCopy;
  copyBtn.style.display = 'none';
} else {
  shareBtn.onclick = function () {
    if (isAndroid() && isInAppBrowser()) {
      tryIntent();
      setTimeout(function () {
        // Seguimos en la misma vista: probar Share.
        if (!document.hidden) tryShare();
      }, 500);
      return;
    }

    if (tryShare()) return;
    tryCopy();
  };
}

/*
 * v1 — primera entrega: Share en el botón principal y copiar en el icono.
 * Sin intent ni cascada. Si no había Share, el botón principal se deshabilitaba.
 *
 * const url = location.href;
 * const shareBtn = document.getElementById('shareBtn');
 * const copyBtn = document.getElementById('copyBtn');
 *
 * shareBtn.onclick = function () {
 *   if (!navigator.share) {
 *     shareBtn.disabled = true;
 *     return;
 *   }
 *   navigator.share({ url: url });
 * };
 *
 * copyBtn.onclick = function () {
 *   if (navigator.clipboard) {
 *     navigator.clipboard.writeText(url);
 *     copyBtn.classList.add('copied');
 *     setTimeout(function () {
 *       copyBtn.classList.remove('copied');
 *     }, 1200);
 *   } else {
 *     prompt('Copia la URL:', url);
 *   }
 * };
 */
