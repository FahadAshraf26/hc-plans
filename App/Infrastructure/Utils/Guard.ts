class Guard {
  static combine(guardResults) {
    for (let result of guardResults) {
      if (result.succeeded === false) return result;
    }

    return { succeeded: true };
  }

  static againstNullOrUndefined(argument, argumentName) {
    if (argument === null || argument === undefined) {
      return {
        succeeded: false,
        message: `${argumentName} is null or undefined`,
      };
    }

    return {
      succeeded: true,
    };
  }

  static againstNullOrUndefinedBulk(args) {
    for (let arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
      if (!result.succeeded) return result;
    }

    return { succeeded: true };
  }

  static greaterThan(minValue, actualValue) {
    return actualValue > minValue
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `Number given {${actualValue} is not greater than minValue`,
        };
  }

  static againstAtLeast(numChars, text, argumentName = 'Text') {
    return text.length >= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `${argumentName} is not at least ${numChars} chars.`,
        };
  }

  static againstAtMost(numChars, text) {
    return text.length <= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `Text is greater than ${numChars} chars.`,
        };
  }

  static isOneOf(value, validValues, argumentName) {
    if (!validValues.includes(value)) {
      return {
        succeeded: false,
        message: `${argumentName} is not oneOf correct types in ${JSON.stringify(
          validValues,
        )}. Got ${value}`,
      };
    }

    return { succeeded: true };
  }
  static againstCondition(fn, message) {
    if (!fn()) {
      return { succeeded: false, message };
    }

    return { succeeded: true };
  }

  static againstConditionBulk(args) {
    for (const arg of args) {
      const result = this.againstCondition(arg.fn, arg.message);
      if (!result) return result;
    }

    return { succeeded: true };
  }

  static againstRegex(regex, argument, argumentName, message = '') {
    if (new RegExp(regex).test(argument)) {
      return { succeeded: true };
    }

    return {
      succeeded: false,
      message: !message ? `invalid ${argumentName}` : `${argumentName} ${message}`,
    };
  }
}

export default Guard;
