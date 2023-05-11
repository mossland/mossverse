export const preloadImgs = (imgs: string[]) => imgs.forEach((img) => (new Image().src = img));
