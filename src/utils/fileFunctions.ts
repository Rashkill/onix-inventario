export const urlToFile = async (imageURL: string) => {
  const response = await fetch(imageURL);
  const blob = await response.blob();
  return new File([blob], "refile", { type: blob.type });
};

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = function (evt) {
      const image = new Image(); // create Image object
      image.crossOrigin = "Anonymous";
      image.onload = function () {
        const canvas = document.createElement("canvas"); //initialize canvas
        const context = canvas.getContext("2d");

        const ratio = Math.min(300 / image.height, 300 / image.width);

        canvas.width = image.width * ratio;
        canvas.height = image.height * ratio;

        context?.drawImage(image, 0, 0, canvas.width, canvas.height);
        if (context)
          resolve(cropImageFromCanvas(context).toDataURL("image/png"));
        else reject();
      };
      if (evt.target?.result) image.src = evt.target.result as string;
    };
    filereader.onerror = reject;
  });

function cropImageFromCanvas(ctx: CanvasRenderingContext2D) {
  const canvas = ctx.canvas,
    pix: { x: number[]; y: number[] } = { x: [], y: [] },
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let x: number,
    y: number,
    index: number,
    w = canvas.width,
    h = canvas.height;

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index + 3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      }
    }
  }
  pix.x.sort(function (a, b) {
    return a - b;
  });
  pix.y.sort(function (a, b) {
    return a - b;
  });
  const n = pix.x.length - 1;

  w = 1 + pix.x[n] - pix.x[0];
  h = 1 + pix.y[n] - pix.y[0];
  const cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

  canvas.width = w;
  canvas.height = h;
  ctx.putImageData(cut, 0, 0);

  return canvas;
}
