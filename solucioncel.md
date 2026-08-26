rol:Actúa como un Desarrollador Front-End Senior y Diseñador UX/UI experto en optimización responsive y diseño adaptable (Mobile First). Tu objetivo es solucionar de raíz graves problemas de visualización y maquetación (layout roto) que presenta actualmente la versión móvil de la web "ProClean PRIME", la cual funciona correctamente en escritorio pero se ve horrible en celulares.

DESCRIPCIÓN DETALLADA DE LOS SÍNTOMAS VISUALES:
Aunque no tengo las capturas visuales aquí, te describo exactamente cómo se rompe el diseño en pantallas pequeñas (móvil):

1.  **Tarjetas de Producto Deformadas (Grid / Flexbox roto):** Los contenedores de los productos no se adaptan al ancho de la pantalla. En lugar de mostrarse correctamente en una columna o en un grid adaptable, el contenido se desborda.
2.  **Imágenes de Producto Cortadas o Desproporcionadas:** Las imágenes de los productos (botellas, cepillos) aparecen cortadas lateralmente o escaladas incorrectamente dentro de sus contenedores. No mantienen su relación de aspecto (`aspect-ratio`), pareciendo estiradas o aplastadas. Pierden su fondo transparente y el efecto visual de "flotar sobre el podio".
3.  **Textos Superpuestos y Desbordados:** Los títulos de los productos son demasiado grandes para la pantalla móvil, causando cortes de palabras, saltos de línea incorrectos que tapan otros elementos, o superposición de textos (el precio se monta encima del nombre del producto).
4.  **Falta de Padding y Márgenes en Contenedores:** Los elementos están pegados a los bordes laterales de la pantalla del celular, sin aire visual (falta de `padding`), haciendo que el diseño se sienta apretado y poco profesional.
5.  **Componentes de UI Mal Escalados:** Botones como el de "Agregar al carrito" o "Ver información" se salen del ancho de la pantalla, son excesivamente grandes, o están desalineados respecto a la tarjeta del producto. Los elementos como el podio o los círculos decorativos detrás del producto se salen de su lugar.
6.  **El Banner Principal es un caos:** El banner con la caricatura de la chica y los productos pierde todo su sentido de composición en móvil. Los elementos gráficos (productos, textos) se amontonan y desbordan el contenedor principal.

TAREA PRINCIPAL:
1.  Basándote en esta descripción técnica de los síntomas, deduce la CAUSA RAÍZ técnica de los errores (ejemplos: mal uso de unidades fijas `px` en lugar de relativas `%` o `rem`, falta de `media queries` adecuadas para móvil, uso incorrecto de `object-fit` en imágenes, `flex-wrap` ausente, contenedores padres sin `overflow: hidden`).
2.  Propón una refactorización completa de los estilos CSS y la estructura HTML para implementar un diseño **Mobile First** robusto y fluido.

REGLA CRÍTICA DE INTERACCIÓN:
- ANTES de asumir código o dar soluciones, si necesitas fragmentos de código HTML/CSS específicos, las clases utilizadas en los componentes descritos, o la URL para inspeccionar, házmelas necesarias de forma directa y estructurada.

Por favor, comienza indicándome qué información necesitas de mi parte para proceder con la solución definitiva tras este análisis de síntomas.