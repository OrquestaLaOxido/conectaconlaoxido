# La Óxido — Control Visual

Panel de control visual para eventos en directo de **Orquesta La Óxido**: el
público manda mensajes, fotos y reacciones desde su móvil (escaneando un QR),
el operador los modera, y salen proyectados en pantalla junto al grupo
(overlay con fondo chroma, pensado para OBS/Resolume/vMix).

**Web pública:** `https://orquestalaoxido.github.io/conectaconlaoxido/`

Este documento resume el historial de versiones. Para instrucciones de
configuración en Firebase, ver `INSTRUCCIONES.md`.


## Estructura del proyecto

| Archivo | Qué es |
|---|---|
| `index.html` | Página pública — el formulario que ve el público al escanear el QR |
| `dashboard.html` | Panel del operador: crear/editar/activar eventos, ver QR |
| `control.html` | Panel de moderación de un evento concreto |
| `overlay.html` | Fuente de navegador para OBS/Resolume — lo que se proyecta |
| `firebase-config.js` | Configuración de Firebase, referencias a Firestore, versión de la app |
| `moderacion.js` | Filtro de palabras prohibidas |
| `avatar.js` | Generación de avatares (foto o iniciales con color) |
| `utilidades-imagen.js` | Redimensionado/compresión de fotos antes de subirlas |
| `qr-utils.js` | Generación y composición de las imágenes de QR |
| `style.css` | Todos los estilos |
| `firestore.rules` | Reglas de seguridad de la base de datos |
| `INSTRUCCIONES.md` | Guía de configuración en Firebase, paso a paso |


## Historial de versiones


### V1.0 — Primera versión funcional

- Página pública (`index.html`) con formulario de mensaje + foto opcional.
- Panel de moderación (`control.html`): bandeja de pendientes, aprobar/rechazar.
- Overlay (`overlay.html`) con fondo chroma, mostrando mensajes aprobados.
- Firebase Firestore como base de datos, sin autenticación todavía.
- Filtro básico de palabras prohibidas.


### V1.1 — Cuentas de Google, multi-evento y seguridad

**Identidad real del público**
- Login obligatorio con Google para el público (antes no había forma de
  saber quién mandaba cada mensaje).
- Nombre y foto mostrados en pantalla = los reales de la cuenta de Google
  (ya no se pide usuario de Instagram, no era técnicamente viable
  capturarlo automáticamente).
- Dos apps de Firebase independientes ("público" y "operador") para que
  sus sesiones no se pisen entre sí en el mismo navegador.

**Multi-evento**
- `dashboard.html` nuevo: crear eventos (título + fecha), cada uno con su
  propio QR, su propia bandeja de moderación y su propio overlay,
  totalmente aislados.
- QR con título y subtítulo personalizables, descargable como imagen, y
  también publicable directamente en el overlay como una tarjeta más.

**Diseño**
- Rediseño visual completo: logo centrado y agrandado, pie de página con
  datos de contacto y redes de "Espectáculos La Fiesta", copyright en
  todas las páginas.
- Estilos de mensaje configurables: clásico o PopUp, 4 fondos, 2 tipos de
  letra, todo guardado en Firestore.
- Aro de cuenta atrás alrededor del avatar mientras el mensaje está en
  pantalla.

**Seguridad**
- El operador se identifica mediante un *custom claim* de Firebase
  (`moderador: true`) en vez de por email — así el email no queda
  expuesto en el código ni en las reglas.
- Reglas de Firestore: el nombre y la foto del público tienen que
  coincidir exactamente con los de su token de Google (imposible
  suplantar a otra persona).
- Aviso de privacidad antes del login explicando que el nombre/foto se
  proyectarán si el mensaje se aprueba.


### V1.2 — Sorteos, redes sociales, moderación de usuarios y cola de reproducción

Lanzamiento grande con seis funciones nuevas y un arreglo de bug:

- **Corrección**: el botón "Mostrar foto" en `control.html` no funcionaba
  (chocaba con otro botón que compartía la misma clase CSS).
- **Tiempo de espera configurable** (0-200s) entre mensajes de una misma
  persona del público — antes era fijo (15s) y solo afectaba al público,
  nunca a las acciones del operador.
- **Lluvia de emojis** disponible también para el público (antes solo la
  tenía el operador), pasando por moderación igual que un mensaje.
- **Participantes**: lista de todo el público que ha escrito, con botones
  para **Silenciar** o **Banear** — bloqueado también a nivel de
  servidor (Firestore), no solo visual.
- **Instagram y TikTok** por separado: el operador escribe el usuario de
  cada red y la publica en el overlay como una tarjeta con su logo.
- **Sorteo**: lista de nombres → "Ejecutar Sorteo" → animación tipo
  ruleta en el overlay que termina revelando un ganador, con confeti.
- **Eventos activables/desactivables**: si el evento de hoy está inactivo
  (o no existe ninguno), el público ve "Sin evento activo" y no puede
  iniciar sesión — reforzado también en las reglas de Firestore, no solo
  en la interfaz.

**Rondas de pulido tras el lanzamiento (V1.2.1 → V1.2.6)**

- *1.2.1* — La foto directa del operador se limpia sola tras enviarse a
  la cola (antes se quedaba con la vista previa puesta, podía confundir).
  Versión de la app visible junto al copyright en las 3 páginas.
- *1.2.2* — Arreglado el desajuste visual de los botones de lluvia de
  emojis del público en pantallas pequeñas (les faltaba estilo propio).
  Sorteo sin la sacudida/temblor del texto durante el giro, y más rápido.
- *1.2.3* — Pausa final del sorteo (justo antes de revelar al ganador)
  acortada. Contador de tiempo restante junto a "En reproducción" en la
  cola de visualización, actualizado cada segundo.
- *1.2.4* — La cola de visualización se ordena visualmente según el
  orden real de reproducción (lo que está en pantalla, luego lo que
  espera turno por orden de haber pulsado "Mostrar", luego lo pendiente
  de pulsar) — antes se ordenaba solo por fecha de aprobación, lo que
  podía no coincidir con el orden real de salida.
- *1.2.5* — Corregida una condición de carrera: si se pulsaba "Quitar"
  justo en el instante en que el sistema pasaba automáticamente al
  siguiente elemento en espera, ese elemento podía acabar
  reproduciéndose igualmente pese a haberse quitado.
- *1.2.6* — "Quitar" sobre algo que está en pantalla ahora mismo actúa
  como parada de emergencia real: limpia el overlay al instante y pasa
  ya al siguiente en espera, en vez de dejarlo en pantalla hasta que
  terminara su tiempo por sí solo.


## Funciones clave introducidas por versión (resumen rápido)

| Función | Versión |
|---|---|
| Mensajes + fotos + moderación básica | V1.0 |
| Login con Google del público | V1.1 |
| Multi-evento (dashboard) | V1.1 |
| Custom claim / seguridad del operador | V1.1 |
| Estilos configurables (clásico/PopUp) | V1.1 |
| QR publicable en overlay | V1.1 |
| Tiempo de espera configurable | V1.2 |
| Lluvia de emojis del público | V1.2 |
| Participantes (silenciar/banear) | V1.2 |
| Instagram/TikTok en overlay | V1.2 |
| Sorteo con ruleta y confeti | V1.2 |
| Activar/desactivar eventos | V1.2 |
| Cola de reproducción secuencial (sin solapes) | V1.2.1–1.2.6 |
| Parada de emergencia desde la cola | V1.2.6 |
