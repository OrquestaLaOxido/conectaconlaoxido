/* ==================================
   CONFIGURACIÓN FIREBASE - LA ÓXIDO
   ================================== */


const firebaseConfig = {
  apiKey: "AIzaSyCSZ3Cwzc5AQiZeXla7h4nq-j3rP8PFNfU",
  authDomain: "oxido-eventos.firebaseapp.com",
  projectId: "oxido-eventos",
  storageBucket: "oxido-eventos.firebasestorage.app",
  messagingSenderId: "790722206371",
  appId: "1:790722206371:web:31be06d4898537092e3d16"
};



/* ⚠️ IMPORTANTE: usamos DOS apps de Firebase independientes en vez de
   una sola, aunque apunten al mismo proyecto.

   Motivo: Firebase Auth comparte la sesión entre TODAS las pestañas
   del mismo navegador que usen la misma app. Si el público inicia
   sesión con Google en index.html mientras el operador tiene
   control.html o dashboard.html abiertos en otra pestaña, esa pestaña
   detecta "esta cuenta no es el operador" y cierra la sesión — y como
   antes compartían la misma app, eso desloguéaba también al público.

   Con dos apps separadas, cada una tiene su propia sesión aislada:
   - "publico"  → la usan index.html (y de lectura, overlay.html)
   - "operador" → la usan control.html y dashboard.html

   Así una nunca puede cerrarle la sesión a la otra. */


const appPublico = firebase.initializeApp(firebaseConfig, "publico");

const db = appPublico.firestore();

// auth() solo existe si la página cargó firebase-auth-compat.js (control.html,
// dashboard.html e index.html lo hacen; overlay.html no lo necesita). Si falta,
// que no rompa el resto del archivo (Firestore debe seguir funcionando igual).
let auth = null;

try{ auth = appPublico.auth(); }catch(e){ /* esta página no cargó el SDK de auth */ }


const appOperador = firebase.initializeApp(firebaseConfig, "operador");

const dbOperador = appOperador.firestore();

let authOperador = null;

try{ authOperador = appOperador.auth(); }catch(e){ /* esta página no cargó el SDK de auth */ }



/* Comprueba si la cuenta logueada es la del operador, mediante un
   "custom claim" de Firebase (una etiqueta invisible del tipo
   moderador:true asociada a esa cuenta en el servidor). A diferencia
   de comparar el email, esto no expone NINGÚN dato identificable en
   el código — nadie puede ver en el navegador quién es el operador.

   El claim hay que asignarlo una vez desde fuera del navegador
   (ver INSTRUCCIONES.md). Como los claims solo se leen al iniciar
   sesión (o al refrescar el token a la fuerza), esta función es
   asíncrona. */

async function esCuentaDeOperador(usuario){

  if(!usuario) return false;

  // El "true" fuerza a pedir el permiso actualizado al servidor,
  // en vez de fiarse de una copia guardada en el navegador.
  let resultado = await usuario.getIdTokenResult(true);

  return resultado.claims.moderador === true;

}



/* El "evento" activo. Por defecto "principal", pero se puede
   usar la misma web para varios eventos con ?evento=NOMBRE
   en la URL (por ejemplo control.html?evento=concierto-julio) */

function obtenerEventoId(){

  const params = new URLSearchParams(window.location.search);

  return params.get("evento") || "principal";

}


const EVENTO_ID = obtenerEventoId();


/* Versión de la app — se muestra junto al copyright en index.html,
   control.html y dashboard.html. Súbela en cada actualización
   (1.2.1, 1.2.2...) salvo que se indique lo contrario. */

const VERSION_APP = "1.2.16";



/* Estas 4 funciones aceptan opcionalmente qué base de datos usar
   (db normal, o dbOperador). Si no se indica, usan "db" (la pública) —
   así index.html y overlay.html no tienen que cambiar nada.
   control.html y dashboard.html SIEMPRE deben pasar dbOperador. */


function refMensajes(baseDeDatos, eventoId){

  return (baseDeDatos || db).collection("eventos").doc(eventoId || EVENTO_ID).collection("mensajes");

}


function refEnVivo(baseDeDatos, eventoId){

  return (baseDeDatos || db).collection("eventos").doc(eventoId || EVENTO_ID).collection("en_vivo").doc("actual");

}


/* La colección "en_vivo" completa (no solo el doc "actual") — hace
   falta para poder borrarla entera al eliminar un evento. */

function refEnVivoColeccion(baseDeDatos, eventoId){

  return (baseDeDatos || db).collection("eventos").doc(eventoId || EVENTO_ID).collection("en_vivo");

}


/* Colección raíz de eventos (para el dashboard: listar/crear eventos) */

function refEventos(baseDeDatos){

  return (baseDeDatos || db).collection("eventos");

}


function refEvento(id, baseDeDatos){

  return (baseDeDatos || db).collection("eventos").doc(id);

}


/* Ajustes visuales del overlay (estilo, fondo, fuente). Se guardan en
   Firestore (no en localStorage) porque el overlay puede estar
   corriendo en OTRO ordenador distinto al del panel de control
   (por ejemplo, dentro de un Browser Source de OBS) — localStorage
   no viajaría entre ellos, Firestore sí. */

function refEstilo(eventoId, baseDeDatos){

  return (baseDeDatos || db).collection("eventos").doc(eventoId || EVENTO_ID).collection("en_vivo").doc("estilo");

}


/* Participantes del público que han escrito al menos un mensaje en
   este evento — para la lista de silenciar/banear en control.html. */

function refParticipantes(baseDeDatos, eventoId){

  return (baseDeDatos || db).collection("eventos").doc(eventoId || EVENTO_ID).collection("participantes");

}


function refParticipante(uid, baseDeDatos, eventoId){

  return refParticipantes(baseDeDatos, eventoId).doc(uid);

}
