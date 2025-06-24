// removes undefined props from an object
export default (obj) => {
  Object.keys(obj).forEach(
    (key) =>
      (obj[key] === undefined ||
        (typeof obj[key] === 'object' &&
          !(obj[key] instanceof Date) &&
          Object.keys(obj[key]).length === 0 &&
          Object.getOwnPropertySymbols(obj[key]).length === 0)) &&
      delete obj[key],
  );
  Object.getOwnPropertySymbols(obj).forEach(
    (key) =>
      (obj[key] === undefined ||
        (typeof obj[key] === 'object' &&
          Object.keys(obj[key]).length === 0 &&
          Object.getOwnPropertySymbols(obj[key]).length === 0)) &&
      delete obj[key],
  );
  return obj;
};
