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


firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();



/* ⚠️ Lista de emails autorizados como operador/moderador.
   Tiene que coincidir EXACTAMENTE con la lista de firestore.rules
   (la función esOperador() de allí). Si añades o quitas un email,
   cámbialo en los dos sitios. */

const EMAILS_OPERADOR = [
  "orquestalaoxido@gmail.com"
];


function esCuentaDeOperador(usuario){

  return !!usuario && EMAILS_OPERADOR.includes(usuario.email);

}



/* El "evento" activo. Por defecto "principal", pero se puede
   usar la misma web para varios eventos con ?evento=NOMBRE
   en la URL (por ejemplo control.html?evento=concierto-julio) */

function obtenerEventoId(){

  const params = new URLSearchParams(window.location.search);

  return params.get("evento") || "principal";

}


const EVENTO_ID = obtenerEventoId();


function refMensajes(){

  return db.collection("eventos").doc(EVENTO_ID).collection("mensajes");

}


function refEnVivo(){

  return db.collection("eventos").doc(EVENTO_ID).collection("en_vivo").doc("actual");

}


/* Colección raíz de eventos (para el dashboard: listar/crear eventos) */

function refEventos(){

  return db.collection("eventos");

}


function refEvento(id){

  return db.collection("eventos").doc(id);

}
