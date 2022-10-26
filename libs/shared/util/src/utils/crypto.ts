export const centerEllipsis = (text: string) => {
  return `${text.slice(0, 6)}...${text.slice(-6)}`;
};

export const etherToWei = (number: number) => {
  return (number * Math.pow(10, 18)).toString();
};

export const weiToEther = (amount: string) => {
  return Math.floor(parseInt(amount) / Math.pow(10, 18));
};
