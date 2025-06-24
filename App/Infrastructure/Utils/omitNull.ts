export default (obj) => {
  Object.keys(obj)
    .filter((k) => obj[k] === null)
    .forEach((k) => delete obj[k]);
  return obj;
};
