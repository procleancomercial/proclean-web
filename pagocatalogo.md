ROL:
Actúa como un desarrollador senior especializado en aplicaciones web, JavaScript, HTML y CSS, con experiencia en integración de catálogos, carritos de compra, formularios de agendamiento, lógica de precios y flujos de pago.

Tu objetivo NO es simplemente modificar código para que "parezca funcionar". Debes analizar primero la arquitectura actual del proyecto, identificar la causa raíz de cualquier problema y proponer una solución segura que no rompa funcionalidades existentes.


CONTEXTO DEL PROYECTO:

Estoy desarrollando la página web de ProClean Prime.

El proyecto actualmente tiene:

- Página principal.
- Servicios.
- Sistema de agendamiento.
- Formulario de datos del cliente.
- Cálculo dinámico del precio del servicio.
- Calendario.
- Descuentos según cantidad de días y plan.
- Catálogo de productos de limpieza.
- Búsqueda de productos.
- Tarjetas de productos.
- Carrito de compras.
- Checkout.
- Resumen del pedido.
- Integración con Google Apps Script / Google Sheets.
- Métodos de pago.
- Integración preparada para Bold.

El catálogo de productos debe funcionar como un único catálogo reutilizable en DOS escenarios diferentes.


ESCENARIO 1 — COMPRA INDEPENDIENTE:

El usuario NO desea contratar un servicio.

El usuario debe poder entrar directamente al catálogo desde la página principal.

Flujo:

Comprar productos
→ Catálogo
→ Agregar productos
→ Carrito
→ Datos de entrega
→ Resumen
→ Pago

En este escenario:

- No existe un servicio agendado.
- No existe especialista asignada.
- Los productos son enviados al cliente.
- Se cobra domicilio de $9.000.
- El domicilio debe aparecer en el carrito/resumen.
- El total debe ser:

Productos + $9.000 domicilio = Total a pagar.


ESCENARIO 2 — PRODUCTOS DURANTE LA RESERVA DE UN SERVICIO:

El usuario sí está agendando un servicio de limpieza.

Durante el proceso de reserva debe poder agregar productos del mismo catálogo.

Flujo:

Agendar servicio
→ Seleccionar servicio
→ Calcular precio del servicio
→ Agregar productos
→ Regresar al resumen del servicio
→ Servicio + productos
→ Pago

En este escenario:

- Existe una reserva de servicio.
- Existe una especialista asignada.
- La especialista llevará los productos al cliente.
- NO se cobra domicilio por los productos.
- Los productos se suman al precio del servicio.
- El cliente paga servicio + productos en el mismo proceso.
- La especialista NO recibe dinero del cliente.


IMPORTANTE:

Debe existir UN SOLO catálogo.

No quiero crear dos catálogos diferentes.

El mismo catálogo debe poder utilizarse desde ambos flujos.

El sistema debe identificar el contexto de compra.

Por ejemplo:

modoCompra = "independiente"

o

modoCompra = "servicio"

Pero NO implementes esta solución literalmente si existe una estructura mejor dentro del proyecto. Primero revisa el código existente y utiliza la arquitectura más segura y coherente.


NUEVO BOTÓN — COMPRA DE PRODUCTOS:

Necesito crear un nuevo botón:

"Comprar productos"

Este botón será para los usuarios que NO desean contratar un servicio y simplemente quieren comprar productos de limpieza.


UBICACIÓN 1 — HERO DE LA PÁGINA PRINCIPAL:

Actualmente existen los botones:

"Solicitar servicio"

"Conocer servicios"

Quiero agregar al lado de ellos un tercer botón:

"Comprar productos"

Debe mantener:

- El estilo visual de ProClean Prime.
- La tipografía existente.
- Los colores existentes.
- Los bordes y sombras existentes.
- El comportamiento responsive.
- La adaptación para celulares.

No debe parecer un botón agregado posteriormente.


UBICACIÓN 2 — MENÚ HAMBURGUESA:

También quiero agregar:

"Comprar productos"

Debe aparecer debajo de:

"Reserva tu servicio"

Por ejemplo:

Reserva tu servicio
Comprar productos
Servicios
Promociones
...

No elimines ni cambies las opciones existentes del menú.


COMPORTAMIENTO DEL BOTÓN:

Cuando el usuario pulse:

"Comprar productos"

debe entrar directamente al catálogo.

No debe pasar primero por el formulario de reserva.

El flujo debe ser:

Comprar productos
→ Catálogo
→ Carrito
→ Datos de entrega
→ Resumen
→ Pago


INTEGRACIÓN DEL CATÁLOGO CON EL SERVICIO:

Cuando el usuario esté realizando una reserva y seleccione:

"¿Necesitas productos de limpieza?"

debe poder acceder al mismo catálogo.

Los productos seleccionados deben guardarse temporalmente y regresar al proceso de reserva.

Al regresar al formulario del servicio debe aparecer un resumen de los productos seleccionados.

Ejemplo:

Productos agregados

Limpia Vidrios × 2       $50.000
Desengrasante × 1        $35.000

Productos                 $85.000

Servicio                  $178.000
Productos                  $85.000
Domicilio                      $0
--------------------------------
TOTAL                    $263.000


COMPRA INDEPENDIENTE:

En cambio, si el usuario entró desde:

"Comprar productos"

el resumen debe ser:

Productos

Limpia Vidrios × 2       $50.000
Desengrasante × 1        $35.000

Subtotal                  $85.000
Domicilio                  $9.000
--------------------------------
TOTAL                     $94.000


LÓGICA DEL DOMICILIO:

La regla debe ser estrictamente:

SI modoCompra === "independiente":

domicilio = 9000

SI modoCompra === "servicio":

domicilio = 0


No debe cobrarse domicilio cuando los productos forman parte de una reserva de servicio.


LÓGICA DEL PRECIO DEL SERVICIO:

Actualmente existe una función:

calcularPrecioDinamico()

Esta función calcula el precio del servicio según:

- Servicios seleccionados.
- Cantidad de días.
- Tarifa de Home Pet Grooming.
- Primer servicio.
- Descuentos por cantidad de días.
- Plan de continuidad.

No debes eliminar esta lógica.

Debes integrarla correctamente con el valor de los productos.

El precio final del servicio debe ser:

precioServicio + totalProductos

cuando los productos fueron agregados desde el flujo de servicio.


PRECIO DE COMPRA INDEPENDIENTE:

Cuando la compra es independiente:

precioFinal = totalProductos + domicilio

No debe incluir ningún precio de servicio.


CARRITO:

Actualmente existe un carrito de productos.

Debes revisar el carrito actual antes de modificarlo.

Debe conservar:

- Agregar producto.
- Aumentar cantidad.
- Disminuir cantidad.
- Eliminar producto.
- Subtotal.
- Domicilio.
- Total.
- Contador de productos.
- Checkout.
- Resumen.

No reemplaces el carrito completo si solamente es necesario modificar la lógica del domicilio o del contexto de compra.


SESSION STORAGE:

Actualmente existe una lógica relacionada con:

sessionStorage

y:

productosServicio

Debes revisar cómo está implementada.

Si ya funciona correctamente para transportar productos desde el catálogo hacia el formulario de servicio, reutilízala.

No crees una segunda variable que haga exactamente lo mismo sin necesidad.


FORMULARIO DE SERVICIO:

Existe una función:

saveService()

Esta función captura datos como:

- Nombre.
- Teléfono.
- Tipo de identificación.
- Número de identificación.
- Cómo conoció ProClean Prime.
- Servicios seleccionados.
- Dirección.
- Fecha.
- Precio.
- Forma de pago.
- Observaciones.

No debes romper esta función.

Debes revisar cómo incorporar el total de productos cuando el usuario viene desde el flujo de servicio.

El valor enviado debe corresponder al total real que el cliente debe pagar.


GOOGLE APPS SCRIPT:

El proyecto actualmente envía información a Google Apps Script / Google Sheets.

No debes modificar la URL existente ni romper la estructura actual sin antes revisar cómo está funcionando.

Si es necesario agregar campos nuevos, explica cuáles serían y por qué.

Por ejemplo, podría ser necesario guardar:

- modoCompra
- productos
- totalProductos
- domicilio
- totalFinal

Pero primero revisa la estructura actual antes de implementarlo.


PAGO / BOLD:

Existe una integración de pago mediante Bold.

IMPORTANTE:

No necesito que inventes una API Key ni credenciales.

No debes colocar claves privadas directamente en HTML o JavaScript.

El objetivo actual es preparar correctamente el valor final que debe enviarse al proceso de pago.

El monto debe ser exacto dependiendo del flujo:

COMPRA INDEPENDIENTE:

productos + domicilio

SERVICIO:

servicio + productos

sin domicilio.


NO ROMPER FUNCIONALIDADES EXISTENTES:

Antes de modificar cualquier cosa, revisa cuidadosamente:

- HTML.
- CSS.
- JavaScript.
- IDs utilizados.
- Funciones existentes.
- Event listeners.
- sessionStorage.
- Carrito.
- Checkout.
- Formularios.
- saveService().
- calcularPrecioDinamico().
- Integración con Apps Script.
- Navegación.
- Menú hamburguesa.
- Botones actuales.

No dupliques funciones.

No dupliques event listeners.

No reemplaces código que ya funciona sin justificarlo.

No cambies nombres de IDs existentes sin revisar todas sus referencias.


CAUSA RAÍZ:

Si encuentras un problema, NO te limites a corregir el síntoma.

Debes identificar:

1. Qué está fallando.
2. Por qué está fallando.
3. En qué archivo ocurre.
4. Qué función o elemento está provocando el problema.
5. Qué evidencia confirma la causa.
6. Qué solución concreta debe aplicarse.


ANTES DE MODIFICAR:

Primero inspecciona el proyecto y localiza:

- Página principal.
- Página o sección de catálogo.
- Archivo JavaScript del catálogo.
- Archivo CSS del catálogo.
- Formulario de servicio.
- Función calcularPrecioDinamico().
- Función saveService().
- Lógica productosServicio.
- sessionStorage.
- Carrito.
- Checkout.
- Menú hamburguesa.
- Botones "Solicitar servicio" y "Conocer servicios".

Si necesitas información adicional para identificar correctamente la causa raíz, PREGUNTA ANTES DE ASUMIR.

Puedes pedirme:

- Capturas de pantalla.
- Archivo HTML específico.
- Archivo JavaScript específico.
- Archivo CSS.
- Código de una función.
- Estructura de carpetas.
- Error de consola.
- Resultado de una prueba.

No inventes información que no puedas confirmar.


TAREA PRINCIPAL:

Analiza el proyecto completo y realiza la integración necesaria para que:

1. Exista el botón "Comprar productos" en el HERO.
2. Exista "Comprar productos" en el menú hamburguesa debajo de "Reserva tu servicio".
3. Ambos botones lleven directamente al catálogo.
4. El catálogo siga siendo uno solo.
5. El catálogo pueda utilizarse desde una compra independiente.
6. El catálogo pueda utilizarse durante la reserva de un servicio.
7. Los productos seleccionados desde el servicio regresen correctamente al formulario.
8. El precio del servicio se combine correctamente con los productos.
9. No se cobre domicilio cuando los productos forman parte del servicio.
10. Se cobre $9.000 de domicilio cuando la compra sea independiente.
11. El carrito funcione correctamente en ambos contextos.
12. El resumen muestre claramente servicio, productos, domicilio y total.
13. saveService() reciba el valor correcto.
14. No se rompa Google Apps Script.
15. No se rompa la lógica actual del catálogo.
16. No se rompa la búsqueda de productos.
17. No se rompa el checkout.
18. No se rompa la navegación existente.
19. No se dupliquen funciones innecesariamente.
20. El diseño mantenga la identidad visual de ProClean Prime.


PRUEBAS OBLIGATORIAS:

Después de realizar los cambios debes verificar estos escenarios:

PRUEBA 1:

Entrar a la página principal.

Presionar:

"Comprar productos"

Resultado esperado:

Debe abrir el catálogo directamente.


PRUEBA 2:

Desde el menú hamburguesa:

Presionar:

"Comprar productos"

Resultado esperado:

Debe abrir el mismo catálogo.


PRUEBA 3:

Comprar un producto desde el catálogo.

Resultado esperado:

Debe calcular:

producto + $9.000 domicilio.


PRUEBA 4:

Agregar dos o más productos.

Resultado esperado:

Debe calcular correctamente:

subtotal de productos + $9.000.


PRUEBA 5:

Entrar a "Solicitar servicio".

Seleccionar un servicio.

Agregar productos.

Resultado esperado:

Servicio + productos.

Domicilio = $0.


PRUEBA 6:

Modificar cantidad de productos.

Resultado esperado:

El total debe actualizarse correctamente.


PRUEBA 7:

Eliminar un producto.

Resultado esperado:

El total debe actualizarse correctamente.


PRUEBA 8:

No seleccionar productos.

Resultado esperado:

El servicio debe seguir funcionando exactamente como antes.


PRUEBA 9:

No seleccionar servicio y entrar por "Comprar productos".

Resultado esperado:

Debe funcionar como compra independiente.


FORMATO DE ENTREGA:

Debes crear un archivo:

diagnostico.md

en la raíz del proyecto.

El archivo debe contener exactamente estas secciones:

# Diagnóstico

## Resumen del problema

Explica brevemente qué problema o necesidad se encontró.

## Causa raíz identificada

Explica la causa técnica real.

No describas solamente el síntoma.

## Evidencias / Cómo se confirmó

Explica qué elementos del código, consola, estructura o pruebas permitieron confirmar la causa.

## Solución propuesta

Explica qué se modificó o qué debe modificarse y por qué.

## Cambios realizados

Lista los archivos modificados y explica brevemente qué se cambió en cada uno.

## Flujo de compra independiente

Explica cómo funciona:

Comprar productos
→ Catálogo
→ Carrito
→ Checkout
→ Domicilio
→ Pago

## Flujo de productos desde servicio

Explica cómo funciona:

Servicio
→ Catálogo
→ Productos
→ Regreso al servicio
→ Total
→ Pago

## Manejo del domicilio

Explica claramente cuándo se cobra $9.000 y cuándo $0.

## Verificación

Indica las pruebas realizadas y el resultado de cada una.

## Riesgos o puntos pendientes

Indica cualquier cosa que todavía necesite configuración externa, especialmente Bold, credenciales, Apps Script o backend.


IMPORTANTE SOBRE EL CÓDIGO:

Si encuentras código incorrecto, duplicado o conflictivo:

1. Explica primero cuál es el problema.
2. Identifica la causa raíz.
3. Propón la solución.
4. Si aplica, proporciona el código corregido.
5. Indica exactamente EN QUÉ ARCHIVO y EN QUÉ PARTE debe colocarse.
6. No me entregues solamente fragmentos sin explicar dónde van.
7. No elimines código existente que funcione sin justificarlo.


CONDICIÓN FINAL:

NO DES POR TERMINADO EL TRABAJO solamente porque el código no muestre errores de sintaxis.

Debes verificar el comportamiento real de los dos flujos:

A) COMPRA INDEPENDIENTE

B) COMPRA DE PRODUCTOS DESDE UN SERVICIO

El objetivo es que ambos funcionen con el mismo catálogo, pero con reglas diferentes para el domicilio y el cálculo del total.

Si para continuar necesitas información que no está disponible en el proyecto, DETENTE Y PREGUNTA antes de asumir.