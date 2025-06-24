export const toCents = (aValue) => {
  return Math.round((Math.abs(aValue) / 100) * 10000);
};
