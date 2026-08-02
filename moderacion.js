/* ==================================
   MODERACIÓN - FILTRO DE PALABRAS
   (compartido entre control.html y publico.html)
   ================================== */


const PALABRAS_POR_DEFECTO =
["mierda","joder","gilipollas","cabron","cabrón","puta","puto","zorra","imbecil","imbécil","idiota","subnormal"];



function cargarPalabrasProhibidas(){

  let guardadas = localStorage.getItem("oxido_palabras_prohibidas");

  if(guardadas){

    return JSON.parse(guardadas);

  }

  return PALABRAS_POR_DEFECTO;

}



function guardarPalabrasProhibidas(lista){

  localStorage.setItem(
    "oxido_palabras_prohibidas",
    JSON.stringify(lista)
  );

}



function normalizarTexto(txt){

  return (txt||"")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"");

}



/* Devuelve la palabra prohibida encontrada, o null si no hay ninguna */

function detectarPalabraProhibida(texto, lista){

  let normalizado = normalizarTexto(texto);

  let palabras = normalizado.split(/[^a-z0-9ñ]+/i).filter(Boolean);

  for(let prohibida of lista){

    let p = normalizarTexto(prohibida);

    if(!p) continue;

    if(palabras.includes(p)){

      return prohibida;

    }

  }

  return null;

}



function escapeHTML(str){

  let div = document.createElement("div");

  div.textContent = str || "";

  return div.innerHTML;

}
