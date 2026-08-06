# Diagnóstico: Descuadre en dispositivos móviles

## Resumen del problema

La página se ve bien en algunos celulares, pero falla en otros, y **no se ve bien en ninguno de los 3 PCs probados**. El descuadre se notó al configurar el dominio en Namecheap e ingresar por él.

La revisión del código y del repositorio indica que **no es un problema de "tamaño de pantalla" ni del DNS de Namecheap**: el layout depende al 100 % de (a) un CDN que genera todo el CSS en tiempo de ejecución, y (b) archivos locales de CSS/JS que están **fuera del directorio que se publica en producción**. Según qué versión/URL se cargue, se obtienen distintos tipos de rotura. Eso explica que "algunos celulares sí, otros no, y ningún PC funcione": el resultado depende de la red/caché/navegador de quien entra, no del dispositivo en sí.

**Confirmación del error que ves:** el "error 3.4.17 en cdn.tailwindcss.com" es un fallo de red/DNS al cargar el script del Play CDN (`net::ERR_NAME_NOT_RESOLVED`). El host `cdn.tailwindcss.com` está bloqueado o no resuelve en varias redes (documentado en GitHub #10369 y reproducido en este entorno de diagnóstico). Como todo el layout sale de ese script, cuando falla la página queda sin estilos.

## Causa raíz identificada

Hay **una causa primaria de fragilidad** y **dos defectos de despliegue** que, combinados, producen los síntomas:

### 1. (PRIMARIA — CONFIRMADA) El layout depende del Tailwind Play CDN, y `cdn.tailwindcss.com` falla/bloquea en varias redes
- `assets/index.html:8`, `assets/quienes-somos.html:8`, `assets/portal_especialistas.html:8` cargan `https://cdn.tailwindcss.com/3.4.17` (y `assets/dashboard.html:13` carga una versión **distinta**, sin fijar).
- El error que reportas ("3.4.17 en cdn.tailwindcss.com") es un **fallo de red/DNS al cargar ese script**: el navegador muestra `net::ERR_NAME_NOT_RESOLVED` / "Failed to load resource". No es un error del código de la página: el host `cdn.tailwindcss.com` **está bloqueado o no resuelve en ciertos proveedores de red/DNS** (documentado en GitHub tailwindlabs/tailwindcss#10369; ahí mismo se confirma que "algunos proveedores de red bloquearon cdn.tailwindcss.com").
- Lo reproduje aquí mismo: en este entorno `cdn.tailwindcss.com` **no resuelve por DNS**, mientras que `cdn.jsdelivr.net`, `fonts.googleapis.com` y `script.google.com` sí resuelven. Es un problema del host, no del proyecto.
- Ese script es el que inyecta **todas** las clases utilitarias (flex, grid, padding, breakpoints `md:`/`lg:`). Si no carga, la página se renderiza **sin ningún estilo de layout** — solo quedan los colores y fuentes que Canva puso en línea — y se descuadra/rompe por completo.
- Esto explica exactamente "unos dispositivos sí, otros no, ningún PC funciona": depende de si la red/DNS de cada persona resuelve ese host. En PCs (red de oficina/casa con DNS distinto) falla; en celulares con datos móviles de otra operadora suele cargar.
- **No hay build v3 alternativo en otro CDN**: el Play CDN v3 solo existe en ese host (verifiqué `@tailwindcss/browser@3.4.17` en jsDelivr → 404). Por eso hay que compilar el CSS localmente (Paso 1).

### 2. (Despliegue) La carpeta `css/` y `js/` están fuera del directorio publicado
- La rama `origin/cloudflare/workers-autoconfig` tiene `assets/wrangler.jsonc` con `"assets": { "directory": "." }`, es decir, **solo se publica el contenido de `assets/`**.
- Las carpetas `css/` y `js/` están en la raíz del repo, como hermanas de `assets/`, así que **no se despliegan**.
- Consecuencia en producción: `assets/dashboard.html:23-24` y `:1291` (`../css/dashboard.css`, `../css/mi-jornada.css`, `../js/dashboard.js`) y `assets/portal_especialistas.html:1030` (`../js/login.js`) apuntan a rutas que **no existen** en el sitio publicado → 404 → esas páginas pierden su CSS/JS propios y quedan desalineadas/rotas.

### 3. (Despliegue) `assets/index.zip` es una versión incompleta y peligrosa
- El zip contiene **solo `index.html`** y ese `index.html` referencia `./css/output.css` (CSS compilado del export original de Canva).
- Ese `css/output.css` **no existe** en el repo ni dentro del zip.
- Si ese zip se subió al hosting (Netlify/Cloudflare/Namecheap lo descomprimen), el sitio publicado queda **sin ningún CSS de layout en ninguna página** → roto en todas partes. No parece ser el caso actual (algunos celulares se ven bien), pero es un riesgo latente y una pista de que el hosting puede estar sirviendo una versión vieja o incompleta.

### 4. (Secundarias) Defectos responsivos reales encontrados en el código
- **`assets/index.html:1749`**: el bloque de contacto del footer usa ancho fijo `w-[300px]`. En pantallas de ~320 px (iPhone SE 1.ª gen, muchos Android) desborda el viewport y se corta/descuadra.
- **`assets/index.html:456-462`**: el botón `#menuBtn` (menú móvil) no tiene clase `lg:hidden`, así que **también aparece en desktop**.
- **`assets/index.html:552-554` y otras**: estilos en línea de Canva (`style="font-size: 32px"`) **anulan** las clases responsivas (`.hero-title-responsive` usa `clamp()`). Los tamaños de texto no escalan como se diseñó en todos los anchos.
- **`assets/index.html:284`**: uso de `:has()` en CSS. En navegadores/WebView viejos (Safari < 15.4, Chrome < 105) no aplica → la tarjeta del calendario pierde su estilo.
- **`assets/index.html:224-238`**: `width: max-content` para el carrusel de aliados; sin soporte, los items se apilan.
- Uso intensivo de `gap` en flex/grid sin fallback (navegadores < 2020 lo ignoran y los elementos se pegan).
- **`assets/index.html:1275/1568`**: el `</form>` de la sección Agenda cierra el formulario antes de tiempo (luego hay un `</form>` suelto). Funciona por `getElementById`, pero el HTML es inválido y puede afectar el render en algunos motores.
- `assets/dashboard.html` carga `lucide` dos veces (jsDelivr en `<head>` y `unpkg@latest` al final).

## Evidencia / cómo se confirmó

- Los 4 HTML cargan el layout solo desde el CDN de Tailwind (grep `cdn.tailwindcss.com` → `index.html:8`, `quienes-somos.html:8`, `portal_especialistas.html:8`, `dashboard.html:13`).
- El host `cdn.tailwindcss.com` no resuelve por DNS en este entorno de diagnóstico, mientras que `cdn.jsdelivr.net`, `fonts.googleapis.com`, `script.google.com` y el propio dominio del proyecto **sí resuelven**. Es reproducible: `getent hosts cdn.tailwindcss.com` falla.
- GitHub tailwindlabs/tailwindcss#10369 documenta que varios proveedores de red bloquean `cdn.tailwindcss.com` ("these issues are caused by network providers because few network providers blocked this website").
- El Play CDN v3 no está publicado en otro CDN: `cdn.jsdelivr.net/npm/@tailwindcss/browser@3.4.17/dist/browser.js` y `.../tailwindcss@3.4.17/dist/play.js` → 404 (verificado).
- No existe ningún `css/output.css` ni archivo CSS compilado en el repo (`find` → ausente), y las páginas no tienen fallback CSS propio de layout.
- `wrangler.jsonc` (rama `cloudflare/workers-autoconfig`) declara `assets.directory = "."` → solo `assets/` se publica; `css/` y `js/` quedan fuera.
- Referencias rotas en producción: `dashboard.html:23,24,1291` y `portal_especialistas.html:1030` usan `../css/...` y `../js/...`.
- `assets/index.zip` (añadido en el último commit `8edf3b5`) contiene solo `index.html` y ese archivo referencia `./css/output.css` (inexistente).
- El viewport meta `<meta name="viewport" content="width=device-width, initial-scale=1.0">` **está presente** en las 4 páginas → no es la causa.
- DNS (Namecheap): el DNS no afecta el renderizado. Descartado como causa; solo pudo exponer la versión que se está sirviendo.

## Solución propuesta

### Paso 1 (obligatorio y definitivo): compilar Tailwind a un CSS estático y servirlo desde tu propio dominio
La página usa sintaxis de Tailwind **v3.4.17** (arbitrary values, `bg-white/95`, breakpoints `md:`/`lg:`), así que se compila con el CLI de v3. Un solo comando (y ya no depende de `cdn.tailwindcss.com`):

1. Agregar la herramienta (una sola vez):
   ```
   npm init -y
   npm install -D tailwindcss@3.4.17
   ```
2. Crear `src/input.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Generar el CSS estático:
   ```
   npx tailwindcss@3.4.17 -i src/input.css -o assets/css/output.css --minify
   ```
4. En las 4 páginas reemplazar el `<script src="https://cdn.tailwindcss.com/...">` por:
   ```html
   <link rel="stylesheet" href="css/output.css">
   ```
   (Los breakpoints `md:`, `lg:` del CSS compilado son idénticos a los del CDN: `min-width: 768px` y `min-width: 1024px`, y soporta las mismas clases arbitrarias `w-[300px]`, `grid-cols-[230px_1fr]`, etc.)

> **Parche de emergencia mientras tanto** (no sustituye el Paso 1): el Play CDN v3 solo existe en `cdn.tailwindcss.com` y no está publicado en jsDelivr, así que no hay mirror confiable. Si no se puede compilar ya, al menos el Paso 4 y 5 de más abajo (rutas y `w-full`) reducen el descuadre, pero la única solución real es el CSS estático.

### Paso 2 (obligatorio): corregir la estructura de despliegue
- Mover `css/` y `js/` **dentro de `assets/`** (es decir, `assets/css/` y `assets/js/`), y actualizar las rutas:
  - `dashboard.html:23` `../css/dashboard.css` → `css/dashboard.css`
  - `dashboard.html:24` `../css/mi-jornada.css` → `css/mi-jornada.css`
  - `dashboard.html:1291` `../js/dashboard.js` → `js/dashboard.js`
  - `portal_especialistas.html:1030` `../js/login.js` → `js/login.js`
- Eliminar `assets/index.zip` para que el hosting no use esa versión incompleta.

### Paso 3: corregir los defectos responsivos concretos
```html
<!-- assets/index.html:1749 — footer contacto -->
<div class="flex flex-col w-full max-w-[300px] gap-4">
```
```html
<!-- assets/index.html:456-462 — ocultar menú móvil en desktop -->
<button id="menuBtn"
    class="focus-ring lg:hidden w-11 h-11 rounded-full border border-slate-200 grid place-items-center"
    aria-label="Abrir menú">
```
```html
<!-- assets/index.html:554 — quitar el font-size fijo que anula clamp() -->
<h1 data-template-id="hero-title"
    class="canva-text fade-up delay-1 hero-title-responsive leading-[1.02] mb-6 max-w-3xl"
    style="color: rgb(255, 255, 255); font-weight: 700; font-style: normal;">
```
- Unificar `dashboard.html:13` a la misma versión `3.4.17` (o mejor: quitar el CDN al usar `output.css`) y eliminar el `lucide` duplicado (`dashboard.html:1289`).
- Quitar los `</form>` sobrantes de la sección Agenda (`index.html:1275` y `:1568`) para dejar un HTML válido.

### Paso 4 (recomendado): fallback CSS mínimo
Mientras tanto, en el `<head>` de cada página, agregar un fallback que evite la rotura total si el CSS no carga:
```html
<noscript><style>/* layout básico si JS/CDN no carga */</style></noscript>
```

## Pasos para verificar el fix

1. **Confirmar la causa actual (1 minuto)** en un PC afectado: DevTools → Network → recargar (Ctrl+Shift+R). Buscar requests en rojo/fallidas: `cdn.tailwindcss.com`, `css/output.css`, `../css/dashboard.css`, `../js/dashboard.js`.
2. **Reproducir el bug**: en DevTools → Network → "Block request domain" → `cdn.tailwindcss.com` y recargar. Verás el sitio actual descuadrado/roto. Después de aplicar el Paso 1, este bloqueo ya no debe afectar el layout.
3. **Probar anchos**: modo dispositivo con 320, 375, 768, 1024 y 1440 px, y en desktop real. Verificar footer sin desborde a 320 px y menú móvil oculto en desktop.
4. **Probar red lenta** (Network → "Fast 3G"): la página debe verse correcta aunque los CDNs de iconos/fuentes tarden.
5. **Probar en los 3 PCs y en los celulares afectados**: sin requests 404 y sin cambios de layout al recargar con caché limpia.
6. **En producción**: entrar por el dominio de Namecheap con hard refresh y confirmar que el CSS se sirve desde el propio dominio (`/css/output.css`).

---

## Estado de los cambios (agosto 2026) y hallazgo sobre el dominio

### Hallazgo: pro-clean-prime.com NO sirve este repo
Al probar la URL real se descubrió que **`pro-clean-prime.com` (y `www`) es una app Next.js desplegada en Vercel** (`server: Vercel`, chunks `/_next/`, página `/reserva`, checkout de Bold, logo SVG). Ese sitio no usa `cdn.tailwindcss.com` y no contiene los HTML de `assets/` (dan 404). Por lo tanto, el error "3.4.17 en cdn.tailwindcss.com" y el descuadre se ven en **este repo estático, abierto localmente y/o en su URL de hosting propia** (no en pro-clean-prime.com). Para cerrar el caso hace falta la URL de hosting de este repo (aún no provista).

### Cambios ya aplicados en el working tree (rama main)
1. **`css/` y `js/` movidos dentro de `assets/`** (`assets/css/`, `assets/js/`). Con el `assets/wrangler.jsonc` de la rama `cloudflare/workers-autoconfig` (`directory: "."`), solo se publica `assets/`, así que antes `../css/...` y `../js/...` daban 404 en producción.
2. **Rutas corregidas**: `assets/dashboard.html` → `css/dashboard.css`, `css/mi-jornada.css`, `js/dashboard.js`; `assets/portal_especialistas.html` → `js/login.js`.
3. **Bugs menores**: footer `w-[300px]` → `w-full max-w-[300px]` (`index.html:1749`); `lg:hidden` en `#menuBtn` (`index.html:456`); CDN de `dashboard.html` fijado a `3.4.17`; eliminado `unpkg.com/lucide@latest` duplicado (`dashboard.html:1289`).
4. **`<link rel="stylesheet" href="css/output.css">` añadido** en las 4 páginas (antes del `<script>` del CDN, que se mantiene como respaldo hasta que `output.css` exista; con ambos cargados las definiciones son idénticas, no hay conflicto).
5. **Scaffolding de build**: `package.json` (tailwindcss 3.4.17), `tailwind.config.js` (content: `./assets/**/*.html`), `src/input.css` (@tailwind base/components/utilities).
6. **Build en la nube sin Node local**: `.github/workflows/build-tailwind-css.yml` genera `assets/css/output.css` y lo commitea automáticamente en cada push a `main`.

### Lo que falta hacer
- Ejecutar el workflow (push a `main`): `npm install && npm run build` corre en GitHub Actions → crea `assets/css/output.css`.
- **Verificar** que `output.css` se genere y que las 4 páginas se vean correctas; luego **quitar el `<script>` del CDN** de las 4 páginas para eliminar de raíz el error `cdn.tailwindcss.com` (instrucciones: borrar la línea `<script src="https://cdn.tailwindcss.com/3.4.17"></script>` en cada HTML).
- Confirmar la URL de hosting real de este repo para verificar en producción.
- Pendiente (no tocado por riesgo, documentado): `</form>` sobrantes en `index.html:1275/1568`.
- `assets/index.zip` se conserva (decisión del usuario); recordar que se publica como archivo descargable y contiene un `index.html` incompleto.
- Aclarar el rol de la rama `cloudflare/workers-autoconfig` (versión muy distinta, con `mi-jornada.html` y sus propias rutas `../css`, `../js` rotas iguales) respecto a lo que se despliega.
