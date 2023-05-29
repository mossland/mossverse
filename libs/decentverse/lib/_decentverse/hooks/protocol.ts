import { fetch } from "@decentverse/client";

export const encodeProtocolV1 = (
  mapId: string,
  id: string,
  p: fetch.PlayerRender,
  s: { min: [number, number]; max: [number, number] }
) => {
  const encodedPosition = convToScore(Math.floor(p.playerPosition[0]), Math.floor(p.playerPosition[1]));
  const min = convToScore(s.min[0], s.min[1]);
  const max = convToScore(s.max[0], s.max[1]);
  const encodedData = `${id}\t${Math.floor(p.playerPosition[0])}\t${Math.floor(p.playerPosition[1])}\t${
    p.playerVelocity[0]
  }\t${p.playerVelocity[1]}\t${p.playerSpriteState}\t${p.playerDirection}\t${p.playerChatText}\t${
    p.playerStatus ?? ""
  }\t${p.playerEmojiUrl ?? ""}`;
  return [mapId, id, encodedPosition, encodedData, min, max];
};
export const decodeProtocolV1 = (data: string): [string, fetch.PlayerRender] => {
  const message = data.split("\t");
  return [
    message[0],
    {
      playerPosition: [parseInt(message[1]), parseInt(message[2])],
      playerVelocity: [parseInt(message[3]), parseInt(message[4])],
      playerSpriteState: message[5] as "idle" | "walk",
      playerDirection: message[6] as "left" | "right" | "up" | "down",
      playerChatText: message[7],
      playerStatus: (message[8].length ? message[8] : null) as "talk" | null,
      playerEmojiUrl: message[9].length ? message[9] : null,
    },
  ];
};
const convToScore = (x: number, y: number, maxDigits = 16) => {
  const base = new Array(maxDigits).fill("0").join("");
  const [xbin, ybin] = [x.toString(2), y.toString(2)];
  const [xstr, ystr] = [base.substring(xbin.length) + xbin, base.substring(ybin.length) + ybin];
  return new Array(maxDigits)
    .fill(0)
    .map((_, idx) => xstr[idx] + ystr[idx])
    .join("");
};

export const makeCharacterMessage = (id: string, i: fetch.PlayerInit) => {
  return JSON.stringify({ id, ...i });
};
