import uuid from 'uuid/v4';

type propsType = {
  title: string;
  name: string;
  bio: string;
  facebook: string;
  linkedIn: string;
  twitter: string;
  instagram: string;
  website: string;
  profilePic: any;
  issuerId: string;
};

class Employee {
  _employeeId?: string;
  _props: {
    title: string;
    name: string;
    bio: string;
    facebook: string;
    linkedIn: string;
    twitter: string;
    instagram: string;
    website: string;
    profilePic: any;
    issuerId: string;
  };

  constructor(employeeId: string, props: propsType) {
    this._employeeId = employeeId;
    this._props = props;
  }

  employeeId() {
    return this._employeeId;
  }

  title() {
    return this._props.title;
  }

  name() {
    return this._props.name;
  }

  bio() {
    return this._props.bio;
  }

  facebook() {
    return this._props.facebook;
  }

  linkedIn() {
    return this._props.linkedIn;
  }

  twitter() {
    return this._props.twitter;
  }

  instagram() {
    return this._props.instagram;
  }

  website() {
    return this._props.website;
  }

  profilePic() {
    return this._props.profilePic;
  }

  issuerId() {
    return this._props.issuerId;
  }

  static create(employeeProps: any, employeeId?: string) {
    const entityId = employeeId ? employeeId : uuid();
    return new Employee(entityId, employeeProps);
  }
}

export default Employee;
