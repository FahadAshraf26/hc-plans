import Employee from './Employee';

type EmployeeDomainType = {
  employeeId: string;
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

type EmployeeEntityType = {
  employeeId: () => string;
  title: () => string;
  name: () => string;
  bio: () => string;
  facebook: () => string;
  linkedIn: () => string;
  twitter: () => string;
  instagram: () => string;
  website: () => string;
  profilePic: () => any;
  issuerId: () => string;
};

class EmployeeMap {
  static toDomain(employeeObj: EmployeeDomainType) {
    const employeeEntity = Employee.create({ ...employeeObj }, employeeObj.employeeId);

    return employeeEntity;
  }

  static toPersistence(employeeEntity: EmployeeEntityType) {
    return {
      employeeId: employeeEntity.employeeId(),
      title: employeeEntity.title(),
      name: employeeEntity.name(),
      bio: employeeEntity.bio(),
      facebook: employeeEntity.facebook(),
      linkedIn: employeeEntity.linkedIn(),
      twitter: employeeEntity.twitter(),
      instagram: employeeEntity.instagram(),
      website: employeeEntity.website(),
      profilePic: employeeEntity.profilePic(),
      issuerId: employeeEntity.issuerId(),
    };
  }

  static toDTO(employeeEntity: EmployeeEntityType) {
    return {
      employeeId: employeeEntity.employeeId(),
      title: employeeEntity.title(),
      name: employeeEntity.name(),
      bio: employeeEntity.bio(),
      facebook: employeeEntity.facebook(),
      linkedIn: employeeEntity.linkedIn(),
      twitter: employeeEntity.twitter(),
      instagram: employeeEntity.instagram(),
      website: employeeEntity.website(),
      profilePic: employeeEntity.profilePic(),
      issuerId: employeeEntity.issuerId(),
    };
  }
}

export default EmployeeMap;
