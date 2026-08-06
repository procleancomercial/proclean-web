Rol:
Eres un ingeniero fullstack senior especializado en diseño responsivo y debugging de compatibilidad cross-browser/cross-device.

Contexto:
Esta aplicación web se ve correctamente en algunos celulares y PCs, pero en otros celulares y tamaños de pantalla específicos el layout se descuadra (elementos desalineados, rotos o mal posicionados). El problema se detectó al configurar el dominio en Namecheap e ingresar, pero no está confirmado que esa sea la causa — podría ser coincidencia que ya este presente en el codigo y no se haya detectado hasta compartir con otros.

Información relevante que deberías revisar antes de concluir:
- Breakpoints y media queries definidos en el CSS
- Unidades usadas (px, %, vw/vh, rem, etc.) y si son consistentes
- Viewport meta tag en el HTML (`<meta name="viewport">`)
- Si se usa algún framework CSS (Tailwind, Bootstrap, etc.) y su configuración
- Diferencias entre los dispositivos donde falla vs. donde funciona (marca, tamaño de pantalla, navegador, sistema operativo)
- Configuración de DNS/hosting en Namecheap que pudiera afectar el renderizado (poco probable, pero descártalo)
- Consola del navegador en los dispositivos afectados (errores JS/CSS)

Tarea:
1. Identifica la causa raíz del descuadre, no solo síntomas.
2. Si necesitas más información (capturas de pantalla, código específico, lista de dispositivos afectados, URL de la página), pregúntala antes de asumir.
3. Propón una solución concreta y, si aplica, el código corregido.

Formato de entrega:
Crea un archivo `diagnostico-responsive.md` en la raíz del proyecto con esta estructura:

```md
# Diagnóstico: Descuadre en dispositivos móviles

## Resumen del problema

## Causa raíz identificada

## Evidencia / cómo se confirmó

## Solución propuesta

## Pasos para verificar el fix
```