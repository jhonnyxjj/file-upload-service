
export type Resolution = '4k' | '1080p' | '720p'

type ResolutionValue = {
  width: number
  height: number
}

const resolutions: Record<Resolution, ResolutionValue> = {
  '4k': { width: 3840, height: 2160 },
  '1080p': { width: 1920, height: 1080 },
  '720p': { width: 1280, height: 720 },
}

export function compressImage(
  file: File,
  resolution: Resolution,
): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return Promise.resolve(file)
  }
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      URL.revokeObjectURL(imageUrl);

      const { width, height } = resolutions[resolution]
      console.log(`Applying resolution: ${resolution} (width: ${width}, height: ${height})`);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');

      if (!context) {
        return reject(new Error('Could not get canvas context'))
      }

      context.drawImage(image, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error('Could not create blob'))
          }

          const fileName = file.name.substring(0, file.name.lastIndexOf('.'))
          const compressedFile = new File([blob], `${fileName}.webp`, {
            type: 'image/webp',
          })

          resolve(compressedFile);
        },
        'image/webp',
        0.9,
      )
    }

    image.onerror = (error) => {
      URL.revokeObjectURL(imageUrl);
      reject(error);
    }
  })
}
