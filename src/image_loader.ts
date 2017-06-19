export class ImageFrame {
    constructor(
        public readonly source: string,
        public readonly canvas: HTMLCanvasElement,
        public readonly width: number,
        public readonly height: number
    ) {
    }
}

/**
 * Handle IE not supporting new ImageData()
 */
const createImageData = (() => {
    try {
        new ImageData(1, 1);
        return (width: number, height: number) => new ImageData(width, height);
    } catch (e) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        return (width: number, height: number) => ctx.createImageData(width, height);
    }
})();

export const loadImage = (url: string, coors: boolean = false): Promise<ImageFrame> =>
    new Promise((resolve, reject) => {
        const img = new Image()
        if (coors) {
            img.crossOrigin = ''
        }
        img.addEventListener('load', () => {
            const width = img.naturalWidth
            const height = img.naturalHeight
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            resolve(new ImageFrame(url, canvas, width, height))
        }, false)
        img.src = url
    })