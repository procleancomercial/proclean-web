# Diagnóstico y solución — Portal de Especialistas ProClean Prime

## Diagnóstico

### Resumen del problema

Se solicita mejorar la sección de bienvenida del dashboard ("Buenas tardes, Especialista"),
rediseñar el estado visual "Pendiente"/"En servicio", hacer funcional la opción "Ruta" (preparada
para una futura conexión con base de datos), agregar botones de navegación de vuelta al portal y
al inicio, y corregir el login que dejó de funcionar en `portal_especialistas.html`.

---

### Problema 1: Sección de bienvenida sin buena presentación

**Causa raíz**

- El saludo estaba **hardcodeado** ("Buenas tardes, Especialista") en el HTML.
- La función `mostrarSaludo()` de `js/dashboard.js` buscaba un elemento con `id="saludo"` que **no existía**,
  por lo que el saludo dinámico jamás se aplicaba.
- El layout usaba `flex justify-between` (contenido a la izquierda y fecha a la derecha), lo que daba una
  apariencia descentrada y poco cuidada.

**Evidencia**

- `js/dashboard.js:45` → `const saludo = document.getElementById("saludo")`.
- En `dashboard.html` no existía ningún `id="saludo"`; el texto del `h1` estaba fijo.

**Cómo se confirmó**

- Se cruzó el `getElementById("saludo")` del JS contra el HTML: no había coincidencia, por lo que
  `mostrarSaludo()` retornaba al inicio (`if (!saludo) return;`) y nunca cambiaba nada.

**Solución propuesta / cambios realizados**

- Se añadió `<span id="saludo">Buenas tardes</span>` dentro del `h1`, activando el saludo dinámico
  (Buenos días / Buenas tardes / Buenas noches según la hora).
- Se rediseñó la tarjeta de bienvenida a un layout **centrado y profesional**: avatar circular, título
  con mejor tipografía, fecha en una píldora con borde redondeado y botones de acción.

---

### Problema 2: Estado "Pendiente"/"En servicio" poco elegante

**Causa raíz**

- Los estados `.status-pending` (naranja) y `.status-active` (verde) eran simples rectángulos de color
  con `border-radius:30px` pero sin borde ni indicador visual, lo que se percibía como poco profesional.

**Evidencia**

- `css/dashboard.css`: `.status-pending { background:#FEF3C7; color:#B45309 }` y
  `.status-active { background:#DCFCE7; color:#15803D }`.

**Solución propuesta / cambios realizados**

- Se rediseñaron ambos estados como **píldoras modernas** (`border-radius:999px`) con borde suave,
  fondo tenue, tipografía legible y un **punto indicador** animado de estado, manteniendo la claridad
  (naranja = Pendiente, verde = En servicio). La lógica JS de cambio de clase no se modificó, por lo que
  la transición Pendiente → En servicio sigue funcionando igual.

---

### Problema 3: Opción "Ruta" sin función real

**Causa raíz**

- El botón "Ruta" en el modal no tenía `onclick` ni lógica asociada, por lo que no hacía nada.
- La dirección del servicio estaba hardcodeada y no había un punto único desde el cual leerla, lo que
  dificulta su reemplazo futuro por un valor de la base de datos.

**Solución propuesta / cambios realizados**

- Se agregó `onclick="openRoute()"` al botón "Ruta".
- Se creó en `js/dashboard.js` la función `obtenerDireccionServicio()` que lee la dirección desde
  `#direccionServicio` (mediante `data-direccion`). Este atributo es el punto de entrada donde se
  poblará la dirección proveniente de la base de datos; **no se simula ninguna conexión**.
- `openRoute()` abre `https://www.google.com/maps/search/?api=1&query=<dirección>` en una pestaña nueva.
- Se sincroniza la dirección mostrada dentro del modal (`#modalDireccionServicio`) con la dirección real.

---

### Problema 4: Falta de botones "Volver al portal" y "Volver al inicio"

**Causa raíz**

- El dashboard no tenía controles claros de navegación de regreso hacia `portal_especialistas.html`
  (login) ni hacia `index.html`.

**Solución propuesta / cambios realizados**

- En la tarjeta de bienvenida se agregaron dos botones:
  - **Volver al portal** → `portal_especialistas.html` (donde está el login / cierre de sesión).
  - **Volver al inicio** → `index.html`.
- Ambos usan rutas relativas correctas (los archivos están en `assets/`).

---

### Problema 5: Login que dejó de funcionar

**Causa raíz**

1. **Ruta del script inconsistente** tras la reorganización de carpetas: en el commit
   `ee10615 "Organizar carpetas css y js dentro de assets"` se movieron `css/` y `js/`, y en `6a3db1d`
   la referencia cambió de `js/login.js` a `../js/login.js`. Actualmente `js/` está en la raíz y la ruta
   `../js/login.js` es correcta, pero la reorganización dejó las rutas frágiles frente a la estructura
   de despliegue.
2. **Falló el parseo de la respuesta del endpoint**: el formulario usaba `response.json()`, pero el
   endpoint de Google Apps Script (`/exec`) responde con `Content-Type: text/html`. Eso hacía que
   `response.json()` lanzara un error y el flujo cayera en el `catch`, mostrando
   "Error al conectar con la base de datos" (percepción de "login roto") aunque las credenciales
   fueran correctas.
3. **ID duplicado**: existían dos elementos con `id="login"` (la sección y la tarjeta del formulario),
   HTML inválido que podía causar comportamientos inesperados en anclas/navegación.

**Evidencia**

- `js/login.js` (original): `.then(response => response.json())`.
- `portal_especialistas.html`: `<section id="login">` y `<div id="login">` repetidos.

**Cómo se confirmó**

- Se verificó que `login.js` se carga correctamente y que el `submit` del formulario está enlazado.
- Se identificó que el único punto frágil del flujo de red era el `response.json()` sobre una respuesta
  que Apps Script entrega como `text/html`.

**Solución propuesta / cambios realizados**

- En `js/login.js` se cambió a `response.text()` + `JSON.parse()` con manejo de errores, de modo que el
  login funcione sin importar si el `Content-Type` es `text/html` o `application/json`.
- Se renombró el `div` de la tarjeta de `id="login"` a `id="loginCard"`, dejando un único `id="login"`
  (la sección) y evitando el HTML inválido.

---

## Cambios realizados

| Archivo | Cambio |
| --- | --- |
| `assets/dashboard.html` | Rediseño de la sección de bienvenida (centrada, tipografía mejorada, `id="saludo"`, fecha en píldora, botones "Volver al portal" e "Volver al inicio"). |
| `assets/dashboard.html` | Botón "Ruta" ahora ejecuta `openRoute()`. |
| `assets/dashboard.html` | Dirección del modal con `id="modalDireccionServicio"`. |
| `assets/dashboard.html` | `#direccionServicio` con `data-direccion` para futura carga desde BD. |
| `css/dashboard.css` | Rediseño de `.status-pending` / `.status-active` como píldoras elegantes con indicador. |
| `css/dashboard.css` | Nuevo estilo `.btn-outline` para el botón secundario. |
| `js/dashboard.js` | Nuevas funciones `obtenerDireccionServicio()` y `openRoute()` (ruta a Google Maps, lista para BD). |
| `js/login.js` | Login robusto: `response.text()` + `JSON.parse()` con manejo de errores. |
| `assets/portal_especialistas.html` | Se eliminó el `id="login"` duplicado de la tarjeta (`loginCard`). |

## Archivos modificados

- `assets/dashboard.html`
- `assets/portal_especialistas.html`
- `css/dashboard.css`
- `js/dashboard.js`
- `js/login.js`

## Pasos para verificar el fix

1. **Login**: abrir `assets/portal_especialistas.html`, ingresar credenciales válidas y confirmar que
   redirige a `dashboard.html` y muestra el nombre del especialista.
2. **Saludo**: en `dashboard.html` confirmar que el título muestra "Buenos días", "Buenas tardes" o
   "Buenas noches" según la hora del día, y que está centrado con buena tipografía.
3. **Estado del servicio**: abrir el modal "Ver servicio", presionar "Iniciar servicio" y confirmar que
   el estado pasa de la píldora "Pendiente" (naranja) a "En servicio" (verde) de forma elegante.
4. **Ruta**: en el modal, hacer clic en "Ruta" y confirmar que se abre Google Maps con la dirección del
   servicio.
5. **Navegación**: presionar "Volver al portal" (abre `portal_especialistas.html`) y "Volver al inicio"
   (abre `index.html`).
6. **Consola**: abrir DevTools y confirmar que no hay errores JS al cargar `dashboard.html` ni
   `portal_especialistas.html`.

## Resultado esperado

Aplicación funcional con una presentación visual más profesional y coherente: bienvenida centrada y
dinámica, estados de servicio elegantes, opción de ruta operativa y preparada para integrarse con la
base de datos, navegación clara de regreso al portal y al inicio, y un login que vuelve a funcionar de
forma robusta sin romper las funcionalidades existentes.
