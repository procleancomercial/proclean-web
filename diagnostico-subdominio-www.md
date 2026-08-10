# Diagnóstico y configuración del subdominio `www` para procleanprimeweb.com

**Dominio:** `procleanprimeweb.com`
**DNS:** Cloudflare
**Registrador (compra del dominio):** Namecheap
**Fecha de diagnóstico:** 2026-08-07

> ## ⚠️ HALLAZGO REAL (2026-08-07)
>
> Los nameservers autoritativos de `procleanprimeweb.com` son de **Namecheap**:
> - `dns1.registrar-servers.com`
> - `dns2.registrar-servers.com`
>
> Por lo tanto, **Cloudflare NO es el DNS autoritativo** del dominio. El registro `CNAME www → procleanprimeweb.com (Proxied)` creado en Cloudflare **no tiene ningún efecto**, porque no es la zona que responde por internet.
>
> Como la zona real (Namecheap) no tiene un registro para `www`, este subdominio resuelve a la página de parking de Namecheap (`parkingpage.namecheap.com`). Eso explica por qué el sitio abre sin `www` pero no con `www`.
>
> **Solución elegida:** mover el DNS de Namecheap a Cloudflare (Cloudflare pasa a ser autoritativo).

---

## 1. Diagnóstico del problema

El dominio `https://procleanprimeweb.com/` responde, pero **no** abre correctamente con el subdominio `www` (`https://www.procleanprimeweb.com/`). Esto suele deberse a una de las siguientes causas:

| # | Causa probable | Descripción |
|---|----------------|-------------|
| 1 | Falta el registro `CNAME` o `A` para `www` | No existe el registro DNS de `www` en Cloudflare, por lo que el subdominio no resuelve. |
| 2 | Redirección incorrecta | Cloudflare tiene activo el modo **"Redirect Rules" / "Page Rules"** solo para `procleanprimeweb.com` pero no redirige `www`. |
| 3 | Registro `CNAME` hacia el apex | El registro `www` apunta mal (p. ej. apunta al apex en lugar del servidor real). |
| 4 | Proxy/Orange cloud mal configurado | El registro `www` está en "DNS only" (nube gris) mientras el apex está en "Proxied" (nube naranja), o viceversa. |
| 5 | SSL/TLS mal aplicado | Certificado que no cubre `www` (o modo Flexible). |

> **Nota importante sobre Cloudflare:** si `www` está **proxied** (nube naranja), **no** se necesita registro alguno en Namecheap para `www`, porque todo se gestiona en el panel de Cloudflare. Solo la creación de los registros en Namecheap es necesaria cuando Cloudflare está en **DNS only** o en otro caso de delegación.

---

## 2. Pasos de configuración

### Paso 0 — Cambiar los nameservers de Namecheap a Cloudflare (OBLIGATORIO)

Como Cloudflare aún no es el DNS autoritativo, hay que delegar el dominio a Cloudflare:

1. **En Cloudflare:**
   - Añade el sitio `procleanprimeweb.com` (Add a site) y elige el plan gratuito.
   - Cloudflare escaneará los registros DNS existentes (importará los de Namecheap).
   - Verifica que existan al menos: `A @ → IP del hosting (Proxied)` y añade `CNAME www → procleanprimeweb.com (Proxied)`.
   - Cloudflare te dará **dos nameservers** (formato `XXX.ns.cloudflare.com` y `YYY.ns.cloudflare.com`). **Guárdalos.**

2. **En Namecheap:**
   - Ve a **Domain List → Manage → Nameservers**.
   - Selecciona **Custom DNS** y escribe los dos nameservers de Cloudflare.
   - Guarda (Save).

3. **Espera la propagación** (minutos a 24 h). Cloudflare mostrará "Active" cuando se complete la delegación.

> Una vez delegado, todo se gestiona en Cloudflare y **no** hace falta tocar Namecheap para DNS ni para redirecciones.

---

### Paso 1 — Verificar el estado actual de los registros DNS en Cloudflare

1. Entra a **Cloudflare** → selecciona el dominio `procleanprimeweb.com`.
2. Ve a la pestaña **DNS → Records**.
3. Comprueba que existan estos registros:

| Tipo | Nombre | Contenido | Proxy |
|------|--------|-----------|-------|
| A | `@` | IP del hosting | Proxied (naranja) |
| CNAME | `www` | `procleanprimeweb.com` | Proxied (naranja) |

**Si falta el CNAME de `www`, créalo:**
- **Type:** `CNAME`
- **Name:** `www`
- **Target:** `procleanprimeweb.com` (o la IP/hostname del hosting si el apex apunta a un servidor específico).
- **Proxy status:** **Proxied** (nube naranja) para que Cloudflare lo cubra con SSL y la redirección.

---

### Paso 2 — Crear la redirección (Redirigir a una sola versión canónica)

Con Cloudflare, la forma recomendada es usar **Bulk Redirects** o **Redirect Rules**:

1. Ve a **Rules → Redirect Rules** (o en versiones anteriores **Page Rules**).
2. Crea una regla **Always use HTTPS** (si no existe):
   - **Hostname:** `procleanprimeweb.com` y `*.procleanprimeweb.com`
   - **Action:** Always Use HTTPS.
3. Crea una regla de redirección para unificar el dominio:

**Opción A — Sin `www` → Con `www` (recomendado):**
- **Condition:** `Hostname equals procleanprimeweb.com`
- **Action:** Redirect (Dynamic) a `https://www.procleanprimeweb.com/${path}` con código **301**.

**Opción B — Con `www` → Sin `www`:**
- **Condition:** `Hostname equals www.procleanprimeweb.com`
- **Action:** Redirect (Dynamic) a `https://procleanprimeweb.com/${path}` con código **301**.

> Elige **una sola** versión como canónica (SEO). Se recomienda **con `www`**.

---

### Paso 3 — Verificar la configuración de SSL/TLS en Cloudflare

1. Ve a **SSL/TLS → Overview**.
2. Configura el modo **Full (strict)**.
3. En **SSL/TLS → Edge Certificates**, confirma que el certificado cubre `procleanprimeweb.com` **y** `*.procleanprimeweb.com` (el certificado Universal de Cloudflare lo hace automáticamente).
4. Si activas **"Always Use HTTPS"**, se redirigirá cualquier acceso HTTP a HTTPS en ambas versiones.

---

### Paso 4 — Validar en Namecheap (solo comprobación)

Una vez delegado el DNS a Cloudflare, Namecheap solo mantiene el dominio y los nameservers:

1. Ve a **Namecheap → Domain List → Manage → Nameservers**.
2. Confirma que los nameservers sean los de Cloudflare (formato `XXX.ns.cloudflare.com` / `YYY.ns.cloudflare.com`).
3. **No** crees registros DNS en Namecheap; los registros y redirecciones se gestionan en Cloudflare.

---

### Paso 5 — Verificar la propagación y el resultado

- Comprueba la resolución DNS de `www`:
  - `nslookup www.procleanprimeweb.com`
  - O usa https://dnschecker.org (comprueba `www.procleanprimeweb.com`).
- Prueba las 4 combinaciones en el navegador:
  - `https://procleanprimeweb.com/` ✔
  - `https://www.procleanprimeweb.com/` ✔
  - `http://procleanprimeweb.com/` → debe redirigir a HTTPS ✔
  - `http://www.procleanprimeweb.com/` → debe redirigir a HTTPS ✔

---

## 3. Comprobación rápida del resultado esperado

| Entrada | Resultado esperado |
|---------|--------------------|
| `procleanprimeweb.com` | Muestra el sitio (con o sin redirección a www) |
| `www.procleanprimeweb.com` | Muestra el sitio (con o sin redirección a apex) |
| `http://...` (cualquiera) | Redirige a `https://...` |
| Certificado SSL | Válido para ambas (apex + www) |

---

## 4. Causa más probable y acción inmediata

La causa más habitual es la **ausencia del registro `CNAME` para `www`** o la **falta de una regla de redirección** en Cloudflare.

**Acción recomendada (mínima):**
1. Crear el registro `CNAME www → procleanprimeweb.com` (Proxied) en Cloudflare.
2. Crear una **Redirect Rule** 301 que unifique la versión canónica.
3. Activar **Always Use HTTPS**.

Con esto, el sitio abrirá correctamente **con y sin `www`**.
