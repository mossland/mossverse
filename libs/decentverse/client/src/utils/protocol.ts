import { cnst } from "@shared/util";
import { types } from "../stores";
export type PlayerProtocol = {
  id: string;
  position: number[];
  velocity: number[];
  state: types.PlayerState;
  direction: types.Direction;
  type: cnst.UserRole;
  chatText: string;
  isTalk: boolean;
  emoji: string;
  effect: types.EffectType;
};
export type Scope = {
  min: number[];
  max: number[];
};
export const encodeProtocolV1 = (p: PlayerProtocol, s: Scope) => {
  const encodedPosition = convToScore(Math.floor(p.position[0]), Math.floor(p.position[1]));
  const min = convToScore(s.min[0], s.min[1]);
  const max = convToScore(s.max[0], s.max[1]);
  const encodedData = `${p.id}\t${Math.floor(p.position[0])}\t${Math.floor(p.position[1])}\t${p.velocity[0]}\t${
    p.velocity[1]
  }\t${p.state}\t${p.direction}\t${p.chatText}\t${p.type}\t${p.isTalk}\t${p.emoji}\t${p.effect}`;
  return [p.id, encodedPosition, encodedData, min, max];
};
export const decodeProtocolV1 = (data: string): PlayerProtocol => {
  const message = data.split("\t");
  return {
    id: message[0],
    position: [parseInt(message[1]), parseInt(message[2])],
    velocity: [parseInt(message[3]), parseInt(message[4])],
    state: message[5] as types.PlayerState,
    direction: message[6] as types.Direction,
    chatText: message[7],
    type: message[8] as cnst.UserRole,
    isTalk: message[9] === "true",
    emoji: message[10],
    effect: message[11] as types.EffectType,
  };
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

const binAscs = new Array(30).fill(1).map((_, idx) => 2 ** idx);
const binDescs = new Array(...binAscs).reverse();
export const makeScope = (scope: types.WorldScope): types.WorldScope => {
  const target = [Math.min(...scope.min), Math.max(...scope.max)];
  const [min, max] = [binDescs.find((bin) => bin <= target[0]) ?? 0, binAscs.find((bin) => bin >= target[1]) ?? 2 ^ 30];
  return { min: [min, min], max: [max, max] };
  // return { min: [45000, 45000], max: [50000, 50000] };
};

export const makeCharacterMessage = (user: types.User, character: types.Character) => {
  return JSON.stringify({ user, character });
};
