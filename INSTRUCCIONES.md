# Configuración final en Firebase

⚠️ **PASO NUEVO Y OBLIGATORIO — hazlo antes que nada, o dejarás de
poder entrar en `control.html`/`dashboard.html`:**

## 0. Asignar el "custom claim" de operador (imprescindible)

Antes, las reglas comprobaban tu email directamente — pero eso significaba
que cualquiera podía ver tu email de operador abriendo la consola del
navegador (F12). Para evitarlo, ahora usamos una "etiqueta invisible"
(`moderador: true`) asociada a tu cuenta en el servidor, que nadie puede
ver desde el navegador. Hay que asignarla una vez, desde fuera de la web,
así:

1. Ve a **https://console.cloud.google.com/**, arriba a la izquierda
   selecciona el proyecto **oxido-eventos**.
2. Arriba a la derecha, pulsa el icono de terminal **">_"** (Cloud Shell)
   para abrir una consola en el navegador — no hay que instalar nada.
3. Pega estos comandos, uno por uno (espera a que termine cada uno):

   ```
   mkdir claim && cd claim
   npm init -y
   npm install firebase-admin
   ```

4. Ahora crea el archivo del script. Escribe:

   ```
   nano asignar.js
   ```

   Y pega este contenido dentro (clic derecho → pegar, o Ctrl+Shift+V):

   ```js
   const admin = require('firebase-admin');
   admin.initializeApp({ projectId: 'oxido-eventos' });

   // Pon aquí el UID de tu usuario operador (Authentication → Users →
   // columna "UID del usuario" de orquestalaoxido@gmail.com)
   const uid = "PEGA_AQUI_TU_UID";

   admin.auth().setCustomUserClaims(uid, { moderador: true })
     .then(() => { console.log("✅ Listo, claim asignado."); process.exit(0); })
     .catch(err => { console.error(err); process.exit(1); });
   ```

   Guarda con **Ctrl+O**, Enter, y sal con **Ctrl+X**.

5. Ejecuta:

   ```
   node asignar.js
   ```

   Deberías ver "✅ Listo, claim asignado."

6. **Importante:** ese cambio no se nota hasta que vuelvas a iniciar
   sesión. Ve a `control.html`, dale a "Cerrar sesión" si estabas
   dentro, y entra otra vez con tu email/contraseña.

Si en el futuro añades un segundo operador, repite esto con su UID.


---


⚠️ **Importante:** `firestore.rules` ha cambiado otra vez (ya no
comprueba tu email, comprueba el claim del paso 0 de arriba). Aunque ya
hubieras publicado una versión anterior, tienes que volver a pegar el
contenido actual del archivo y publicarlo de nuevo.

Con el cambio a "login con Google obligatorio para el público" y el nuevo
dashboard de eventos, hay pasos nuevos/importantes además de los que ya
hiciste. Todo esto es dentro de la consola de Firebase
(https://console.firebase.google.com/).


## 1. Activar Google como método de acceso

1. Menú lateral → **Authentication** → pestaña **Sign-in method**.
2. Ya tienes activado "Correo electrónico/contraseña" (el tuyo, de operador).
3. Ahora activa también **Google**: haz clic en él → actívalo → elige un
   email de soporte (puede ser el mismo tuyo) → Guardar.

Este es el método que usará el PÚBLICO para enviar mensajes (no tiene nada
que ver con tu login de operador, son cosas independientes).


## 2. Poner tu email real en las reglas de seguridad

Esto es importante y es nuevo: antes, "estar logueado" solo lo cumplía el
operador. Ahora el público **también** inicia sesión (con Google), así que
las reglas necesitan saber cuál es tu email exacto para distinguirte de
cualquier persona del público.

1. Abre el archivo `firestore.rules` que te he pasado.
2. Busca esta línea:
   ```
   "orquestalaoxido@gmail.com"
   ```
3. Cámbiala por tu email EXACTO (el mismo con el que inicias sesión en
   `control.html`). Si en el futuro hay más de un operador, añade más
   emails separados por comas dentro de los corchetes.
4. En Firebase: **Firestore Database** → pestaña **Reglas** → borra lo que
   haya → pega el contenido actualizado de `firestore.rules` → **Publicar**.

Sin este paso, el público podría leer, aprobar o borrar los mensajes de
otros — no te lo saltes.


## 3. Añadir tu dominio como "autorizado"

El login con Google (a diferencia del de email/contraseña) exige que el
dominio donde está la web esté en la lista blanca de Firebase.

Tu web ya está alojada en GitHub Pages, en:
`https://orquestalaoxido.github.io/conectaconlaoxido/`

1. En Firebase: **Authentication** → pestaña **Settings** → sección
   **Authorized domains** → **Add domain**.
2. Pega **solo el dominio**, sin `https://` y sin la ruta:
   ```
   orquestalaoxido.github.io
   ```
   (Firebase autoriza por dominio completo, no por subcarpeta — así que
   no hace falta poner `/conectaconlaoxido/`, con el dominio basta.)
3. Guarda.

Si no haces esto, el botón "Continuar con Google" fallará con un error de
tipo `auth/unauthorized-domain`.

La página que verá el público al escanear el QR es `index.html` (la raíz
de tu sitio: `https://orquestalaoxido.github.io/conectaconlaoxido/`).
`control.html` y `overlay.html` los abres tú directamente por su nombre.

Nota: el login con Google **no funciona abriendo los archivos en local**
(`file:///...`) — necesita estar servido por `https://`, así que a partir
de ahora prueba siempre desde la URL de GitHub Pages, no desde tu disco.


## Cómo usarlo el día del evento

1. Ve a `dashboard.html`, inicia sesión con tu email de operador, y pulsa
   **"+ Crear evento"** (título + fecha). Se genera automáticamente un
   identificador único para ese evento.
2. En la tarjeta del evento, pulsa **"📱 Ver QR"** — ese QR apunta a
   `index.html?evento=<ese-evento>`, exclusivo para esa actuación.
   Proyéctalo o imprímelo.
3. Pulsa **"🎛️ Moderar"** para entrar al panel de ese evento en concreto
   (`control.html?evento=<ese-evento>`).
4. Abre `overlay.html?evento=<ese-evento>` como fuente de navegador en
   OBS/Resolume/vMix — el `?evento=` tiene que coincidir con el que estás
   moderando.
5. El público escanea el QR → inicia sesión con su Google (obligatorio,
   así evitamos spam/bots) → escribe su mensaje → lo envía.
6. Te aparece en **"📥 Mensajes del público (pendientes de revisar)"**:
   revisa cada uno y pulsa **✅ Aprobar (a la cola)** o **❌ Rechazar**.
7. Los aprobados pasan a **"🎬 Cola de visualización"**: cuando quieras
   sacarlos en pantalla, dale a **▶️ Mostrar**.
8. Los controles de "Mensaje manual", "Reacciones" y "Foto directa" son
   solo para ti (el operador) y salen directos a pantalla, sin pasar por
   moderación.

Desde `control.html` puedes volver al dashboard en cualquier momento con
el enlace **"← Dashboard"** de la cabecera.


## Sobre el nombre y la foto del público

Ya no se pide el usuario de Instagram (no era técnicamente viable
capturarlo automáticamente — solo lo dejaba el propio Instagram si cada
persona hacía login con su cuenta de Instagram, y encima solo funciona
con cuentas profesionales, no personales).

En su lugar: el nombre y la foto que se muestran son los de la cuenta de
Google con la que inician sesión (su nombre real y su foto de perfil de
Google), capturados 100% automáticamente, sin que nadie suba nada a mano.
Si alguna cuenta de Google no tiene foto puesta, se genera un círculo de
color con la inicial de su nombre en su lugar.


## Varios eventos a la vez

Ya no hace falta editar URLs a mano: crea cada evento desde `dashboard.html`
y usa el QR que te genera para ese evento. Cada uno tiene su propia
bandeja de moderación y su propio overlay, totalmente aislados entre sí.

Eso sí: el `?evento=...` de `overlay.html` tiene que coincidir con el del
evento que estés moderando — cópialo del enlace que te muestra el QR.


## Sobre las fotos

Las fotos que la gente adjunta para mostrar en pantalla se guardan
comprimidas directamente en Firestore (no en Firebase Storage), para no
tener que configurar nada más. El avatar ya no ocupa casi espacio, porque
ahora es solo un enlace a la foto de Google, no una imagen completa.
