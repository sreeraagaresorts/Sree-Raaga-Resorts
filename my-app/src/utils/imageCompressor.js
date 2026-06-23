/**
 * Compresses an image file on the frontend using HTML5 Canvas.
 * Returns a Promise that resolves to the compressed File object.
 * 
 * @param {File} file The original image file
 * @param {number} maxWidth The maximum allowed width (default: 1920)
 * @param {number} maxHeight The maximum allowed height (default: 1080)
 * @param {number} quality Compression quality from 0.0 to 1.0 (default: 0.8)
 * @returns {Promise<File>}
 */
export const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve) => {
    // Return original file if it's not a valid image
    if (!file || !file.type || !file.type.startsWith("image/")) {
      return resolve(file);
    }

    // Skip compression if the image is already small (< 250KB)
    if (file.size < 250 * 1024) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Keep aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // fallback
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // fallback
      };
    };

    reader.onerror = () => {
      resolve(file); // fallback
    };
  });
};
