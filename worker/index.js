/**
 * Plaza Real Silao — Worker gate for the investor data room.
 * Protects /inversionistas/data-room/* with a single shared password,
 * enforced server-side (the password lives as a Worker Secret, never in
 * the public files). Unlimited viewers, no per-email allowlist.
 *
 * Auth cookie is derived from the password via HMAC, so changing the
 * password (the DATAROOM_PASSWORD secret) instantly invalidates every
 * existing session.
 *
 * Only /inversionistas/data-room/* reaches this Worker (see wrangler.jsonc
 * run_worker_first); every other path is served as a static asset directly.
 */

const PREFIX = '/inversionistas/data-room';
const AUTH_COOKIE = 'dr_auth';
const WHO_COOKIE = 'dr_who';
const SESSION_SECONDS = 60 * 60 * 12; // 12 h

async function expectedToken(password) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('plaza-dataroom-auth-v1'));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function parseCookies(request) {
  const out = {};
  const header = request.headers.get('Cookie') || '';
  header.split(';').forEach(part => {
    const i = part.indexOf('=');
    if (i > -1) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  });
  return out;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function loginPage({ error = '', configured = true } = {}) {
  return `<!DOCTYPE html>
<html lang="es-MX"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Data Room — Acceso | Plaza Real Silao</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="/images/icons/icon-192x192.png">
<link rel="preload" href="/fonts/fraunces-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/main.css">
<style>
  .gate{min-height:100vh;display:grid;place-items:center;padding:2rem;background:linear-gradient(135deg,var(--espresso),var(--cocoa))}
  .gate-card{background:var(--surface);border-radius:var(--radius-lg);padding:clamp(1.75rem,5vw,2.75rem);max-width:440px;width:100%;box-shadow:var(--shadow-lg);text-align:center}
  .gate-icon{width:64px;height:64px;border-radius:50%;background:var(--sand);display:grid;place-items:center;margin:0 auto 1.25rem}
  .gate-icon .ico{width:1.8rem;height:1.8rem;color:var(--terracotta)}
  .gate h1{font-size:1.6rem;margin-bottom:.4rem}
  .gate p{color:var(--text-muted);font-size:.95rem;margin-bottom:1.5rem}
  .gate form{display:flex;flex-direction:column;gap:.75rem;text-align:left}
  .gate label{font-weight:600;font-size:.85rem}
  .gate input{width:100%;padding:.8rem 1rem;border:1.5px solid var(--line-strong);border-radius:var(--radius);font:inherit;background:var(--surface);color:var(--text)}
  .gate input:focus{outline:none;border-color:var(--terracotta)}
  .gate .btn{width:100%;margin-top:.5rem}
  .gate-err{background:#fbe9e6;color:#9a3b27;border-radius:var(--radius);padding:.6rem .9rem;font-size:.88rem;margin-bottom:1rem}
  .gate-note{font-size:.78rem;color:var(--text-muted);margin-top:1.25rem;margin-bottom:0}
</style></head>
<body>
  <div class="gate"><div class="gate-card">
    <div class="gate-icon"><svg class="ico" aria-hidden="true"><use href="/images/icons/sprite.svg#lock"></use></svg></div>
    <h1>Data Room</h1>
    <p>Plaza Real Silao · Acceso para inversionistas</p>
    ${error ? `<div class="gate-err">${error}</div>` : ''}
    ${configured ? `
    <form method="POST" autocomplete="off">
      <div><label for="who">Tu nombre</label>
        <input id="who" name="who" type="text" placeholder="Nombre y apellido" maxlength="80" required></div>
      <div><label for="password">Contraseña de acceso</label>
        <input id="password" name="password" type="password" placeholder="Contraseña" required autofocus></div>
      <button class="btn btn-primary" type="submit">Entrar al data room</button>
    </form>
    <p class="gate-note">Documentos confidenciales. Tu nombre quedará marcado en cada página. ¿No tienes acceso? Escribe a contacto@plazarealsilao.com</p>
    ` : ''}
  </div></div>
</body></html>`;
}

const HTML = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isProtected = url.pathname === PREFIX || url.pathname.startsWith(PREFIX + '/');
    if (!isProtected) return env.ASSETS.fetch(request);

    const password = env.DATAROOM_PASSWORD;
    if (!password) {
      return new Response(loginPage({ configured: false, error: 'El acceso todavía no está configurado.' }), { status: 503, headers: HTML });
    }
    const token = await expectedToken(password);

    if (request.method === 'POST') {
      let pw = '', who = '';
      try {
        const form = await request.formData();
        pw = (form.get('password') || '').toString();
        who = (form.get('who') || '').toString().slice(0, 80).replace(/[\r\n]/g, ' ').trim();
      } catch (_) { /* fallthrough to error */ }
      if (timingSafeEqual(pw, password)) {
        const attrs = `Path=${PREFIX}; Max-Age=${SESSION_SECONDS}; SameSite=Lax; Secure`;
        const headers = new Headers({ Location: url.pathname });
        headers.append('Set-Cookie', `${AUTH_COOKIE}=${token}; HttpOnly; ${attrs}`);
        headers.append('Set-Cookie', `${WHO_COOKIE}=${encodeURIComponent(who || 'Acceso autorizado')}; ${attrs}`);
        return new Response(null, { status: 303, headers });
      }
      return new Response(loginPage({ error: 'Contraseña incorrecta. Intenta de nuevo.' }), { status: 401, headers: HTML });
    }

    const cookies = parseCookies(request);
    if (cookies[AUTH_COOKIE] && timingSafeEqual(cookies[AUTH_COOKIE], token)) {
      return env.ASSETS.fetch(request);
    }
    return new Response(loginPage({}), { status: 401, headers: HTML });
  },
};
