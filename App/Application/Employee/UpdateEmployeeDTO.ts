type UpdateEmployeeDTOType = {
  issuerId?: string;
  employeeId?: string;
  title?: string;
  name?: string;
  bio?: string;
  facebook?: string;
  linkedIn?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
};

class UpdateEmployeeDTO {
  private issuerId?: string;
  private employeeId?: string;
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
    employeeId?: string,
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
      (this.employeeId = employeeId),
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

  getEmployeeId() {
    return this.employeeId;
  }

  setProfilePic(profilePic: {}) {
    this.profilePic = profilePic;
  }

  static create({
    issuerId,
    employeeId,
    title,
    name,
    bio,
    facebook,
    linkedIn,
    twitter,
    instagram,
    website,
  }: UpdateEmployeeDTOType) {
    return new UpdateEmployeeDTO(
      issuerId,
      employeeId,
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

export default UpdateEmployeeDTO;
