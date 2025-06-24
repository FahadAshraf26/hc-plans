import {
  IInvestorMeetsCriteria,
  IInvestorMeetsCriteriaId,
} from '@application/CampaignFund/createCampaignFund/Utils/IInvestorMeetsCriteria';
import { IUserService } from '@application/User/IUserService';
import CampaignFundMap from '@domain/Core/CampaignFunds/CampaignFundMap';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  ICampaignQARepository,
  ICampaignQARepositoryId,
} from '@domain/Core/CampaignQA/ICampaignQARepository';
import {
  IFavoriteCampaignRepository,
  IFavoriteCampaignRepositoryId,
} from '@domain/Core/FavoriteCampaign/IFavoriteCampaignRepository';
import {
  IInvestorAccreditationDAO,
  IInvestorAccreditationDAOId,
} from '@domain/Core/InvestorAccreditation/IInvestorAccreditationDAO';
import {
  IInvestorPaymentsRepository,
  IInvestorPaymentsRepositoryId,
} from '@domain/Core/InvestorPayments/IInvestorPaymentsRepository';
import {
  IRepaymentsRepository,
  IRepaymentsRepositoryId,
} from '@domain/Core/Repayments/IRepaymentsRepository';
import {
  IRepaymentsUpdateRepository,
  IRepaymentsUpdateRepositoryId,
} from '@domain/Core/RepaymentsUpdate/IRepaymentsUpdateRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import { InvestorAccreditationSubmission } from '@domain/Core/ValueObjects/InvestorAccreditationSubmission';
import InvestorIncomeDetailsNotSubmittedException from '@domain/Exceptions/Investors/InvestorIncomeDetailsNotSubmittedException';
import InvestmentLimitService from '@domain/Services/InvestmentLimitService';
import UserPortfolioService from '@domain/Services/UserPortfolioService';
import UserTypeService from '@domain/Services/UserTypeService';
import UserPassword from '@domain/Users/UserPassword';
import emailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';
import HttpException from '@infrastructure/Errors/HttpException';
import { IAuthService, IAuthServiceId } from '@infrastructure/Service/Auth/IAuthService';
import mailService from '@infrastructure/Service/MailService';
import ParseBoolean from '@infrastructure/Utils/ParseBoolean';
import { inject, injectable } from 'inversify';
import moment from 'moment';
import GetAllInvestmentsByInvestorIdAndEntityDTO from './GetAllInvestmentsByInvestorIdAndEntityDTO';
import GetAllInvestmentsByInvestorId from './GetAllInvestmentsByInvestorIdDTO';
import GetUserDTO from './GetUserDTO';
import UpdateUserEmailOrPasswordDTO from './UpdateUserEmailOrPasswordDTO';
import UpdateUserLastPromptDTO from './UpdateUserLastPromptDTO';
import UserRemainingInvestmentLimitDTO from './UserRemainingInvestmentLimitDTO';
import UpdateFcmTokenDTO from './UpdateFcmTokenDTO';
import UpdateBiometricInfoDTO from './UpdateBiometricInfoDTO';
const { emailVerificationTemplate } = emailTemplates;
const { SendHtmlEmail } = mailService;
const { emailConfig } = config;

@injectable()
class UserService implements IUserService {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IUserEventDaoId) private userEventDao: IUserEventDao,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(ICampaignQARepositoryId) private campaignQARepository: ICampaignQARepository,
    @inject(IFavoriteCampaignRepositoryId)
    private favoriteCampaignRepository: IFavoriteCampaignRepository,
    @inject(IInvestorAccreditationDAOId)
    private investorAccreditationDAO: IInvestorAccreditationDAO,
    @inject(IRepaymentsRepositoryId) private repaymentRepository: IRepaymentsRepository,
    @inject(IInvestorPaymentsRepositoryId)
    private investorPaymentRepository: IInvestorPaymentsRepository,
    @inject(IRepaymentsUpdateRepositoryId)
    private repaymentsUpdateRepository: IRepaymentsUpdateRepository,
    @inject(IAuthServiceId) private authService: IAuthService,
    @inject(IInvestorMeetsCriteriaId)
    private investorMeetsCriteria: IInvestorMeetsCriteria,
  ) {}

  async getAllUsers(getAllUsersDTO) {
    const result = await this.userRepository.fetchAllUsers(
      getAllUsersDTO.getPaginationOptions(),
      {
        showTrashed: getAllUsersDTO.isShowTrashed(),
        query: getAllUsersDTO.getQuery(),
        owner: getAllUsersDTO.isOwner(),
        ownerQuery: getAllUsersDTO.getOwnerQuery(),
      },
    );

    const response = result.getPaginatedData();
    let responseData: any = [];

    for (const userObj of response.data) {
      const user = userObj.toPublicObject();
      if (userObj.owner) {
        // get issuer & campaignIds related to an owner
        user.owner.issuers = userObj.owner.issuers.map((issuer) => {
          return {
            issuerId: issuer.issuerId,
            issuerName: issuer.issuerName,
            legalEntityType: issuer.legalEntityType,
            campaigns: issuer.campaigns.map((campaign) => {
              return {
                campaignId: campaign.campaignId,
                campaignName: campaign.campaignName,
              };
            }),
          };
        });
      }
      let totalInvestmet = 0;
      if (user.investor) {
        totalInvestmet = await this.campaignFundRepository.fetchInvestorSum(
          user.investor.investorId,
        );
      }
      const userTypeObj = UserTypeService.createFromUser(userObj, totalInvestmet);
      user.userType = userTypeObj.getUserType();
      user.accreditationStatus = userTypeObj.getAccreditationStatus();
      user.totalInvested = totalInvestmet;
      responseData.push(user);
    }
    response.data = responseData;

    return response;
  }

  async getUserWithKyc(getUserWithKycDTO) {
    const result = await this.userRepository.fetchUserWithkyc(
      getUserWithKycDTO.getUserId(),
      getUserWithKycDTO.getPaginationOptions(),
      getUserWithKycDTO.isShowTrashed(),
    );

    const response: any = result.getPaginatedData();
    response.data = response.data.map((user) => user.toPublicObject());
    return response;
  }

  async getUser(getUserDTO: GetUserDTO) {
    const user = await this.userRepository.fetchById(getUserDTO.getUserId());
    if (!user) {
      throw new HttpException(404, 'No User record exists against provided input');
    }

    let totalInvestmet = 0;
    let availedPromotionCredits = false;
    if (user.investor) {
      totalInvestmet = await this.campaignFundRepository.fetchInvestorSum(
        user.investor.investorId,
      );
      const numberOfPromotionCreditsInvestments = await this.campaignFundRepository.countPromotionCreditsInvesments(
        user.investor.investorId,
      );
      availedPromotionCredits = numberOfPromotionCreditsInvestments > 0;
    }
    const userTypeObj = UserTypeService.createFromUser(user, totalInvestmet);
    user.userType = userTypeObj.getUserType();
    user.availedPromotionCredits = availedPromotionCredits;
    return user;
  }

  async getAllUsersInvestments(): Promise<any> {
    return await this.userRepository.getAllUsersInvestments();
  }

  async getUserInvestments(investmentsDTO) {
    const user = await this.userRepository.fetchById(investmentsDTO.getUserId());

    if (!user) {
      throw new HttpException(400, 'no user found against provided input');
    }

    const { investorId } = user.investor;

    if (!investmentsDTO.isAdminRequest()) {
      const response = await this.campaignFundRepository.fetchByInvestorAndCampaignId({
        investorId,
        paginationOptions: investmentsDTO.getPaginationOptions(),
        showTrashed: investmentsDTO.isShowTrashed(),
        entityId: investmentsDTO.getEntityId(),
      });
      return response.getPaginatedData();
    } else {
      const showGrouped = investmentsDTO.isShowGrouped();

      if (!showGrouped) {
        const result = await this.campaignFundRepository.fetchByInvestor(
          investorId,
          investmentsDTO.getPaginationOptions(),
          investmentsDTO.isShowTrashed(),
          investmentsDTO.shouldIncludePending(),
          investmentsDTO.shouldIncludeFailed(),
          investmentsDTO.shouldIncludeRefunded(),
          investmentsDTO.getEntityId(),
        );

        const response = result.getPaginatedData();
        response.data = await Promise.all(
          response.data.map(async (r) => {
            r = CampaignFundMap.toDTO(r);
            return r;
          }),
        );
        return response;
      }

      const response = await this.campaignFundRepository.fetchByInvestorAndGroupByCampaignId(
        {
          investorId,
          paginationOptions: investmentsDTO.getPaginationOptions(),
          showTrashed: investmentsDTO.isShowTrashed(),
          includePending: true,
          entityId: investmentsDTO.getEntityId(),
          isAdminRequest: investmentsDTO.isAdminRequest(),
        },
      );

      return response.getPaginatedData();
    }
  }

  async getAccumulatedInvestments(investmentsDTO) {
    const user = await this.userRepository.fetchById(investmentsDTO.getUserId());

    if (!user) {
      throw new HttpException(400, 'no user found with the provided input');
    }

    const { investorId } = user.investor;

    const investorRepayments = await this.repaymentRepository.fetchOneByCustomCritera({
      whereConditions: { investorId },
    });

    if (investorRepayments) {
      const result = await this.repaymentRepository.fetchByInvestorIdAndGroupByCampaign({
        paginationOptions: investmentsDTO.getPaginationOptions(),
        investorId: investorId,
        all: investmentsDTO.getAll(),
      });

      const repayments: any = [];
      result.allRepayments.map((rp) => {
        let exists = false;

        repayments.map((f, i) => {
          if (f.campaignName == rp.campaignName) {
            exists = true;
            repayments[i].repayments = [...repayments[i].repayments, rp];
          }
        });

        if (!exists) {
          repayments.push({
            campaignName: rp.campaignName,
            campaignId: rp.campaignId,
            nextPaymentDate: null,
            repayments: [rp],
          });
        }
      });

      result.nextPayments.map((np) => {
        repayments.map((r, i) => {
          if (r.campaignId == np.campaignId) {
            repayments[i].nextPaymentDate = np.nextPaymentDate;
          }
        });
      });

      const paginationOptions = {
        currentPage: investmentsDTO.getPaginationOptions().getCurrentPage(),
        perPage: investmentsDTO.getPaginationOptions().limit(),
        totalItems: result.repaymentsCount[0].totalRepayments,
      };

      if (ParseBoolean(investmentsDTO.getAll())) {
        return { data: repayments };
      }
      return { paginationOptions, data: repayments };
    } else {
      const paginationOptions = {
        currentPage: 0,
        perPage: 10,
        totalItems: 0,
      };

      return { paginationOptions, data: [] };
    }
  }

  async getUserQA(getQADTO) {
    const result = await this.campaignQARepository.fetchByUser(
      getQADTO.getUserId(),
      getQADTO.getPaginationOptions(),
      getQADTO.isShowTrashed(),
    );

    return result.getPaginatedData();
  }

  async investorPortfolio(investorPortfolioDTO) {
    const user = await this.userRepository.fetchById(investorPortfolioDTO.getUserId());

    if (!user) {
      throw new HttpException(400, 'no user found with the provided input');
    }

    const { investorId } = user.investor;
    const limitInput = new UserRemainingInvestmentLimitDTO(user.userId);

    const [
      investments,
      portfolioData,
      lastUpdate,
      investmentLimit,
      jobsSupported,
    ] = await Promise.all([
      this.campaignFundRepository.getInvestorPortfolioInvestments(
        investorId,
        investorPortfolioDTO.getEntityId(),
      ),
      this.investorPaymentRepository.fetchPortfolioData(
        investorId,
        investorPortfolioDTO.getEntityId(),
      ),
      this.repaymentsUpdateRepository.fetchLastUpdateDate(),
      user.investor.calculateTotalInvestmentLimit(),
      this.campaignFundRepository.getJobSupported(
        investorId,
        investorPortfolioDTO.getEntityId(),
      ),
    ]);

    const totalJobSupported = jobsSupported.reduce((count, currentCount) => {
      return count + currentCount.employeeCount;
    }, 0);

    const totalBusinessesData = jobsSupported.find((item) => item.totalBusinesses != 0);
    const totalBusinesses = totalBusinessesData ? totalBusinessesData.totalBusinesses : 0;

    const portfolioService = UserPortfolioService.createFromDetails(
      investments,
      portfolioData,
      lastUpdate,
      investmentLimit,
      totalJobSupported,
      totalBusinesses,
    );
    return portfolioService.getInvestorPortfolio();
  }

  async investorInvestmentLimitAvailability(investorInvestmentLimitAvailabilityDTO) {
    try {
      const user = await this.userRepository.fetchById(
        investorInvestmentLimitAvailabilityDTO.getUserId(),
      );

      if (!user) {
        throw new HttpException(400, 'no user found with the provided input');
      }

      const { investorId } = user.investor;

      const investments = await this.campaignFundRepository.fetchInvestorFundsOnly(
        investorId,
      );
      const nextDate = InvestmentLimitService.createFromDetails(
        user,
        investments,
      ).getInvestLimitAvailableDate();

      if (!nextDate) {
        // throw new HttpException(400, 'Investment Limit Already Available');
        return {
          available: true,
        };
      }

      return {
        available: false,
        date: nextDate,
      };
    } catch (err) {
      if (err instanceof InvestorIncomeDetailsNotSubmittedException) {
        throw new HttpException(400, 'Income Details not Submitted');
      }

      throw err;
    }
  }

  async getInvestorAccreditation(getInvestorAccreditation) {
    const user = await this.userRepository.fetchById(
      getInvestorAccreditation.getUserId(),
    );

    if (!user) {
      throw new HttpException(400, 'no user found with the provided input');
    }

    const { investorId, accreditedInvestorSubmission } = user.investor;

    if (accreditedInvestorSubmission !== InvestorAccreditationSubmission.SUBMITTED) {
      return null;
    }

    const accreditation = await this.investorAccreditationDAO.fetchByInvestorId(
      investorId,
      false,
    );

    accreditation.accreditedInvestorSubmission = accreditedInvestorSubmission;

    if (!accreditation) {
      throw new HttpException(400, 'no  accreditation for this investor');
    }

    return accreditation;
  }

  async PersonalDetailUpdateNotifyAfterFiveDays() {
    const fiveDayFromNow = new Date();
    fiveDayFromNow.setDate(fiveDayFromNow.getDate() - 5);

    const users = await this.userRepository.fetchWithNotificationToken({
      createdAt: moment(fiveDayFromNow).format('YYYY-MM-DD'),
    });

    users.map((user) => {
      user.bankConnected =
        user.investor &&
        user.investor.investorBanks &&
        user.investor.investorBanks.length > 0;
    });

    const filteredUsers = users.filter(
      (user) => !user.bankConnected || !user.isPersonalInformationSubmitted(),
    );

    // await this.pushNotificationService.sendUserNotifyAddPersonalDetail(filteredUsers);

    return true;
  }

  async PersonalDetailUpdateNotifyAfterTwoWeeks() {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() - 14);

    const users = await this.userRepository.fetchWithNotificationToken({
      createdAt: moment(twoWeeksFromNow).format('YYYY-MM-DD'),
    });

    users.map((user) => {
      user.bankConnected =
        user.investor &&
        user.investor.investorBanks &&
        user.investor.investorBanks.length > 0;
    });

    const filteredUsers = users.filter(
      (user) => !user.bankConnected || !user.isPersonalInformationSubmitted(),
    );

    // await this.pushNotificationService.sendUserNotifyAddPersonalDetail(filteredUsers);

    return true;
  }

  async getUserFavoriteCampaign(getFavoriteCampaignDTO) {
    const user = await this.userRepository.fetchById(getFavoriteCampaignDTO.getUserId());

    if (!user) {
      throw new HttpException(400, 'no user found againt the given input');
    }

    const { investorId } = user.investor;
    const result = await this.favoriteCampaignRepository.fetchByInvestor(
      investorId,
      getFavoriteCampaignDTO.getPaginationOptions(),
      getFavoriteCampaignDTO.isShowTrashed(),
    );

    return result.getPaginatedData();
  }

  async fetchByInvestorIds(investorIds) {
    return await this.userRepository.fetchByInvestorIds(investorIds);
  }

  async getAllInvestorAccreditations(getAllInvestorAccreditationsDTO) {
    const user = await this.userRepository.fetchById(
      getAllInvestorAccreditationsDTO.getUserId(),
    );

    if (!user) {
      throw new HttpException(400, 'no user found against the given input');
    }

    const { investorId, accreditedInvestorSubmission } = user.investor;

    if (accreditedInvestorSubmission !== InvestorAccreditationSubmission.SUBMITTED) {
      return null;
    }

    const result = await this.investorAccreditationDAO.fetchAllByInvestorId(
      investorId,
      getAllInvestorAccreditationsDTO.getPaginationOptions(),
      {
        wherePendingResult: getAllInvestorAccreditationsDTO.isPendingResult(),
        showTrashed: getAllInvestorAccreditationsDTO.isShowTrashed(),
      },
    );

    return result.getPaginatedData();
  }

  async saveAcknowledgements(saveAcknowledgementsDTO) {
    const acknowledgements = saveAcknowledgementsDTO.getAcknowledgementEvents();

    await Promise.all(
      acknowledgements.map(async (ack) => {
        await this.userEventDao.add(ack);
      }),
    );

    return true;
  }

  getSummary(dto) {
    return this.userRepository.getSummary(dto.getStartDate(), dto.getEndDate());
  }

  updateUserEmailOrPassword = async (
    updateUserEmailOrPasswordDTO: UpdateUserEmailOrPasswordDTO,
  ) => {
    const user = await this.userRepository.fetchById(
      updateUserEmailOrPasswordDTO.getUserId(),
    );

    if (!user) {
      throw new HttpException(400, 'no user found');
    }

    const userPassword = new UserPassword(updateUserEmailOrPasswordDTO.getPassword());
    const hashedPassword = await userPassword.hashPassword(
      updateUserEmailOrPasswordDTO.getPassword(),
    );
    let isEmailVerified = '';
    if (user.email != updateUserEmailOrPasswordDTO.getEmail()) {
      const emailToken = await this.authService.emailVerificationToken(
        user.userId,
        emailConfig.emailVerificationLinkExpiration,
        user.email,
      );

      const html = emailVerificationTemplate.replace(
        '{@EMAIL_LINK}',
        `${emailConfig.EMAIL_VERIFICATION_URL}?token=${emailToken}`,
      );
      await SendHtmlEmail(user.email, 'Verify Your Email', html);
      isEmailVerified = '';
    } else {
      isEmailVerified = user.isEmailVerified;
    }

    return this.userRepository.updateUserEmailOrPassword(
      updateUserEmailOrPasswordDTO.getUserId(),
      updateUserEmailOrPasswordDTO.getEmail(),
      hashedPassword,
      isEmailVerified,
    );
  };

  updateFcmToken = async (updateFcmTokenDTO: UpdateFcmTokenDTO) => {
    const user = await this.userRepository.fetchById(updateFcmTokenDTO.getUserId());

    if (!user) {
      throw new HttpException(400, 'no user found');
    }

    return this.userRepository.updateFcmToken(
      updateFcmTokenDTO.getUserId(),
      updateFcmTokenDTO.getFcmToken(),
    );
  };

  updateBiometricInfo = async (updateBiometricInfoDTO: UpdateBiometricInfoDTO) => {
    const user = await this.userRepository.fetchById(updateBiometricInfoDTO.getUserId());

    if (!user) {
      throw new HttpException(400, 'no user found');
    }

    return this.userRepository.updateBiometricInfo(
      updateBiometricInfoDTO.getUserId(),
      updateBiometricInfoDTO.getIsBiometricEnabledToken(),
      updateBiometricInfoDTO.getBiometricKey(),
    );
  };

  async getInvestmentsByInvestorId(
    getAllInvestmentsByInvestorIdDTO: GetAllInvestmentsByInvestorId,
  ) {
    const userId = getAllInvestmentsByInvestorIdDTO.getUserId();
    const user = await this.userRepository.fetchById(userId);
    const { investorId } = user.investor;
    return this.campaignFundRepository.fetchAccumulatedInvestmentsByInvestor({
      investorId,
    });
  }

  async getInvestmentsByInvestorIdAndEntity(
    getAllInvestmentsByInvestorIdAndEntity: GetAllInvestmentsByInvestorIdAndEntityDTO,
  ) {
    const userId = getAllInvestmentsByInvestorIdAndEntity.getUserId();
    const entityId = getAllInvestmentsByInvestorIdAndEntity.getEntityId();
    const user = await this.userRepository.fetchById(userId);

    const { investorId } = user.investor;

    return this.campaignFundRepository.fetchAllInvesmentsByInvestorIdAndEntity(
      investorId,
      entityId,
    );
  }
  getUserRemainingInvestmentLimit = async (
    userRemainingInvestmentLimitDTO: UserRemainingInvestmentLimitDTO,
  ) => {
    const user = await this.userRepository.fetchById(
      userRemainingInvestmentLimitDTO.getUserId(),
    );

    if (!user) {
      throw new HttpException(400, 'no user found');
    }
    if (user.investor.isAccredited === 'Not Accredited') {
      const dateToFilterBy = new Date();
      dateToFilterBy.setMonth(dateToFilterBy.getMonth() - 12);
      const totalInvested = await this.campaignFundRepository.fetchSumByInvestorAndDate(
        user.investor.investorId,
        dateToFilterBy,
      );

      let remainingLimit = user.investor.calculateInvestmentCap() - totalInvested;
      if (Number(remainingLimit) < 0) {
        remainingLimit = 0;
      }
      return remainingLimit;
    } else {
      return 'unlimited';
    }
  };

  async getUserInvestmentPerAnum(userId: string) {
    const user = await this.userRepository.fetchById(userId);
    if (!user) {
      throw new HttpException(400, 'no user found');
    }
    const { investorId, userProvidedCurrentInvestments } = user.investor;
    const investmentPerAnum = await this.investorMeetsCriteria.getAmountInvestedByInvestorInLastTwelveMonths(
      investorId,
    );

    return userProvidedCurrentInvestments === undefined ||
      userProvidedCurrentInvestments === null
      ? investmentPerAnum
      : investmentPerAnum + userProvidedCurrentInvestments;
  }

  async updateUserLastPromtValue(updateUserLastPromptDTO: UpdateUserLastPromptDTO) {
    const user = await this.userRepository.fetchById(updateUserLastPromptDTO.getUserId());
    if (!user) {
      throw new HttpException(400, 'no user found');
    }
    return this.userRepository.updateUserLastPrompt(
      updateUserLastPromptDTO.getUserId(),
      updateUserLastPromptDTO.getlastPrompt(),
    );
  }

  async resetKycStatus(userId: string) {
    const user = await this.userRepository.fetchById(userId);
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    user.setKycStatus('');
    await this.userRepository.update(user);
    return user;
  }
}

export default UserService;
