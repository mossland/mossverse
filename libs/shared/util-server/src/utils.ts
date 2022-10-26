import { Logger } from "@nestjs/common";

import { Model, FilterQuery, Document } from "mongoose";
import * as crypto from "crypto-js";
import { ethers } from "ethers";

import { Utils } from "@shared/util";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Caver = require("caver-js");

export const raw = <T extends Document>(doc: T) => {
  const ret = doc.toJSON ? doc.toJSON() : { ...doc };
  delete ret.__v;
  delete ret.createdAt;
  delete ret.updatedAt;
  return ret;
};

interface BatchForm<Doc> {
  name: string;
  model: Model<Doc>;
  query: FilterQuery<Doc>;
  fn?: (docs: Doc[]) => Promise<unknown>;
  mapFn?: (doc: Doc) => Promise<unknown>;
  batchNum?: number;
}
export const batchProcess = async <Doc>({ name, model, query, fn, mapFn, batchNum = 100 }: BatchForm<Doc>) => {
  Logger.log(`${name} Batch Job Started`);
  const num = await model.countDocuments(query);
  for (let i = 0; i < num; i += batchNum) {
    Logger.log(`${name} Batch Job Processing... ${i}/${num}`);
    const docs = await model.find(query).skip(i).limit(batchNum);
    mapFn && (await Promise.all(docs.map(async (doc) => await mapFn(doc))));
    fn && (await fn(docs));
  }
  Logger.log(`${name} Page Job Completed ${num}/${num}`);
  return num;
};
interface PageForm<Output> {
  name: string;
  fn: (from: number, to: number) => Promise<Output[]>;
  from?: number;
  to: number;
  step: number;
}
export const pageProcess = async <Output>({ name, fn, from = 0, to, step }: PageForm<Output>): Promise<Output[]> => {
  Logger.log(`${name} Page Job Started`);
  const res: Output[] = [];
  for (let i = from; i < to; i += step) {
    Logger.log(`${name} Page Job Processing... ${i}/${to - from}`);
    const data = await fn(i, Math.min(i + step, to));
    res.push(...data);
  }
  Logger.log(`${name} Page Job Completed ${to - from}/${to - from}`);
  return res;
};
interface SliceForm<Output> {
  name: string;
  fn: (ids: any[], offset: number) => Promise<Output[]>;
  ids: any[];
  step: number;
}
export const sliceProcess = async <Output>({ name, fn, ids, step }: SliceForm<Output>): Promise<Output[]> => {
  Logger.log(`${name} Slice Job Started`);
  const res: Output[] = [];
  for (let i = 0; i < ids.length; i += step) {
    Logger.log(`${name} Slice Job Processing... ${i}/${ids.length}`);
    const data = await fn(ids.slice(i, i + step), i);
    res.concat(data);
  }
  Logger.log(`${name} Slice Job Completed ${ids.length}/${ids.length}`);
  return res;
};
interface QueueForm<Output> {
  name: string;
  fns: (() => Promise<Output>)[];
  step?: number;
}
// export const queueProcess = async <T>({ name, fns, step = 100 }: QueueForm<T>): Promise<T[]> => {
//   Logger.log(`${name} Slice Job Started`);
//   const queue = new PQueue({ concurrency: step });
//   const res = await queue.addAll(
//     fns.map((fn, idx) => async () => {
//       Logger.log(`${name} Slice Job Processing... ${idx}/${fns.length}`);
//       return await fn();
//     })
//   );
//   Logger.log(`${name} Slice Job Completed ${fns.length}/${fns.length}`);
//   return res;
// };
export const parseSignMessage = (message: string) => {
  const timeString = "timeStamp:";
  const startIdx = message.indexOf("[") + 1;
  const endIdx = message.indexOf("]");
  const timeIndex = message.indexOf(timeString) + timeString.length;
  const hash = message.slice(startIdx, endIdx);
  const timeStamp = parseInt(message.slice(timeIndex, message.length));
  return { hash, timeStamp };
};
interface Signature {
  signchain: string;
  signmessage: string;
  signaddress: string;
}
export const getAddrFromSig = async (
  { signchain, signmessage, signaddress }: Signature,
  aeskey: string
): Promise<string | null> => {
  try {
    const { hash, timeStamp } = parseSignMessage(signmessage);
    if (Utils.getMinuteDifference(timeStamp) > 10) return null;
    const address = crypto.AES.decrypt(hash, aeskey).toString(crypto.enc.Utf8).toLowerCase();
    const msgHash = ethers.utils.hashMessage(signmessage);
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    // const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, { v, r, s }).toLowerCase();
    let recoveredAddress;
    if (signchain === "kaikas") {
      // ! chain은 카이카스가 아님.
      const caver = new Caver();
      recoveredAddress = await caver.klay.accounts.recover(signmessage, signaddress).toLowerCase();
    } else {
      recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, signaddress).toLowerCase();
    }
    if (address !== recoveredAddress) return null;
    return address;
  } catch (err) {
    Logger.error(err);
    throw new Error(err as string);
  }
};
