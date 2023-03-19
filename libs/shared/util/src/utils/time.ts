export const msToSec = (millisec: number) => {
  return Math.floor(millisec / 1000);
};

export const secToMillisec = (sec: number) => {
  return Math.floor(sec * 1000);
};

export const toUnixTime = (date: Date) => Math.floor(date.getTime() / 1000);
export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(() => resolve, ms));
};
export const sleepSync = (ms: number) => {
  const date = Date.now();
  let currentDate;
  do {
    currentDate = Date.now();
  } while (currentDate - date < ms);
};

export const getTomorrow = (date = new Date()) => {
  const tomorrow = new Date(date);
  tomorrow.setHours(tomorrow.getHours() + 24);
  return tomorrow;
};
export const getYesterday = (date = new Date()) => {
  const yesterday = new Date(date);
  yesterday.setHours(yesterday.getHours() - 24);
  return yesterday;
};
export const getMinuteDifference = (timestamp: number, base = new Date()) => {
  const today = new Date(base).getTime();
  return Math.floor((today - timestamp) / 1000 / 60);
};

export const getLastSeconds = (seconds = 1, timestamp = new Date()) => {
  const date = new Date(timestamp);
  date.setSeconds(date.getSeconds() - seconds);
  return date;
};

export const getLastMinutes = (minutes = 1, timestamp = new Date()) => {
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - minutes);
  return date;
};

export const getNextMinutes = (minutes = 1, timestamp = new Date()) => {
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

export const getLastHour = (hours = 1, timestamp = new Date()) => {
  const date = new Date(timestamp);
  date.setHours(date.getHours() - hours);
  return date;
};
export const getLastDays = (days = 1, timestamp = new Date()) => {
  const date = new Date(timestamp);
  date.setDate(date.getDate() - days);
  return date;
};
export const getLastMonths = (months = 1, timestamp = new Date()) => {
  const date = new Date(timestamp);
  date.setMonth(date.getMonth() - months);
  return date;
};
export const getLastWeeks = (weeks = 1, timestamp = new Date()) => {
  const date = new Date(timestamp);
  date.setDate(date.getDate() - 7 * weeks);
  return date;
};
export const getNextYears = (years = 1, timestamp = new Date()) => {
  const date = new Date(timestamp);
  date.setFullYear(date.getFullYear() + years);
  return date;
};
export const getNextDays = (days = 1, timestamp = new Date()) => {
  const date = new Date(timestamp);
  date.setDate(date.getDate() + days);
  return date;
};
export const getPeriodicType = (now = new Date()): ["monthly" | "weekly" | "daily" | "hourly", Date] => {
  now.setMinutes(0, 0, 0);
  const [hour, weekDay, date] = [now.getHours(), now.getDay(), now.getDate()];
  const type =
    date === 1 && hour === 0 ? "monthly" : weekDay === 0 && hour === 0 ? "weekly" : hour === 0 ? "daily" : "hourly";
  return [type, now];
};
// export const IsPeriodToday = (startAt:Date,EndAt:Date) => {}
