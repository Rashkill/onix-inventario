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
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      if (evt.target?.result) image.src = evt.target.result as string;
    };
    filereader.onerror = reject;
  });
