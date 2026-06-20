# Runbook: Cloudflare Pages + Access para Plaza Real Silao

**Objetivo:** mover el sitio de GitHub Pages a **Cloudflare Pages** (gratis, más rápido) y proteger el **data room** (`/inversionistas/data-room/`) con **Cloudflare Access**: login por correo (código de un solo uso) y lista de inversionistas autorizados.

**Tiempo estimado:** 30–45 min (más la espera de DNS, que puede ser de minutos a unas horas).
**Necesitas:** acceso a tu cuenta del **registrador del dominio** (donde compraste `plazarealsilao.com`) y crear una cuenta gratis en **Cloudflare**.
**Importante:** no borres nada de GitHub. GitHub Pages seguirá funcionando hasta que el DNS apunte a Cloudflare; así no hay tiempo fuera de línea.

---

## Fase 1 — Crear cuenta y agregar el dominio a Cloudflare

1. Entra a **https://dash.cloudflare.com/sign-up** y crea una cuenta (gratis).
2. En el panel: **Add a site / Agregar un sitio** → escribe `plazarealsilao.com` → **Continue**.
3. Elige el plan **Free** → **Continue**.
4. Cloudflare escanea tus DNS actuales. Te mostrará **2 nameservers** (algo como `xena.ns.cloudflare.com` y `rick.ns.cloudflare.com`). **Cópialos**, los usarás en la Fase 2.

## Fase 2 — Apuntar el dominio a Cloudflare (cambio de nameservers)

5. Entra a tu **registrador** (donde administras `plazarealsilao.com`: GoDaddy, Namecheap, Google Domains, etc.).
6. Busca la sección **DNS / Nameservers / Servidores de nombres**.
7. Cambia de "nameservers del registrador" a **Custom / Personalizados** y pega los **2 nameservers de Cloudflare** de la Fase 1. Guarda.
8. Regresa a Cloudflare y presiona **Done, check nameservers**. El estatus pasará a **Active** cuando termine la propagación (suele ser rápido, pero puede tardar hasta 24 h). Cloudflare te manda un correo cuando esté listo.

> Mientras tanto el sitio sigue vivo en GitHub Pages. No hay prisa para las siguientes fases hasta que el dominio esté **Active**.

## Fase 3 — Crear el proyecto en Cloudflare Pages

9. En Cloudflare: menú lateral **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git**.
10. Autoriza **GitHub** y selecciona el repo **`Antonio-MS-Coder/Silao`**.
11. Configuración de build (es un sitio estático, sin compilación):
    - **Production branch:** `main`
    - **Framework preset:** `None`
    - **Build command:** (déjalo **vacío**)
    - **Build output directory:** `/`
12. **Save and Deploy.** En ~1 min tendrás una URL tipo `silao-xxxx.pages.dev`. Ábrela para confirmar que el sitio se ve bien.

## Fase 4 — Conectar el dominio real

13. Dentro del proyecto de Pages → pestaña **Custom domains** → **Set up a domain**.
14. Agrega **`plazarealsilao.com`** → Cloudflare crea el registro DNS solo (porque el dominio ya está en Cloudflare). Confirma.
15. Repite con **`www.plazarealsilao.com`** (Cloudflare lo redirige al dominio principal).
16. Espera a que diga **Active** y que el **SSL/HTTPS** esté activo (palomita verde). Prueba `https://plazarealsilao.com` — ya lo sirve Cloudflare.

> A partir de aquí, cada vez que se haga `push` a `main`, Cloudflare reconstruye y publica solo. Tu flujo de trabajo no cambia. El archivo `_headers` del repo (caché + noindex del data room) ya funciona en Cloudflare.

## Fase 5 — Proteger el data room con Cloudflare Access

17. En Cloudflare, menú lateral **Zero Trust** (si es la primera vez: elige un **team name** cualquiera, ej. `plazareal`, y el plan **Free** — cubre hasta 50 usuarios).
18. **Settings → Authentication → Login methods**: confirma que **One-time PIN** esté **habilitado** (viene activado por defecto). Esto permite entrar con un código que llega al correo, sin contraseñas.
19. **Access → Applications → Add an application → Self-hosted.**
20. Configura la aplicación:
    - **Application name:** `Plaza Real — Data Room`
    - **Session Duration:** `24 hours`
    - **Application domain:** `plazarealsilao.com` , **Path:** `inversionistas/data-room`
      *(esto protege esa carpeta y todo lo que cuelga de ella)*
    - **Next**
21. Crea la **política (policy)**:
    - **Policy name:** `Inversionistas autorizados`
    - **Action:** `Allow`
    - **Configure rules → Include → Selector:** `Emails`
    - Pega los correos de los inversionistas (uno por uno).
      *(Alternativa: usar `Emails ending in` → `@tudominio.com` si todos son del mismo dominio.)*
    - **Next → Add application.**
22. Listo. Ahora `/inversionistas/data-room/` exige login por correo. La marca de agua de los documentos mostrará automáticamente el correo de quien entró (vía `/cdn-cgi/access/get-identity`, que ya está conectado en el visor).

## Fase 6 — Verificar

23. **Abre una ventana de incógnito** → `https://plazarealsilao.com/inversionistas/data-room/`
    → debe aparecer la pantalla de Cloudflare pidiendo correo. Mete un correo **autorizado** → llega un código → entra → se ven los documentos con la marca de agua de ese correo. ✅
24. Prueba con un correo **NO autorizado** → Cloudflare lo bloquea. ✅
25. Confirma que las páginas públicas (inicio, tiendas, espacios, faq, **inversionistas**) **NO** piden login. ✅

## Fase 7 — Subir los documentos reales

26. Reemplaza los PDF de muestra en `inversionistas/data-room/docs/` por los reales.
27. Edita `inversionistas/data-room/documents.json` con el título y archivo de cada documento:
    ```json
    {
      "documents": [
        { "title": "Resumen Ejecutivo", "file": "docs/resumen-ejecutivo.pdf", "desc": "..." },
        { "title": "Estados Financieros 2025", "file": "docs/estados-2025.pdf", "desc": "..." }
      ]
    }
    ```
28. `git add . && git commit -m "docs: data room real" && git push`. Cloudflare publica solo en ~1 min.

> **Recordatorio de seguridad:** sube los financieros reales **solo después** de confirmar (Fase 6) que el login funciona. Antes de eso, el data room es público. La vista es "solo lectura" + marca de agua: disuade y rastrea fugas, pero nadie puede impedir al 100% una captura de pantalla — por eso la marca de agua con el correo es la verdadera protección.

---

## Gestionar accesos después

- **Agregar/quitar inversionistas:** Zero Trust → Access → Applications → *Plaza Real — Data Room* → editar la política y la lista de correos.
- **Ver quién entró:** Zero Trust → **Logs → Access**.
- **Revocar a alguien:** quítalo de la lista de correos (efecto inmediato en la siguiente sesión).

## Si algo sale mal (rollback)

- El sitio público no depende de Access; si Access diera problemas, puedes **deshabilitar/eliminar la aplicación** en Zero Trust y el data room vuelve a quedar abierto (no borres documentos sensibles mientras tanto).
- Para volver del todo a GitHub Pages: en el registrador, regresa los **nameservers** a los del registrador y vuelve a poner el dominio en GitHub Pages (Settings → Pages). El repo no cambia.

## Notas

- Cloudflare Access **Free** cubre hasta **50 usuarios** — suficiente para una ronda de inversión.
- Costo: **$0** (Cloudflare Pages + Access en plan Free). Solo pagas el dominio que ya tienes.
- El archivo `CNAME` del repo es de GitHub Pages; Cloudflare lo ignora. Puede quedarse.
