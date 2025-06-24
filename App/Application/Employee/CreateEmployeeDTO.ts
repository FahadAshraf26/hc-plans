import Employee from '../../Domain/Core/Employee/Employee';

type createEmployeeType = {
  issuerId?: string;
  title?: string;
  name?: string;
  bio?: string;
  facebook?: string;
  linkedIn?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
};
class CreateEmployeeDTO {
  private issuerId?: string;
  private title?: string;
  private name?: string;
  private bio?: string;
  private facebook?: string;
  private linkedIn?: string;
  private twitter?: string;
  private instagram?: string;
  private website?: string;
  private profilePic?: {};

  constructor(
    issuerId?: string,
    title?: string,
    name?: string,
    bio?: string,
    facebook?: string,
    linkedIn?: string,
    twitter?: string,
    instagram?: string,
    website?: string,
  ) {
    (this.issuerId = issuerId),
      (this.title = title),
      (this.name = name),
      (this.bio = bio),
      (this.facebook = facebook),
      (this.linkedIn = linkedIn),
      (this.twitter = twitter),
      (this.instagram = instagram),
      (this.website = website);
  }

  getIssuerId() {
    return this.issuerId;
  }

  setProfilePic(profilePic) {
    this.profilePic = profilePic;
  }

  getEmployee() {
    const {
      title,
      name,
      bio,
      facebook,
      linkedIn,
      twitter,
      instagram,
      website,
      issuerId,
      profilePic,
    } = this;

    return Employee.create({
      title,
      name,
      bio,
      facebook,
      linkedIn,
      twitter,
      instagram,
      website,
      issuerId,
      profilePic,
    });
  }

  static create({
    issuerId,
    title,
    name,
    bio,
    facebook,
    linkedIn,
    twitter,
    instagram,
    website,
  }: createEmployeeType) {
    return new CreateEmployeeDTO(
      issuerId,
      title,
      name,
      bio,
      facebook,
      linkedIn,
      twitter,
      instagram,
      website,
    );
  }
}

export default CreateEmployeeDTO;
