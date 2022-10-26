export const phone = (phone: string) => {
  return phone.split("-").length === 3;
};
export const email = (email: string) => {
  if (email.split("@").length !== 2) return false;
  else if (email.split(".").length === 1) return false;
  else return true;
};
export const ageLimit = (date: Date) => {
  return true;
  // const now = new Date();
  // const years = (now.getTime() - date.getTime()) / YEAR_IN_MILLISECONDS;
  // return years > AGE_LIMIT;
};
