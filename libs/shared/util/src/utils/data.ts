import { uniqueNamesGenerator, Config, adjectives, colors, animals } from "unique-names-generator";
import { pad } from "./format";
export const getRandomNickname = () =>
  uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: " ", style: "capital" });
export const randomCode = (length = 6) => pad(Math.floor(Math.random() * 10 ** length), 6);
export const randomString = (length = 12) =>
  [
    ...new Array(Math.floor(length / 12)).fill(0).map(() => (Math.random() + 1).toString(36).slice(2, 14)),
    (Math.random() + 1).toString(36).slice(2, 2 + (length % 12)),
  ].join("");
export const randomPick = <T = any>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const randomPicks = <T = any>(arr: T[], count = 1, allowDuplicate?: boolean): T[] => {
  if (!allowDuplicate && arr.length <= count) return arr;
  const idxs: number[] = [];
  let pickIdx;
  for (let i = 0; i < count; i++) {
    do {
      pickIdx = Math.floor(Math.random() * arr.length);
    } while (!allowDuplicate && idxs.includes(pickIdx));
    idxs.push(pickIdx);
  }
  return idxs.map((idx) => arr[idx]);
};
export const weightedPick = <T = unknown>(arr: T[], weights: number[], tWeight?: number) => {
  if (arr.length !== weights.length) throw new Error("Array and Weight Length should be equal");
  const totalWeight = tWeight ?? weights.reduce((acc, w) => acc + w, 0);
  let sample = Math.random() * totalWeight;
  const idx = weights.findIndex((w) => (sample -= w) < 0);
  return arr[idx];
};

export const randomNumber = (range: number = 100) => Math.floor(Math.random() * range);

export const shuffle = <T>(arr: T[]): T[] => arr.sort(() => 0.5 - Math.random());
export const trueShuffle = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};
export const groupByFields = <TElement extends { [key: string]: string | number }>(
  arr: TElement[],
  fieldName: string
): { [key: string]: TElement[] } => {
  const group: { [key: string]: TElement[] } = {};
  arr.map((data: TElement) => {
    data[fieldName] &&
      (group[data[fieldName]] ??
        (() => {
          group[data[fieldName]] = [];
        })());
    group[data[fieldName]].push(data);
  });
  return group;
};

export const update = <K extends string | number | symbol, V>(key: K, value: V, obj = {}): { [key in K]: V } => {
  const update = (obj ?? {}) as { [key in K]: V };
  update[key] = value;
  return update;
};

export const isIn = (
  { x, y }: { x: number; y: number },
  { center, wh }: { center: [number, number]; wh: [number, number] }
) => {
  return center[0] + wh[0] > x && x > center[0] - wh[0] && center[1] + wh[1] > y && y > center[1] - wh[1];
};

export const isInside = (
  [x, y]: [number, number],
  { center, wh }: { center: [number, number]; wh: [number, number] }
) => {
  return (
    center[0] + wh[0] / 2 > x && x > center[0] - wh[0] / 2 && center[1] + wh[1] / 2 > y && y > center[1] - wh[1] / 2
  );
};

export const getBox = (
  edge: { x: number; y: number },
  point: [number, number]
): { center: [number, number]; wh: [number, number] } => {
  const wh: [number, number] = [
    Math.abs(Math.floor(edge.x - point[0])) + 4,
    Math.abs(Math.floor(edge.y - point[1])) + 4,
  ];
  const center: [number, number] = [Math.floor((edge.x + point[0]) / 2), Math.floor((edge.y + point[1]) / 2)];
  return { center, wh };
};

export const moveCenter = (...points: [number, number][]): [number, number] => {
  return points.reduce((acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]]);
};

export const objectify = (obj: any, keys = Object.keys(obj)) => {
  const val: any = {};
  keys.forEach((key) => {
    if (typeof obj[key] !== "function") val[key] = obj[key];
  });
  return val;
};

export const objPath = <T>(o: T, p: string) => p.split(".").reduce((a: any, v: string) => a && a[v], o);
export const set = (obj: any, path: any, value: any) => {
  if (Object(obj) !== obj) return obj;
  if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || [];
  path
    .slice(0, -1)
    .reduce(
      (a: any, c: any, i: any) =>
        Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}),
      obj
    )[path[path.length - 1]] = value;
  return obj;
};
