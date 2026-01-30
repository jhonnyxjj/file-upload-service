export type CompressionLevel = 'low' | 'medium' | 'high'

const compressionSettings: Record<CompressionLevel, {
  quality: number
  maxDimension: number
}> = {
  low: { quality: 0.95, maxDimension: 4096 },
  medium: { quality: 0.85, maxDimension: 2048 },
  high: { quality: 0.75, maxDimension: 1920 },
}

export function compressImage(
  file: File,
  level: CompressionLevel = 'medium',
): Promise<File> {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file)
    const image = new Image()
    image.src = imageUrl

    image.onload = () => {
      URL.revokeObjectURL(imageUrl)

      const { quality, maxDimension } = compressionSettings[level]
      
      // Mantém aspect ratio
      let { width, height } = image
      
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const context = canvas.getContext('2d')
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

          resolve(compressedFile)
        },
        'image/webp',
        quality,
      )
    }

    image.onerror = reject
  })
}