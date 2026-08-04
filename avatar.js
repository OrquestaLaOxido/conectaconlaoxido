/* ==================================
   AVATAR - foto real (Google) o inicial+color automático
   (compartido entre control.html, overlay.html e index.html)
   ================================== */


const PALETA_AVATAR =
["#F97316","#FBBF24","#B33A2E","#EA580C","#8F2C22","#D97706"];



function colorParaTexto(texto){

  let t = (texto || "?").trim();

  let suma = 0;

  for(let i=0; i<t.length; i++){

    suma += t.charCodeAt(i);

  }

  return PALETA_AVATAR[suma % PALETA_AVATAR.length];

}



function inicialParaTexto(texto){

  let t = (texto || "").trim();

  t = t.replace(/^@/, "");

  if(!t) return "?";

  return t.charAt(0).toUpperCase();

}



/* Devuelve el HTML de un avatar: <img> si hay foto real,
   o un círculo con inicial+color si no la hay.
   claseImg / claseCirculo controlan tamaño según dónde se use. */

function avatarHTML(fotoUrl, textoBase, claseImg, claseCirculo){

  if(fotoUrl){

    return `<img class="${claseImg}" src="${fotoUrl}">`;

  }

  let color = colorParaTexto(textoBase);

  let inicial = escapeHTML(inicialParaTexto(textoBase));

  return `<div class="${claseCirculo}" style="background:${color}">${inicial}</div>`;

}
