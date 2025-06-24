/**
 * rounds numbers in decimal ranges e.g roundTo(4.023,2) returns 4.02
 * @param {Number} n  - input number
 * @param {Number} digits - digits to allow
 * @param {Boolean} useFloor - whether to round | floor at the speicified number of digits
 */

export default (n, digits, useFloor = false) => {
  checkIsNan(n);
  n = parseFloat(n);
  checkIsNan(n);

  var negative = false;
  if (digits === undefined) {
    digits = 0;
  }
  if (n < 0) {
    negative = true;
    n = n * -1;
  }
  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = (Math[useFloor ? 'floor' : 'round'](n) / multiplicator).toFixed(digits);
  if (negative) {
    n = (n * -1).toFixed(digits);
  }

  checkIsNan(n);
  return parseFloat(n);
};

function checkIsNan(n) {
  if (isNaN(n)) {
    throw new Error('invalid number');
  }

  return false;
}
