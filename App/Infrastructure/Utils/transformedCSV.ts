export const transformedCSV = (data) => {
  const rows = data.split('\n');
  let transformedObject = {};
  rows.forEach((row) => {
    let [key, ...rest] = row.split(',');
    let value = '';
    rest.forEach((item, index) => {
      if (index !== rest.length - 1) {
        value = `${value}${value ? ',' : ''}${item}`;
      }
    });
    if (value.startsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    if (key === 'Owners') {
      value = value.replace(/""/g, '"');
      value = JSON.parse(value);
    }
    transformedObject[key] = value;
  });
  return transformedObject;
};
