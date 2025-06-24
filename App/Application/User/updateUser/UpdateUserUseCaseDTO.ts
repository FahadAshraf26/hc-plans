import Investor from '@domain/Core/Investor/Investor';
import Owner from '@domain/Core/Owner/Owner';
import ProfilePic from '@domain/Core/ProfilePic/ProfilePic';
import { RequestOrigin } from '../../../Domain/Core/ValueObjects/RequestOrigin';

class UpdateUserUseCaseDTO {
  private readonly userId: string;
  private readonly ip: string;
  private readonly payload: any;
  private readonly requestOrigin: string;

  constructor(userId: string, payload: any, ip: string, requestOrigin?: string) {
    this.ip = ip;
    this.userId = userId;
    this.payload = payload;
    this.requestOrigin = requestOrigin;
  }

  UserId() {
    return this.userId;
  }

  Ip() {
    return this.ip;
  }

  isAdminRequest() {
    return this.requestOrigin === RequestOrigin.ADMIN_PANEL;
  }

  Payload() {
    return this.payload;
  }

  setProfilePic(profilePicObj) {
    if (profilePicObj.profilePicId) {
      this.payload.profilePic = ProfilePic.createFromObject(profilePicObj);
      return;
    }
    const { name = 'Test', path, mimeType, userId, originalPath } = profilePicObj;
    this.payload.profilePic = ProfilePic.createFromDetail(
      name,
      path,
      mimeType,
      userId,
      originalPath,
    );
  }

  /**
   * Set Investor
   * @param investorObj
   */
  setInvestor(investorObj) {
    this.payload.investor = Investor.createFromObject(investorObj);

    if (
      investorObj.userProvidedCurrentInvestments &&
      !investorObj.userProvidedCurrentInvestmentsDate
    ) {
      this.payload.investor.setUserProvidedCurrentInvestmentsDate(new Date());
    }
  }

  /**
   * Set Owner
   * @param ownerObj
   */
  setOwner(ownerObj) {
    if (ownerObj.ownerId) {
      this.payload.owner = Owner.createFromObject(ownerObj);
    } else {
      const {
        title,
        subTitle,
        description,
        userId,
        primaryOwner,
        beneficialOwner,
        businessOwner,
      } = ownerObj;
      this.payload.owner = Owner.createFromDetail(
        userId,
        title,
        subTitle,
        description,
        primaryOwner,
        beneficialOwner,
        businessOwner,
      );
    }
  }
}

export default UpdateUserUseCaseDTO;
