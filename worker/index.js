/**
 * Plaza Real Silao — Data room gate (per-investor codes + access log).
 *
 * Protects /inversionistas/data-room/* server-side. Each investor has their
 * own code (e.g. "PlazaReal-silao-1001") stored in KV mapped to their name.
 * The code identifies the person, so the watermark + access log use their real
 * name automatically. Admin codes unlock the access-log page.
 *
 * KV (binding DATAROOM):
 *   code:<CODE>   -> investor name        e.g. code:PlazaReal-silao-1001 = "Juan Pérez"
 *   admin:<CODE>  -> admin name           e.g. admin:PlazaReal-ADMIN-xy = "Carlos"
 *   log:<ts>-<r>  -> JSON { name, role, time, ip, ua }
 *
 * Secrets: DATAROOM_COOKIE_SECRET (HMAC key for the session cookie).
 *
 * Only /inversionistas/data-room/* reaches this Worker (wrangler run_worker_first).
 */

const PREFIX = '/inversionistas/data-room';
const LOG_PATH = PREFIX + '/_accesos';
const SESS_COOKIE = 'dr_sess';
const WHO_COOKIE = 'dr_who';
const SESSION_SECONDS = 60 * 60 * 12; // 12 h
const HTML = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' };

const enc = new TextEncoder();

async function hmacHex(secret, msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0;
}
function b64urlEncode(str) {
  const bin = String.fromCharCode(...enc.encode(str));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(b64) {
  b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}
function parseCookies(request) {
  const out = {}; const h = request.headers.get('Cookie') || '';
  h.split(';').forEach(p => { const i = p.indexOf('='); if (i > -1) out[p.slice(0, i).trim()] = p.slice(i + 1).trim(); });
  return out;
}

async function makeSession(secret, name, role) {
  const payload = b64urlEncode(JSON.stringify({ n: name, r: role, e: Math.floor(Date.now() / 1000) + SESSION_SECONDS }));
  const sig = await hmacHex(secret, payload);
  return payload + '.' + sig;
}
async function readSession(secret, cookie) {
  if (!cookie || cookie.indexOf('.') < 0) return null;
  const [payload, sig] = cookie.split('.');
  const expected = await hmacHex(secret, payload);
  if (!timingSafeEqual(sig, expected)) return null;
  try {
    const data = JSON.parse(b64urlDecode(payload));
    if (!data.e || data.e < Math.floor(Date.now() / 1000)) return null;
    return data; // { n, r, e }
  } catch (_) { return null; }
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function loginPage({ error = '' } = {}) {
  return `<!DOCTYPE html><html lang="es-MX"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Data Room — Acceso | Plaza Real Silao</title><meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="/images/icons/icon-192x192.png">
<link rel="preload" href="/fonts/jakarta-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/main.css">
<style>
  .gate{min-height:100vh;display:grid;place-items:center;padding:2rem;background:linear-gradient(135deg,var(--ink),var(--coral-dark))}
  .gate-card{background:var(--surface);border-radius:var(--r-lg);padding:clamp(1.75rem,5vw,2.75rem);max-width:440px;width:100%;box-shadow:var(--shadow-lg);text-align:center}
  .gate-icon{width:64px;height:64px;border-radius:50%;background:var(--coral-soft);display:grid;place-items:center;margin:0 auto 1.25rem}
  .gate-icon .ico{width:1.8rem;height:1.8rem;color:var(--coral)}
  .gate h1{font-size:1.6rem;margin-bottom:.4rem}.gate>.gate-card>p{color:var(--muted);font-size:.95rem;margin-bottom:1.5rem}
  .gate form{display:flex;flex-direction:column;gap:.75rem;text-align:left}
  .gate label{font-weight:600;font-size:.85rem}
  .gate input{width:100%;padding:.8rem 1rem;border:1.5px solid var(--line-strong);border-radius:var(--r);font:inherit;background:var(--surface);color:var(--text)}
  .gate input:focus{outline:none;border-color:var(--coral)}
  .gate .btn{width:100%;margin-top:.5rem}
  .gate-err{background:#fbe9e6;color:#9a3b27;border-radius:var(--r);padding:.6rem .9rem;font-size:.88rem;margin-bottom:1rem}
  .gate-note{font-size:.78rem;color:var(--muted);margin-top:1.25rem;margin-bottom:0}
</style></head><body>
  <div class="gate"><div class="gate-card">
    <div class="gate-icon"><svg class="ico" aria-hidden="true"><use href="/images/icons/sprite.svg#lock"></use></svg></div>
    <h1>Data Room</h1><p>Plaza Real Silao · Acceso para inversionistas</p>
    ${error ? `<div class="gate-err">${esc(error)}</div>` : ''}
    <form method="POST" autocomplete="off">
      <div><label for="code">Código de acceso</label>
        <input id="code" name="code" type="text" placeholder="PlazaReal-silao-…" required autofocus></div>
      <button class="btn btn-primary" type="submit">Entrar al data room</button>
    </form>
    <p class="gate-note">Documentos confidenciales. Tu acceso queda registrado y tu nombre se marca en cada página. ¿No tienes código? Escribe a contacto@plazarealsilao.com</p>
  </div></div></body></html>`;
}

function logPage(name, entries) {
  const rows = entries.map(e => `<tr><td>${esc(e.time)}</td><td>${esc(e.name)}</td><td>${esc(e.role)}</td><td>${esc(e.ip || '')}</td></tr>`).join('') ||
    '<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:2rem">Sin accesos registrados todavía.</td></tr>';
  return `<!DOCTYPE html><html lang="es-MX"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bitácora de accesos | Data Room</title><meta name="robots" content="noindex, nofollow">
<link rel="stylesheet" href="/css/main.css">
<style>
  body{padding:2rem 0}.wrap{max-width:900px;margin:0 auto;padding:0 1.5rem}
  h1{font-size:1.8rem;margin-bottom:.3rem}.sub{color:var(--muted);margin-bottom:1.5rem}
  table{width:100%;border-collapse:collapse;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden}
  th,td{text-align:left;padding:.7rem 1rem;border-bottom:1px solid var(--line);font-size:.92rem}
  th{background:var(--coral-soft);font-family:var(--font);font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--coral-dark)}
  tr:last-child td{border-bottom:none}
  .top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem}
</style></head><body><div class="wrap">
  <div class="top"><div><h1>Bitácora de accesos</h1><p class="sub">Data Room · Plaza Real Silao — hola, ${esc(name)}</p></div>
    <a class="btn btn-secondary" href="${PREFIX}/">Ir al data room</a></div>
  <table><thead><tr><th>Fecha y hora</th><th>Nombre</th><th>Rol</th><th>IP</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="sub" style="margin-top:1rem;font-size:.8rem">Mostrando los accesos más recientes (máx. 200).</p>
</div></body></html>`;
}

async function writeLog(env, entry) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const rnd = Math.random().toString(36).slice(2, 8);
  try { await env.DATAROOM.put(`log:${ts}-${rnd}`, JSON.stringify(entry), { expirationTtl: 60 * 60 * 24 * 365 }); } catch (_) {}
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isProtected = url.pathname === PREFIX || url.pathname.startsWith(PREFIX + '/');
    if (!isProtected) return env.ASSETS.fetch(request);

    const secret = env.DATAROOM_COOKIE_SECRET;
    if (!secret || !env.DATAROOM) {
      return new Response(loginPage({ error: 'El acceso todavía no está configurado.' }), { status: 503, headers: HTML });
    }

    // Handle login
    if (request.method === 'POST') {
      let code = '';
      try { const f = await request.formData(); code = (f.get('code') || '').toString().trim(); } catch (_) {}
      let name = null, role = null;
      if (code) {
        name = await env.DATAROOM.get('code:' + code);
        if (name) role = 'inversionista';
        else { const a = await env.DATAROOM.get('admin:' + code); if (a) { name = a; role = 'admin'; } }
      }
      if (name) {
        await writeLog(env, {
          name, role, time: new Date().toISOString(),
          ip: request.headers.get('CF-Connecting-IP') || '',
          ua: (request.headers.get('User-Agent') || '').slice(0, 160),
        });
        const sess = await makeSession(secret, name, role);
        const attrs = `Path=${PREFIX}; Max-Age=${SESSION_SECONDS}; SameSite=Lax; Secure`;
        const headers = new Headers({ Location: url.pathname === LOG_PATH ? LOG_PATH : PREFIX + '/' });
        headers.append('Set-Cookie', `${SESS_COOKIE}=${sess}; HttpOnly; ${attrs}`);
        headers.append('Set-Cookie', `${WHO_COOKIE}=${encodeURIComponent(name)}; ${attrs}`);
        return new Response(null, { status: 303, headers });
      }
      return new Response(loginPage({ error: 'Código inválido. Verifica e intenta de nuevo.' }), { status: 401, headers: HTML });
    }

    // Check session
    const cookies = parseCookies(request);
    const sess = await readSession(secret, cookies[SESS_COOKIE]);
    if (!sess) return new Response(loginPage({}), { status: 401, headers: HTML });

    // Admin access-log page
    if (url.pathname === LOG_PATH) {
      if (sess.r !== 'admin') return new Response(loginPage({ error: 'Esta sección es solo para administradores.' }), { status: 403, headers: HTML });
      const list = await env.DATAROOM.list({ prefix: 'log:', limit: 200 });
      const entries = [];
      for (const k of list.keys) { const v = await env.DATAROOM.get(k.name); if (v) { try { entries.push(JSON.parse(v)); } catch (_) {} } }
      entries.sort((a, b) => (a.time < b.time ? 1 : -1));
      return new Response(logPage(sess.n, entries), { status: 200, headers: HTML });
    }

    return env.ASSETS.fetch(request);
  },
};
