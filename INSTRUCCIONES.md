# Configuración final en Firebase

Ya tienes el proyecto y la app web creados. Faltan 3 cosas, todas dentro de
la consola de Firebase (https://console.firebase.google.com/), antes de que
esto funcione:


## 1. Activar el inicio de sesión (para que solo tú puedas moderar)

1. Menú lateral → **Compilación** → **Authentication**.
2. Pestaña **Sign-in method** → habilita **Correo electrónico/contraseña**.
3. Ve a la pestaña **Users** → **Añadir usuario** → pon tu email y una
   contraseña. Ese será tu login en `control.html`.


## 2. Confirmar que Firestore está creado

1. Menú lateral → **Bases de datos y almacenamiento** → **Firestore Database**.
2. Si no la creaste antes, dale a **Crear base de datos**, modo **producción**,
   elige una región cercana (ej. `eur3`).


## 3. Pegar las reglas de seguridad

1. Dentro de Firestore Database, pestaña **Reglas**.
2. Borra lo que haya y pega el contenido del archivo `firestore.rules`
   que te he generado.
3. Dale a **Publicar**.

Sin este paso, o el público no podrá enviar mensajes, o cualquiera podría
leer/borrar mensajes de otros — así que no te lo saltes.


## Cómo usarlo el día del evento

1. Abre `control.html` en tu ordenador (el navegador donde vas a moderar)
   e inicia sesión con el usuario que creaste en el paso 1.
2. Verás un QR — proyéctalo o imprímelo para que el público lo escanee.
3. Abre `overlay.html` como fuente de navegador en OBS/Resolume/vMix.
4. Los mensajes del público aparecerán en **"📥 Mensajes del público"** en
   tu panel: revisa cada uno y pulsa **✅ Aprobar** (sale en pantalla) o
   **❌ Rechazar**.
5. Los controles de "Mensaje manual", "Reacciones" y "Foto directa" son
   solo para ti (el operador) y salen directos a pantalla, sin pasar por
   la bandeja de moderación.


## Varios eventos a la vez

Si algún día haces dos eventos en paralelo, usa un identificador distinto
en la URL de las 3 páginas, por ejemplo:

```
control.html?evento=concierto-julio
publico.html?evento=concierto-julio
overlay.html?evento=concierto-julio
```

Cada valor de `evento=` tiene su propia bandeja de moderación y su propio
overlay, totalmente aislados entre sí. Si no pones `?evento=...`, todas
las páginas usan por defecto `principal`.


## Sobre las fotos

Las fotos y avatares se guardan comprimidos directamente en Firestore (no
en Firebase Storage), para no tener que configurar nada más. Si algún día
tienes fotos muy grandes o muchísimo tráfico, se puede migrar a Firebase
Storage — avísame si llegas a ese punto.
