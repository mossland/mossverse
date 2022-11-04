import { useEffect, useRef } from "react";
import { RepeatWrapping } from "three";

export function tiledToR3FTextureTranspiler(tilePosition: number[], tilesAmountX: number, tilesAmountY: number) {
  return {
    offset: {
      x: tilePosition[1] / tilesAmountX - 0.01, //temp
      y: (tilesAmountY - tilePosition[0] - 1) / tilesAmountY,
    },
  };
}

export function createTileTextureAnimator(texture: THREE.Texture, tileSize: number[], startValue = 0) {
  texture.wrapS = texture.wrapT = RepeatWrapping;
  // image width and height size (e.g 512px) / tile width and height size (e.g. 32px)
  const tilesAmountX = texture.image.width / tileSize[0];
  const tilesAmountY = texture.image.height / tileSize[1];
  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionX = Math.floor(startValue % tilesAmountX);
  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionY = -1 + tilesAmountY - Math.floor(startValue / tilesAmountX);
  texture.repeat.set(1 / tilesAmountX, 1 / tilesAmountY);
  texture.offset.x = texturePositionX / tilesAmountX;
  texture.offset.y = texturePositionY / tilesAmountY;
  return (tilePosition: number[]) => {
    const { offset } = tiledToR3FTextureTranspiler(tilePosition, tilesAmountX, tilesAmountY);
    texture.offset.x = offset.x;
    texture.offset.y = offset.y;
  };
}
