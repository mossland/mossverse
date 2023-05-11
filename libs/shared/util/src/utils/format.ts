import type { Dayjs } from "dayjs";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require("dayjs");

export const prettyPrint = (data: any): any => {
  if (Array.isArray(data)) return data.length ? data.reduce((acc, cur) => acc + ", " + prettyPrint(cur)) : "empty";
  else if (typeof data === "object") return JSON.stringify(data, null, 2);
  else return data;
};
export const pad = (data: string | number, totalLength: number, padChar = "0") => {
  return String(data).padStart(totalLength, padChar);
};
export const shorten = (data: string | number, totalLength = 8, padNum = 3, padChar = ".") => {
  const str = String(data);
  if (str.length <= totalLength) return String(data);
  return str.slice(0, totalLength - padNum) + padChar.repeat(padNum);
};
export const discordHashTagForm = (user: { username: string; discriminator: string }) => {
  if (!user) return "";
  return `@${user.username}#${user.discriminator}`;
};
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const lowerlize = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};
export const numberWithCommas = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const toIsoString = (date: Date, skipTime?: boolean) => {
  return skipTime ? new Date(date).toISOString().slice(0, 10) : new Date(date).toISOString();
};

export const decToHex = (num: number) => "0x" + num.toString(16);

export const isPhoneNumber = (phone?: string | null) => {
  if (!phone) return false;
  const comp = phone[0] === "0" ? phone.slice(1) : phone;
  const regExp1 = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
  const regExp2 = /^\(?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return (regExp1.test(comp) || regExp2.test(comp)) && phone.split("-").length === 3;
};
export const isEmail = (email?: string | null) => email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

export const formatPhone = (value: string) => {
  // const comp = value.length > 6 && value[0] === "0" ? value.slice(1) : value;
  // return value.length > 6 && value[0] === "0" ? value.slice(1) : value;
  if (!value) return "";
  if (value.length === 10) return value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  else if (value.length === 13) return value.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  else return value;
};

export const replaceStart = (str: string) => {
  return str.replace(str.substring(1, str.length), str.substring(1, str.length).replace(/./g, "*"));
};

export const Mil2Dayjs = (milisecond: number) => {
  return dayjs()
    .set("hour", Math.floor(milisecond / 3600000))
    .set("minute", Math.floor((milisecond % 3600000) / 60000))
    .set("second", Math.floor((milisecond % 60000) / 1000));
};
export const Dayjs2Mil = (dayjs: Dayjs) => {
  return dayjs.hour() * 3600000 + dayjs.minute() * 60000 + dayjs.second() * 1000;
};
