/**
 * delima: ParseBoolean
 * Parse a string to boolean
 * @param {string} value
 * @returns {boolean}
 * @example
 * ParseBoolean('true') // true
 * ParseBoolean('false') // false
 * ParseBoolean('1') // true
 * ParseBoolean('0') // false
 * ParseBoolean('yes') // true
 * ParseBoolean('no') // false
 * ParseBoolean('on') // true
 * ParseBoolean('off') // false
 */
export default (value: any): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value > 0;
  }

  if (typeof value === 'string') {
    value = value.toLowerCase();
    switch (value) {
      case 'true':
      case 'yes':
      case 'on':
      case '1':
        return true;
      case 'false':
      case 'no':
      case 'off':
      case '0':
        return false;
      default:
        return false;
    }
  }

  return false;
};
