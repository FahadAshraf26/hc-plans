import states from './states.json';

export const invert = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
};
const statesWithNameAndCode = invert(states);

export const getStateCodeByName = (name) => {
  return statesWithNameAndCode[name];
};

const searchStates = (name: string) => {
  if (typeof name !== 'string') {
    return null;
  }
  if (name === '') {
    return null;
  }
  const search = name.toLowerCase();
  const nameSearch = Object.keys(statesWithNameAndCode).filter((item) =>
    item.toLowerCase().match(search),
  );

  const codeSearch = Object.values(statesWithNameAndCode).filter((item: string) =>
    item.toLowerCase().match(search),
  );

  const extractCode = nameSearch.map((item) => {
    return getStateCodeByName(item);
  });

  if (codeSearch.length && nameSearch.length) {
    const results = [];
    codeSearch.map((item) => {
      results.push(item);
    });
    extractCode.map((item) => {
      results.push(item);
    });
    const newResults = [...new Set(results)];
    return newResults;
  } else if (codeSearch.length) {
    return codeSearch;
  } else if (nameSearch.length) {
    return extractCode;
  } else {
    return [];
  }
};

export default searchStates;
