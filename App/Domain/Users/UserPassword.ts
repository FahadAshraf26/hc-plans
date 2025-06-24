import Guard from '../../Infrastructure/Utils/Guard';
import DomainException from '../Core/Exceptions/DomainException';
import bcrypt from 'bcrypt';

const { hash: generatePassword, compare: comparePassword } = bcrypt;

class UserPassword {
  static minLength = 8;
  static passwordCriteria = '^(?:(?:(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]))|(?:(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\]))|(?:(?=.*[0-9])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\]))|(?:(?=.*[0-9])(?=.*[a-z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\]))).{8,}$';

  private props: any;

  constructor(props: any) {
    this.props = props;
  }

  getValue() {
    return this.props._value;
  }

  isAlreadyHashed() {
    return this.props.hashed;
  }

  comparePassword(plainTextPassword) {
    if (this.isAlreadyHashed()) {
      return this.bcryptCompare(plainTextPassword, this.getValue());
    }

    return this.props.value === plainTextPassword;
  }

  async bcryptCompare(plainTextPassword, hashed) {
    return comparePassword(plainTextPassword, hashed);
  }

  async hashPassword(password) {
    return generatePassword(password, 11);
  }

  async getHashedValue() {
    return this.isAlreadyHashed()
      ? this.props.value
      : await this.hashPassword(this.props.value);
  }

  static createFromValue(props) {
    const propsResult = Guard.againstNullOrUndefined(props.value, 'password');

    if (!propsResult.succeeded) {
      throw new DomainException(propsResult.message);
    }

    if (!props.hashed) {
      const lengthGuard = Guard.againstAtLeast(this.minLength, props.value, 'password');
      const regexGuard = Guard.againstRegex(
        this.passwordCriteria,
        props.value,
        'Password',
      );

      const result = Guard.combine([lengthGuard, regexGuard]);
      if (!result.succeeded) {
        throw new DomainException(
          'password must be atleast 8 digits and include a Capital letter, a Number and a Special character',
        );
      }
    }

    return new UserPassword(props);
  }
}

export default UserPassword;
