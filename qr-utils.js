/* ==================================
   UTILIDADES DE QR
   (compartidas entre control.html y dashboard.html)
   ================================== */


function generarSlug(texto){

  return normalizarTexto(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    || "evento";

}



/* Dibuja el título (y el subtítulo, si lo hay) encima del QR
   en un canvas nuevo, y descarga el resultado como PNG. */

function dibujarYDescargarQR(canvasQR, titulo, subtitulo){

  let margen = 30;

  let franjaTitulo = subtitulo ? 95 : 60;


  let canvasFinal = document.createElement("canvas");

  canvasFinal.width = canvasQR.width + margen * 2;

  canvasFinal.height = canvasQR.height + margen * 2 + franjaTitulo;


  let ctx = canvasFinal.getContext("2d");


  ctx.fillStyle = "#ffffff";

  ctx.fillRect(0, 0, canvasFinal.width, canvasFinal.height);


  ctx.fillStyle = "#0A0A0A";

  ctx.textAlign = "center";

  ctx.textBaseline = "middle";


  ctx.font = "bold 26px Arial";

  ctx.fillText(

    titulo,

    canvasFinal.width / 2,

    subtitulo ? margen + 28 : margen + franjaTitulo / 2,

    canvasFinal.width - margen

  );


  if(subtitulo){

    ctx.font = "18px Arial";

    ctx.fillStyle = "#555555";

    ctx.fillText(

      subtitulo,

      canvasFinal.width / 2,

      margen + 66,

      canvasFinal.width - margen

    );

  }


  ctx.drawImage(canvasQR, margen, franjaTitulo + margen);


  let enlace = document.createElement("a");

  enlace.download = "qr-" + generarSlug(titulo) + ".png";

  enlace.href = canvasFinal.toDataURL("image/png");

  enlace.click();

}
