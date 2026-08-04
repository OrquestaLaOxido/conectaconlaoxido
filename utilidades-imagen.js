/* ==================================
   REDIMENSIONAR IMÁGENES
   Firestore limita cada documento a 1MB, así que
   comprimimos las fotos antes de guardarlas.
   ================================== */


function redimensionarImagen(archivo, maxAncho, calidad){

  return new Promise((resolve, reject)=>{

    if(!archivo){

      resolve(null);

      return;

    }

    let lector = new FileReader();

    lector.onload = () => {

      let img = new Image();

      img.onload = () => {

        let ratio = Math.min(1, maxAncho / img.width);

        let canvas = document.createElement("canvas");

        canvas.width = img.width * ratio;

        canvas.height = img.height * ratio;

        let ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", calidad));

      };

      img.onerror = reject;

      img.src = lector.result;

    };

    lector.onerror = reject;

    lector.readAsDataURL(archivo);

  });

}
