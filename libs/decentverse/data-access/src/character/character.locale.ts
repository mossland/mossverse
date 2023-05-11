import { Character, CharacterSummary } from "./character.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const characterLocale = {
  ...baseLocale,

  description: ["Description", "설명"],
  creator: ["Creator", "제작자"],
  thing: ["Thing", "Thing"],
  name: ["Name", "이름"],
  file: ["File", "파일"],
  tileSize: ["Tile Size", "타일 크기"],
  totalSize: ["Total Size", "전체 크기"],
  size: ["Size", "크기"],
  right: ["Right", "오른쪽"],
  left: ["Left", "왼쪽"],
  up: ["Up", "위"],
  down: ["Down", "아래"],
  totalCharacter: ["Total Character", "총 캐릭터"],
} as const;

export type CharacterLocale = Locale<"character", Character & CharacterSummary, typeof characterLocale>;
