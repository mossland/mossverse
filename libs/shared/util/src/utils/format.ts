export const prettyPrint = <T>(object: T) => {
  return JSON.stringify(object);
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
