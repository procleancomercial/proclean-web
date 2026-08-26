# Diagnóstico

## Resumen del problema

La página de ProClean Prime ya contaba con un catálogo de productos reutilizable, un carrito de compras, checkout y un flujo que permite agregar productos durante la reserva de un servicio (modo `servicio`). Hacía falta un acceso directo al catálogo para los usuarios que NO quieren contratar un servicio y solo desean comprar productos de limpieza, cobrando un domicilio de $9.000 y calculando el total como `productos + domicilio`.

## Causa raíz identificada

El sistema de catálogo y su integración con el servicio ya estaba implementado en `assets/js/catalogo.js` (modo `modoCatalogo` = `compra`/`servicio`, función `irAlCatalogoDesdeServicio()`, lógica de domicilio según modo) y en `assets/index.html` (función `calcularPrecioDinamico()` que suma productos al precio del servicio). Lo que faltaba era:

1. El botón **"Comprar productos"** en el HERO de la página principal.
2. La opción **"Comprar productos"** en el menú hamburguesa, debajo de "Reserva tu servicio".
3. Una función de navegación que estableciera explícitamente el modo `compra` (independiente) y limpiara cualquier residuo del flujo de servicio (`productosServicio`) antes de entrar al catálogo.

Sin estos accesos, el usuario no podía iniciar una compra independiente directamente desde la página principal: debía pasar primero por el formulario de reserva.

## Evidencias / Cómo se confirmó

- En `assets/index.html` el HERO solo tenía dos botones (`Solicitar servicio` y `Conocer servicios`) en el bloque `fade-up delay-3`, líneas ~585-592.
- El menú hamburguesa activo es `#mobile-menu` (toggleado por `#menuBtn` en el script de línea ~2022); ahí existía la opción "Reserva tu servicio" sin una opción de compra debajo.
- `assets/js/catalogo.js` ya definía `DELIVERY_COST = 9000`, `catalogMode = sessionStorage.getItem("modoCatalogo") || "compra"`, `isServiceMode`, `irAlCatalogoDesdeServicio()` y `volverAlServicio()`, confirmando que la infraestructura de contexto de compra existía.
- `assets/index.html` (función `calcularPrecioDinamico`) ya leía `productosServicio` de `sessionStorage` y calculaba `precioServicio + totalProductos`.
- No existía ningún vínculo desde la página principal hacia `catalogo.html` en modo compra independiente.

## Solución propuesta

Mantener el catálogo único y reutilizable (sin crear un segundo catálogo), y exporner los accesos directos al flujo de compra independiente:

- Añadir un tercer botón **"Comprar productos"** en el HERO, al lado de los existentes, con la identidad visual de ProClean Prime.
- Añadir la opción **"Comprar productos"** en el menú hamburguesa, justo debajo de "Reserva tu servicio".
- Crear la función global `irAlCatalogoIndependiente()` que:
  - Establece `sessionStorage.modoCatalogo = "compra"` (compra independiente).
  - Elimina `sessionStorage.productosServicio` (evita arrastrar productos del flujo de servicio a una compra nueva).
  - Redirige a `catalogo.html`.

Con esto `catalogo.js` (que ya lee `modoCatalogo` para decidir domicilio $9.000 vs $0) aplica automáticamente la regla correcta en cada contexto.

## Cambios realizados

| Archivo | Cambio |
| ------- | ------ |
| `assets/index.html` | Se añadió el botón "Comprar productos" en el HERO (bloque `fade-up delay-3`) con `data-template-id="hero-buy-cta"` y onClick a `irAlCatalogoIndependiente()`. |
| `assets/index.html` | Se añadió la opción "Comprar productos" en el menú hamburguesa `#mobile-menu`, debajo de "Reserva tu servicio", con icono de carrito que cierra el menú y llama a `irAlCatalogoIndependiente()`. |
| `assets/index.html` | Se añadió la función global `irAlCatalogoIndependiente()` en el bloque `<script>` principal (junto al manejador del menú). |
| `assets/css/output.css` | Se regeneró con `npm run build` para incluir la clase Tailwind nueva `border-[#CFA754]` usada por el botón del HERO. |

No se modificó `assets/js/catalogo.js` ni la lógica de `calcularPrecioDinamico()`/`saveService()`, porque ya cumplían con la regla de domicilio y el total por contexto.

## Flujo de compra independiente

1. El usuario pulsa **"Comprar productos"** en el HERO o en el menú hamburguesa.
2. `irAlCatalogoIndependiente()` pone `modoCatalogo = "compra"` y limpia `productosServicio`.
3. Se abre `catalogo.html`.
4. El usuario agrega productos al carrito.
5. `catalogo.js` calcula el subtotal, y como `isServiceMode === false`, aplica `delivery = DELIVERY_COST (9000)`.
6. El carrito muestra Subtotal, Domicilio ($9.000) y Total (`productos + 9000`).
7. El usuario continúa al checkout (Datos de entrega), revisa el Resumen del pedido (Subtotal, Domicilio, Total) y pasa al pago.

## Flujo de productos desde servicio

1. Riesgo previo: durante la reserva, el usuario se encuentra en `assets/index.html#booking`.
2. Pulsa **"Agregar productos"** → `irAlCatalogoDesdeServicio()` pone `modoCatalogo = "servicio"` y abre `catalogo.html`.
3. El usuario agrega productos al carrito.
4. Como `isServiceMode === true`, `catalogo.js` usa `delivery = 0` y el botón cambia a "Agregar al servicio".
5. Al pulsar "Agregar al servicio", `volverAlServicio()` guarda el carrito en `sessionStorage.productosServicio` y regresa a `index.html#booking`.
6. `calcularPrecioDinamico()` lee `productosServicio`, suma su total y muestra `servicio + productos`, con domicilio $0.
7. `saveService()` envía el total real (servicio + productos) vía Apps Script.

## Manejo del domicilio

- **Compra independiente** (`modoCatalogo = "compra"`): se cobra **$9.000** de domicilio. Total = `productos + 9000`.
- **Productos desde servicio** (`modoCatalogo = "servicio"`): **no se cobra** domicilio. Total = `precioServicio + totalProductos`.

La regla vive en `assets/js/catalogo.js`: `const delivery = isServiceMode ? 0 : DELIVERY_COST;` con `DELIVERY_COST = 9000`.

## Verificación

- **PRUEBA 1 — Hero:** al pulsar "Comprar productos" se abre `catalogo.html` directamente. ✔ (función y enlace enlazados correctamente)
- **PRUEBA 2 — Menú:** desde el menú hamburguesa "Comprar productos" abre el mismo catálogo. ✔
- **PRUEBA 3 — 1 producto:** el carrito suma `producto + $9.000`. ✔ (lógica existente en `catalogo.js`)
- **PRUEBA 4 — 2+ productos:** suma el subtotal de productos + $9.000. ✔
- **PRUEBA 5 — servicio + productos:** domicilio = $0 y total = servicio + productos. ✔
- **PRUEBA 6 — modificar cantidad:** `renderCart()` recalcula subtotal/domicilio/total. ✔
- **PRUEBA 7 — eliminar producto:** recalcula los totales. ✔
- **PRUEBA 8 — sin productos en servicio:** el servicio funciona como antes. ✔
- **PRUEBA 9 — compra independiente:** funciona como compra independiente sin necesidad de servicio. ✔

> Nota: las pruebas se verificaron de forma estática (revisión de función, enlaces y reglas de cálculo). Se recomienda una prueba funcional en navegador real para confirmar el comportamiento visual y de navegación en dispositivos móviles y escritorio.

## Riesgos o puntos pendientes

- **Bold / pago:** la integración de pago con Bold sigue pendiente de credenciales y configuración del monto exacto a cobrar (productos + domicilio en compra independiente; servicio + productos en servicio). No se deben colocar claves privadas en HTML/JS.
- **Google Apps Script:** la URL existente de envío no se modificó. Si se desea registrar campos nuevos (modoCompra, productos, totalProductos, domicilio, totalFinal) en la hoja, debe ajustarse el script del backend y actualizarse `saveService()`/checkout para enviarlos. Actualmente `saveService()` envía el total real y el servicio seleccionado.
- **Catálogo:** los productos 6–9 en `assets/js/catalogo.js` tienen `price: 0` y nombres/imágenes provisionales; deben completarse antes de ponerlo en producción.
- **Carrito en modo servicio:** el carrito conserva estado en memoria de la sesión; si el usuario vuelve y cambia de contexto, `irAlCatalogoIndependiente()` limpia `productosServicio` para evitar mezclar flujos.
- **Menú hamburguesa duplicado:** en `assets/index.html` existen dos contenedores (`#mobile-menu` activo y un `<aside id="mobileMenu">` sin lógica). Solo el `#mobile-menu` está en uso; el aside se dejó intacto para no romper nada, pero podría eliminarse en una limpieza futura.
- **Duplicación de listeners en `catalogo.js`:** hay listeners repetidos para `checkoutButton`, `closeCheckout`, `checkoutModalOverlay` y `checkoutForm` (idénticos en comportamiento). No rompen la funcionalidad pero se recomienda unificarlos en una limpieza posterior.