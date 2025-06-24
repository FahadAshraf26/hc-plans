import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import { inject, injectable } from 'inversify';
import models from '../Model';
import User from '@domain/Core/User/User';
import PaginationData from '@domain/Utils/PaginationData';
import Issuer from '@domain/Core/Issuer/Issuer';
import filterUndefined from '../Utils/filterUndefined';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import BaseRepository from './BaseRepository';
import DatabaseError from '../Errors/DatabaseError';
import { KycStatus } from '@domain/Core/ValueObjects/KycStatus';
import { IUserRepository } from '@domain/Core/User/IUserRepository';
import { IProfilePicDao, IProfilePicDaoId } from '@domain/Core/ProfilePic/IProfilePicDao';
import { IOwnerDao, IOwnerDaoId } from '@domain/Core/Owner/IOwnerDao';
import { IInvestorDao, IInvestorDaoId } from '@domain/Core/Investor/IInvestorDao';
import {
  IEntityIntermediaryRepository,
  IEntityIntermediaryRepositoryId,
} from '@domain/Core/EntityIntermediary/IEntityIntermediayRepository';
import moment from 'moment';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import {
  IIssuerOwnerDAO,
  IIssuerOwnerDAOId,
} from '@domain/Core/IssuerOwner/IIssuerOwnerDAO';

const {
  UserModel,
  ProfilePicModel,
  OwnerModel,
  InvestorModel,
  IssuerModel,
  CampaignModel,
  InvestorBankModel,
  ChargeModel,
  IdologyTimestampModel,
  Sequelize,
  CampaignFundModel,
  sequelize,
  InvestorPaymentOptionModel,
  InvestorCardModel,
} = models;
const { Op, fn, col, where: sequelizeWhere, literal } = Sequelize;

@injectable()
class UserRepository extends BaseRepository implements IUserRepository {
  constructor(
    @inject(IProfilePicDaoId) private profilePicDao: IProfilePicDao,
    @inject(IOwnerDaoId) private ownerDao: IOwnerDao,
    @inject(IIssuerOwnerDAOId) private issuerOwnerDao: IIssuerOwnerDAO,
    @inject(IInvestorDaoId) private investorDao: IInvestorDao,
    @inject(IEntityIntermediaryRepositoryId)
    private entityIntermediaryRepository: IEntityIntermediaryRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionRepository: IInvestorPaymentOptionsRepository,
  ) {
    super(UserModel, 'userId', User);
  }

  /**
   *  Store user in database
   * @param {User} user
   * @returns boolean
   */
  async add(user: User): Promise<boolean> {
    try {
      await super.add(user);

      if (user.hasProfilePic()) {
        await this.profilePicDao.add(user.profilePic);
      }

      if (user.hasOwner()) {
        await this.ownerDao.add(user.owner);
      }

      if (user.hasInvestor()) {
        await this.investorDao.add(user.investor);
      }

      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * fetchByEmail(email) fetch user object through email
   * @param {string} email
   * @param showTrashed
   * @returns {User}
   */
  async fetchByEmail(email, showTrashed: boolean = false): Promise<any> {
    const userObj = await super.fetchOneByCustomCritera({
      whereConditions: { email },
      showTrashed,
      raw: true,
    });

    if (!userObj) {
      return;
    }
    const days = moment().diff(moment(userObj.lastPrompt), 'days');

    userObj.lastPrompt === null || days > 14
      ? (userObj.showPrompt = true)
      : (userObj.showPrompt = false);

    const user = User.createFromObject(userObj);
    user.setPassword(userObj.password);

    const [profilePic, investor, owner, honeycombDwollaCustomer] = await Promise.all([
      this.profilePicDao.fetchByUserId(user.userId, showTrashed),
      this.investorDao.fetchByUserId(user.userId, showTrashed),
      this.ownerDao.fetchByUserId(user.userId, showTrashed),
      this.honeycombDwollaCustomerRepository.fetchByCustomerTypeAndUser(
        user.userId,
        'Personal',
      ),
    ]);

    if (profilePic) {
      user.setProfilePic(profilePic);
    }

    if (investor) {
      user.setInvestor(investor);
    }

    if (owner) {
      user.setOwner(owner);
    }
    if (user.hasEntities()) {
      const entities = await this.entityIntermediaryRepository.fetchEntitesByUserId(
        user.userId,
      );
      user.setEntities(entities);
    }

    if (honeycombDwollaCustomer !== null) {
      user.setCustomerId(honeycombDwollaCustomer.getDwollaCustomerId());
      user.setCustomerType(honeycombDwollaCustomer.getCustomerType());
      user.setDwollaBalanceId(honeycombDwollaCustomer.getDwollaBalanceId());
    }

    return user;
  }

  /**
   * fetchByIdWithPassword(userId) fetch user object through userId with Password
   * @param {string} userId
   * @returns {User}
   */
  async fetchByIdWithPassword(userId): Promise<any> {
    const userObj = await super.fetchOneByCustomCritera({
      whereConditions: { userId },
      raw: true,
    });

    if (!userObj) {
      return;
    }
    const user = User.createFromObject(userObj);
    user.setPassword(userObj.password);
    return user;
  }

  /**
   * Fetch all users from database with pagination
   * @param paginationOptions
   * @param options
   * @returns User[]
   */
  async fetchAllUsers(paginationOptions, options): Promise<PaginationData<User>> {
    const { showTrashed = false, query, owner, ownerQuery } = options;
    const { count, rows: all } = await UserModel.findAndCountAll({
      where: query
        ? {
            [Op.or]: [
              { firstName: { [Op.like]: `%${query}%` } },
              { lastName: { [Op.like]: `%${query}%` } },
              { email: { [Op.like]: `%${query}%` } },
              Sequelize.where(
                Sequelize.fn(
                  'concat',
                  Sequelize.col('firstName'),
                  ' ',
                  Sequelize.col('lastName'),
                ),
                {
                  [Sequelize.Op.like]: `%${query}%`,
                },
              ),
            ],
          }
        : {},
      limit: paginationOptions.limit(),
      offset: paginationOptions.offset(),
      paranoid: !showTrashed, // paranoid: true  => hide delete , paranoid: false => show delete
      include: [
        {
          model: ProfilePicModel,
          as: 'profilePic',
        },
        {
          model: OwnerModel,
          as: 'owner',
          where: ownerQuery ? { title: { [Op.like]: `%${ownerQuery}%` } } : {},
          required: owner,
          include: [
            {
              model: IssuerModel,
              as: 'issuers',
              include: [
                {
                  model: CampaignModel,
                  as: 'campaigns',
                },
              ],
            },
          ],
        },
        {
          model: InvestorModel,
          as: 'investor',
        },
      ],
    });

    const paginationData: PaginationData<User> = new PaginationData(
      paginationOptions,
      count,
    );
    all.forEach((userObj) => {
      const user = User.createFromObject(userObj);
      if (userObj.owner) {
        userObj.owner.issuers.forEach((issuerObj) => {
          const issuer = Issuer.createFromObject(issuerObj);
          user.owner.setIssuer(issuer);
        });
      }
      paginationData.addItem(user);
    });

    return paginationData;
  }

  /**
   * fetch all user's emails from database
   * @returns {{'firstName','email','notificationToken'}[]}
   */
  async fetchAllEmailsAndNotificationToken(): Promise<Array<User>> {
    const users = await UserModel.findAll({
      attributes: ['userId', 'firstName', 'email', 'notificationToken'],
      raw: true,
    });

    return users.map((user) => User.createFromObject(user));
  }

  /**
   *  filters all users with zero investments that signed up 'x' days ago
   * @param {number} daysSinceSignedUp - days since sign up
   * @param kycPassed
   */
  async fetchUsersWithNoInvestments(
    daysSinceSignedUp,
    kycPassed = false,
  ): Promise<Array<User>> {
    try {
      if (!daysSinceSignedUp) {
        return [];
      }

      let query = '';
      if (daysSinceSignedUp > 0) {
        // add days filter only if days parameter greater than zero
        query = `Date(user.createdAt) = Date(subdate(now(),${daysSinceSignedUp})) and `;
      }

      query += kycPassed
        ? `user.isVerified='${KycStatus.PASS}' and `
        : `user.isVerified in (${Object.keys(KycStatus)
            .filter((key) => key !== 'PASS')
            .map((key) => `'${KycStatus[key]}'`)
            .join(',')}) and `;

      query +=
        'not exists (select 1 from campaignFunds cf where cf.investorId = investor.investorId)';

      const rawUsers = await UserModel.findAll({
        where: literal(query),
        attributes: ['userId', 'email', 'firstName'],
        include: [
          {
            model: InvestorModel,
            as: 'investor',
            attributes: ['investorId', 'userId'],
          },
        ],
      });

      return rawUsers.map((userObj) => User.createFromObject(userObj));
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  /**
   * Fetch all users from database with pagination
   * @param userId
   * @param paginationOptions
   * @param showTrashed
   * @returns User[]
   */
  async fetchUserWithkyc(
    userId,
    paginationOptions,
    showTrashed = false,
  ): Promise<PaginationData<User>> {
    const includes = [
      {
        model: IdologyTimestampModel,
        as: 'idologyTimestamps',
      },
    ];

    return super.fetchAll({
      paginationOptions,
      showTrashed,
      includes,
      where: { userId },
    });
  }

  /**
   * fetchById(userId) fetch user By Id
   * @param {string} userId
   * @param showTrashed
   * @returns {User}
   */
  async fetchById(userId, showTrashed: any = false): Promise<any> {
    const user = await super.fetchById(userId, {
      showTrashed,
      includes: [
        {
          model: InvestorModel,
          as: 'investor',
        },
      ],
    });

    if (!user) {
      return;
    }

    const [profilePic, owner, honeycombDwollaCustomer, ,] = await Promise.all([
      this.profilePicDao.fetchByUserId(user.userId, showTrashed),
      this.ownerDao.fetchByUserId(user.userId, showTrashed),
      this.honeycombDwollaCustomerRepository.fetchByCustomerTypeAndUser(
        userId,
        'Personal',
      ),
    ]);
    if (showTrashed !== true) {
      const creditCard = await this.investorPaymentOptionRepository.fetchInvestorCard(
        user.investor.investorId,
        true,
      );
      if (creditCard) {
        user.setHasCreditCard(true);
      }
      const bankAccount = await this.investorPaymentOptionRepository.fetchInvestorBank(
        user.investor.investorId,
      );
      if (bankAccount) {
        user.setHasBankAccount(true);
      }
    }

    if (profilePic) {
      user.setProfilePic(profilePic);
    }

    if (user.investor) {
      user.setInvestor(user.investor);
    }

    if (owner) {
      user.setOwner(owner);
    }

    if (user.hasEntities()) {
      const entities = await this.entityIntermediaryRepository.fetchEntitesByUserId(
        user.userId,
      );
      user.setEntities(entities);
    }

    if (honeycombDwollaCustomer !== null) {
      user.setCustomerId(honeycombDwollaCustomer.getDwollaCustomerId());
      user.setCustomerType(honeycombDwollaCustomer.getCustomerType());
      user.setDwollaBalanceId(honeycombDwollaCustomer.getDwollaBalanceId());
    }
    const days = moment().diff(moment(user.lastPrompt), 'days');

    user.lastPrompt === null || days > 14
      ? (user.showPrompt = true)
      : (user.showPrompt = false);

    return user;
  }

  async fetchByNCPartyId(NcPartyId, showTrashed = false): Promise<any> {
    const user = await super.fetchOneByCustomCritera({
      whereConditions: { NcPartyId },
      showTrashed,
      raw: false,
    });

    if (!user) {
      return;
    }

    const [profilePic, investor, owner, honeycombDwollaCustomer] = await Promise.all([
      this.profilePicDao.fetchByUserId(user.userId, showTrashed),
      this.investorDao.fetchByUserId(user.userId, showTrashed),
      this.ownerDao.fetchByUserId(user.userId, showTrashed),
      this.honeycombDwollaCustomerRepository.fetchByUserId(user.userId),
    ]);

    if (profilePic) {
      user.setProfilePic(profilePic);
    }

    if (investor) {
      user.setInvestor(investor);
    }

    if (owner) {
      user.setOwner(owner);
    }
    if (user.hasEntities()) {
      const entities = await this.entityIntermediaryRepository.fetchEntitesByUserId(
        user.userId,
      );
      user.setEntities(entities);
    }

    if (honeycombDwollaCustomer !== null) {
      user.setCustomerId(honeycombDwollaCustomer.getDwollaCustomerId());
      user.setCustomerType(honeycombDwollaCustomer.getCustomerType());
      user.setDwollaBalanceId(honeycombDwollaCustomer.getDwollaBalanceId());
    }

    return user;
  }

  async activateUser(user): Promise<boolean> {
    try {
      await Promise.all([
        UserModel.restore({
          where: { userId: user.userId },
        }),
        OwnerModel.restore({
          where: { userId: user.userId },
        }),

        InvestorModel.restore({
          where: { userId: user.userId },
        }),
        ProfilePicModel.restore({
          where: { userId: user.userId },
        }),
      ]);

      return true;
    } catch (e) {
      throw Error(e);
    }
  }

  /**
   * Fetch users that have enabled notification access
   * for our app
   * @returns PaginationData
   */
  async fetchWithNotificationToken(options: any = {}): Promise<Array<User>> {
    const { createdAt } = options;
    try {
      const whereConditions = filterUndefined({
        notificationToken: {
          [Op.ne]: null,
        },
      });

      if (createdAt) {
        whereConditions[Op.and] = [
          sequelizeWhere(fn('Date', col('user.createdAt')), Op.eq, createdAt),
        ];
      }

      const all = await UserModel.findAll({
        where: whereConditions,
        include: [
          {
            model: InvestorModel,
            as: 'investor',
          },
        ],
      });

      return all.map((userObj) => {
        return User.createFromObject(userObj);
      });
    } catch (err) {
      throw err;
    }
  }

  async fetchByInvestorIds(investorIds): Promise<any> {
    try {
      const all = await UserModel.findAll({
        include: [
          {
            model: InvestorModel,
            as: 'investor',
            where: {
              investorId: {
                [Op.in]: investorIds,
              },
            },
            required: true,
          },
        ],
      });

      return all.map((userObj) => {
        return User.createFromObject(userObj);
      });
    } catch (err) {
      throw err;
    }
  }

  async fetchByInvestorId(investorId): Promise<any> {
    try {
      const user = await UserModel.findOne({
        include: [
          {
            model: InvestorModel,
            as: 'investor',
            where: {
              investorId: investorId,
            },
            required: true,
          },
        ],
        paranoid: false,
      });

      if (!user) {
        return;
      }

      return User.createFromObject(user);
    } catch (err) {
      throw err;
    }
  }

  /**
   * update(userId,userObj) fetch user by id and then update it
   * @param {User} user
   * @returns boolean
   */
  async update(user): Promise<boolean> {
    try {
      await super.update(user);

      if (user.hasProfilePic()) {
        await this.profilePicDao.updateProfilePic(user.profilePic);
      }

      if (user.hasOwner()) {
        if (!user.owner.primaryOwner) {
          const issuerOwner = await this.issuerOwnerDao.fetchByOwnerId(
            user.owner.ownerId,
          );
          if (issuerOwner) {
            throw new Error(`${user.email} is primary owner of a business`);
          } else {
            await this.ownerDao.remove(user.owner);
          }
        } else {
          await this.ownerDao.upsert(user.owner);
        }
      }

      if (user.hasInvestor()) {
        await this.investorDao.update(user.investor);
      }

      return true;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  /**
   * remove(userId) fetch user by id and delete it from database
   * @param {User} user
   * @param {boolean} hardDelete
   * @returns {boolean}
   */
  async remove(user, hardDelete = false): Promise<boolean> {
    try {
      await super.remove(user, hardDelete);

      if (user.hasProfilePic()) {
        await this.profilePicDao.remove(user.profilePic, hardDelete);
      }

      if (user.hasOwner()) {
        await this.ownerDao.remove(user.owner, hardDelete);
      }

      if (user.hasInvestor()) {
        await this.investorDao.remove(user.investor, hardDelete);
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async fetchByDwollaId(dwollaCustomerId, showTrashed = false): Promise<any> {
    const investor = await this.investorDao.fetchByDwollaId(
      dwollaCustomerId,
      showTrashed,
    );

    if (!investor) {
      return;
    }

    const user = await super.fetchById(investor.userId, { showTrashed });

    if (!user) {
      return;
    }

    user.setInvestor(investor);

    const profilePic = await this.profilePicDao.fetchByUserId(user.userId);

    if (profilePic) {
      user.setProfilePic(profilePic);
    }

    const owner = await this.ownerDao.fetchByUserId(user.userId);
    if (owner) {
      user.setOwner(owner);
    }

    if (user.hasEntities()) {
      const entities = await this.entityIntermediaryRepository.fetchEntitesByUserId(
        user.userId,
      );
      user.setEntities(entities);
    }

    return user;
  }

  async fetchByNCAccountId(ncAccountId, showTrashed = false): Promise<any> {
    try {
      const userObj = await UserModel.findOne({
        include: [
          {
            model: InvestorModel,
            as: 'investor',
            where: {
              ncAccountId: ncAccountId,
            },
            required: true,
          },
        ],
        paranoid: !showTrashed,
      });

      if (!userObj) {
        return;
      }

      const user = User.createFromObject(userObj);

      const [profilePic, owner, honeycombDwollaCustomer] = await Promise.all([
        this.profilePicDao.fetchByUserId(user.userId, showTrashed),
        this.ownerDao.fetchByUserId(user.userId, showTrashed),
        this.honeycombDwollaCustomerRepository.fetchByUserId(user.userId),
      ]);

      if (profilePic) {
        user.setProfilePic(profilePic);
      }

      if (owner) {
        user.setOwner(owner);
      }

      if (user.hasEntities()) {
        const entities = await this.entityIntermediaryRepository.fetchEntitesByUserId(
          user.userId,
        );
        user.setEntities(entities);
      }

      if (honeycombDwollaCustomer !== null) {
        user.setCustomerId(honeycombDwollaCustomer.getDwollaCustomerId());
        user.setCustomerType(honeycombDwollaCustomer.getCustomerType());
        user.setDwollaBalanceId(honeycombDwollaCustomer.getDwollaBalanceId());
      }

      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async fetchByHash(hash, showTrashed = false): Promise<any> {
    const investor = await this.investorDao.fetchByHash(hash, showTrashed);

    if (!investor) {
      return;
    }

    const user = await super.fetchById(investor.userId, { showTrashed });

    if (!user) {
      return;
    }
    user.setInvestor(investor);

    const profilePic = await this.profilePicDao.fetchByUserId(user.userId);

    if (profilePic) {
      user.setProfilePic(profilePic);
    }

    const owner = await this.ownerDao.fetchByUserId(user.userId);
    if (owner) {
      user.setOwner(owner);
    }

    if (user.hasEntities()) {
      const entities = await this.entityIntermediaryRepository.fetchEntitesByUserId(
        user.userId,
      );
      user.setEntities(entities);
    }

    const honeycombDwollaCustomer = await this.honeycombDwollaCustomerRepository.fetchByUserId(
      user.userId,
    );
    if (honeycombDwollaCustomer !== null) {
      user.setCustomerId(honeycombDwollaCustomer.getDwollaCustomerId());
      user.setCustomerType(honeycombDwollaCustomer.getCustomerType());
    }

    return user;
  }

  /**
   * fetchUserInfoById(userId) fetch user By Id
   * @param {string} userId
   * @param showTrashed
   * @returns User
   */
  async fetchUserInfoById(userId, showTrashed = false): Promise<any> {
    const includes = [
      {
        model: ProfilePicModel,
        as: 'profilePic',
      },
      {
        model: OwnerModel,
        as: 'owner',
        include: [
          {
            model: IssuerModel,
            as: 'issuers',
            attributes: ['issuerId', 'issuerName'],
            include: [
              {
                model: CampaignModel,
                as: 'campaigns',
                attributes: ['campaignId', 'campaignName'],
              },
            ],
          },
        ],
      },
      {
        model: InvestorModel,
        as: 'investor',
        include: [
          {
            model: CampaignFundModel,
            as: 'investments',
            include: [
              {
                model: CampaignModel,
                as: 'campaign',
              },
              {
                model: ChargeModel,
                as: 'charge',
                where: {
                  chargeStatus: {
                    [Op.in]: [ChargeStatus.SUCCESS, ChargeStatus.PENDING],
                  },
                  refunded: { [Op.or]: [null, false] },
                },
              },
            ],
          },
          {
            model: InvestorPaymentOptionModel,
            as: 'investorBank',
            include: [
              {
                model: InvestorBankModel,
                as: 'bank',
              },
              {
                model: InvestorCardModel,
                as: 'card',
              },
            ],
            paranoid: true,
            order: [['createdAt', 'desc']],
          },
        ],
      },
    ];

    const userObj = await super.fetchOneByCustomCritera({
      whereConditions: { userId },
      showTrashed,
      includes,
      raw: true,
    });

    if (!userObj) {
      return null;
    }

    const user = User.createFromObject(userObj);
    const honeycombDwollaCustomer = await this.honeycombDwollaCustomerRepository.fetchByCustomerTypeAndUser(
      user.userId,
      'Personal',
    );
    if (userObj.owner) {
      userObj.owner.issuers.forEach((issuerObj) => {
        const issuer = Issuer.createFromObject(issuerObj);
        user.owner.setIssuer(issuer);
      });
    }
    if (user.hasEntities()) {
      const entities = await this.entityIntermediaryRepository.fetchEntitesByUserId(
        user.userId,
      );
      user.setEntities(entities);
    }

    if (honeycombDwollaCustomer !== null) {
      user.setCustomerId(honeycombDwollaCustomer.getDwollaCustomerId());
      user.setCustomerType(honeycombDwollaCustomer.getCustomerType());
      user.setDwollaBalanceId(honeycombDwollaCustomer.getDwollaBalanceId());
    }
    return user;
  }

  /**
   * It will get user by ssn
   * @param ssn
   * @param firstName
   * @param lastName
   * @returns {Promise<Model>}
   */
  async ssnExist({ ssn, firstName, lastName }): Promise<any> {
    return await UserModel.findOne({
      where: {
        ssn,
        firstName,
        lastName,
        deletedAt: null,
      },
    });
  }

  async fetchUsersWithAppleEmails(): Promise<any> {
    const all = await UserModel.findAll({
      where: {
        email: {
          [Op.like]: `%@privaterelay.appleid.com%`,
        },
      },
      include: [
        {
          model: InvestorModel,
          as: 'investor',
        },
      ],
    });

    return all.map((userObj) => User.createFromObject(userObj));
  }

  async fetchUsersEmailByCategory(
    usersType: string,
    startDate: Date | null = null,
    endDate: Date | null = null,
  ): Promise<any> {
    let dateFilterForUsers = '';
    let dateFilterForFunds = '';
    if (startDate && endDate) {
      dateFilterForUsers = `Date(\`users\`.\`createdAt\`) >= Date('${startDate.toISOString()}') AND Date(\`users\`.\`createdAt\`) <= Date('${endDate.toISOString()}')`;
      dateFilterForFunds = `Date(\`campaignFunds\`.\`createdAt\`) >= Date('${startDate.toISOString()}') AND Date(\`campaignFunds\`.\`createdAt\`) <= Date('${endDate.toISOString()}')`;
    }

    let query = '';
    if (usersType === 'deactiveUsers') {
      query = `select email from users where deletedAt IS NOT NULL${
        dateFilterForUsers && ` and ${dateFilterForUsers}`
      };`;
    }
    if (usersType === 'activeUsers') {
      query = `select email from users where deletedAt IS NULL ${
        dateFilterForUsers && ` and ${dateFilterForUsers}`
      };`;
    }
    if (usersType === 'signups') {
      query = `select email from users where deletedAt IS NULL AND isVerified = "Not Submitted"${
        dateFilterForUsers && ` and ${dateFilterForUsers}`
      };`;
    }
    if (usersType === 'kycPending') {
      query = `select email from users where deletedAt IS NULL AND isVerified = "Pending"${
        dateFilterForUsers && ` and ${dateFilterForUsers}`
      };`;
    }
    if (usersType === 'kycFailed') {
      query = `select email from users where deletedAt IS NULL AND isVerified = "Fail"${
        dateFilterForUsers && ` and ${dateFilterForUsers}`
      };`;
    }
    if (usersType === 'kycPassed') {
      query = `select email from users where deletedAt IS NULL AND isVerified = "Pass"${
        dateFilterForUsers && ` and ${dateFilterForUsers}`
      };`;
    }
    if (usersType === 'notInvestors') {
      query = `select email from users where deletedAt IS NULL AND isVerified = "Pass" AND userId not in (SELECT users.userId FROM users JOIN investors ON users.userId = investors.userId JOIN investorPaymentOptions ON investors.investorId = investorPaymentOptions.investorId
        WHERE users.isVerified = "Pass" AND investorPaymentOptions.deletedAt IS NULL) ${
          dateFilterForUsers && ` AND ${dateFilterForUsers}`
        };`;
    }
    if (usersType === 'investors') {
      query = `SELECT distinct email FROM users JOIN investors ON users.userId = investors.userId JOIN investorPaymentOptions ON investors.investorId = investorPaymentOptions.investorId
      WHERE users.isVerified = "Pass" AND investorPaymentOptions.deletedAt IS NULL ${
        dateFilterForUsers && ` AND ${dateFilterForUsers}`
      };`;
    }
    if (usersType === 'notActiveInvestors') {
      query = `SELECT distinct users.email FROM users JOIN investors ON users.userId = investors.userId JOIN investorPaymentOptions ON investors.investorId = investorPaymentOptions.investorId
      WHERE users.isVerified = "Pass" AND investorPaymentOptions.deletedAt IS NULL AND investors.investorId not in (SELECT distinct investorId FROM campaignFunds) ${
        dateFilterForUsers && ` AND ${dateFilterForUsers}`
      };`;
    }
    if (usersType === 'activeInvestors') {
      query = `SELECT distinct email FROM users JOIN investors ON users.userId = investors.userId 
      JOIN investorPaymentOptions ON investors.investorId = investorPaymentOptions.investorId
      WHERE users.isVerified = "Pass" AND investorPaymentOptions.deletedAt IS NULL ${
        dateFilterForUsers && ` AND ${dateFilterForUsers}`
      } 
      and investors.investorId in (select investorId as activeInvestor from campaignFunds  group by investorId having sum(amount) < 500);`;
    }

    if (usersType === 'powerInvestors') {
      query = `SELECT distinct email FROM users JOIN investors ON users.userId = investors.userId 
      JOIN investorPaymentOptions ON investors.investorId = investorPaymentOptions.investorId
      WHERE users.isVerified = "Pass" AND investorPaymentOptions.deletedAt IS NULL ${
        dateFilterForUsers && ` AND ${dateFilterForUsers}`
      } 
      and investors.investorId in (select investorId as activeInvestor from campaignFunds  group by investorId having sum(amount) >= 500);`;
    }

    const results = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      raw: true,
    });

    return results;
  }

  async getSummary(date: Date | null = null, endDate: Date | null = null) {
    let dateFilterForUsers = '';
    let dateFilterForFunds = '';
    if (date && endDate) {
      dateFilterForUsers = `Date(\`users\`.\`createdAt\`) >= Date('${date.toISOString()}') AND Date(\`users\`.\`createdAt\`) <= Date('${endDate.toISOString()}')`;
      dateFilterForFunds = `Date(\`campaignFunds\`.\`createdAt\`) >= Date('${date.toISOString()}') AND Date(\`campaignFunds\`.\`createdAt\`) <= Date('${endDate.toISOString()}')`;
    }

    const totalUsersCount = `select count(*) as totalUsers from users ${
      dateFilterForUsers && ` WHERE ${dateFilterForUsers}`
    };`;

    const deactiveUsersCount = `select count(email) as deactiveUsers from users where deletedAt IS NOT NULL${
      dateFilterForUsers && ` and ${dateFilterForUsers}`
    };`;

    const activateUsersCount = `select count(email) as activateUsers from users where deletedAt IS NULL ${
      dateFilterForUsers && ` and ${dateFilterForUsers}`
    };`;

    const signupsCount = `select count(email) as signups from users where deletedAt IS NULL AND isVerified = "Not Submitted"${
      dateFilterForUsers && ` and ${dateFilterForUsers}`
    };`;

    const kycPendingCount = `select count(email) as kycPending from users where deletedAt IS NULL AND isVerified = "Pending"${
      dateFilterForUsers && ` and ${dateFilterForUsers}`
    };`;

    const kycFailedCount = `select count(email) as kycFailed from users where deletedAt IS NULL AND isVerified = "Fail"${
      dateFilterForUsers && ` and ${dateFilterForUsers}`
    };`;

    const kycPassedCount = `select count(email) as kycPassed from users where deletedAt IS NULL AND isVerified = "Pass"${
      dateFilterForUsers && ` and ${dateFilterForUsers}`
    };`;

    const notInvestorsCount = `select count(email) as notInvestors from users where deletedAt IS NULL AND isVerified = "Pass" AND userId not in (SELECT users.userId FROM users JOIN investors ON users.userId = investors.userId JOIN investorPaymentOptions ON investors.investorId = investorPaymentOptions.investorId
    WHERE users.isVerified = "Pass" AND investorPaymentOptions.deletedAt IS NULL) ${
      dateFilterForUsers && ` AND ${dateFilterForUsers}`
    };`;

    const investorsCount = `SELECT count(distinct email) as investors FROM users JOIN investors ON users.userId = investors.userId JOIN investorPaymentOptions ON investors.investorId = investorPaymentOptions.investorId
    WHERE users.isVerified = "Pass" AND investorPaymentOptions.deletedAt IS NULL ${
      dateFilterForUsers && ` AND ${dateFilterForUsers}`
    };`;

    const notActiveInvestorsCount = `SELECT count(distinct users.email) as notActiveInvestors FROM users JOIN investors ON users.userId = investors.userId JOIN investorPaymentOptions ON investors.investorId = investorPaymentOptions.investorId
    WHERE users.isVerified = "Pass" AND investorPaymentOptions.deletedAt IS NULL AND investors.investorId not in (SELECT distinct investorId FROM campaignFunds) ${
      dateFilterForUsers && ` AND ${dateFilterForUsers}`
    };`;

    const activeInvestorsCount = `SELECT count(distinct email) as activeInvestors FROM users JOIN investors ON users.userId = investors.userId JOIN 
    investorPaymentOptions ON investors.investorId = investorPaymentOptions.investorId WHERE users.isVerified = "Pass" 
    AND investorPaymentOptions.deletedAt IS NULL ${
      dateFilterForUsers && ` AND ${dateFilterForUsers}`
    } and investors.investorId in 
    (select investorId as activeInvestor from campaignFunds group by investorId);`;

    const powerInvestorsCount = `SELECT count(distinct email) as powerInvestors FROM users JOIN investors ON users.userId = investors.userId 
    JOIN investorPaymentOptions ON investors.investorId = investorPaymentOptions.investorId
        WHERE users.isVerified = "Pass" AND investorPaymentOptions.deletedAt IS NULL ${
          dateFilterForUsers && ` AND ${dateFilterForUsers}`
        } and investors.investorId in 
        (select investorId as activeInvestor from campaignFunds group by investorId having sum(amount) >= 15000);`;
    const totalBusiness = `select count(*) as totalBusinesses from issuers;`;
    const totalCampaigns = `select count(*) as totalCampaigns from campaigns;`;
    const currentYear = new Date().getFullYear();
    const firstDate = `${currentYear}-01-01`;
    const lastDate = `${currentYear}-12-31`;
    const totalInvestedAmount = `select sum(amount) as totalInvestedAmount from campaignFunds where deletedAt is null and createdAt BETWEEN '${firstDate}' AND '${lastDate}'`;
    const queryToDo = [
      totalUsersCount,
      deactiveUsersCount,
      activateUsersCount,
      signupsCount,
      kycPendingCount,
      kycFailedCount,
      kycPassedCount,
      notInvestorsCount,
      investorsCount,
      notActiveInvestorsCount,
      activeInvestorsCount,
      powerInvestorsCount,
      totalBusiness,
      totalCampaigns,
      totalInvestedAmount,
    ].join('');

    const results = await sequelize.query(queryToDo, {
      type: Sequelize.QueryTypes.SELECT,
      raw: true,
    });

    return Object.assign(
      results.map((result) => {
        const values = Object.values(result);

        if (values.length === 0) {
          return {};
        }

        const keys = Object.keys(values[0]);

        let count = values.reduce((sum, x) => sum + x[keys[0]], 0);
        return {
          [keys[0]]: count,
        };
      }),
    );
  }

  async fetchUserWithKycPassedAndCriteria({
    days,
    bankConnected = false,
    invested = false,
  }): Promise<any> {
    try {
      const users = await UserModel.findAll({
        where: literal(
          `user.isVerified='${
            KycStatus.PASS
          }' and (DateDiff(Date(now()),Date(idologyTimestamps.createdAt))=${days}) and ${
            bankConnected ? '' : 'not '
          }exists (select 1 from investorPaymentOptions where investorId=investor.investorId and deletedAt is null) ${
            invested
              ? 'and exists (select 1 from campaignFunds where campaignFunds.investorId=investor.investorId)'
              : ''
          }`,
        ),
        attributes: ['userId', 'notificationToken'],
        include: [
          {
            model: InvestorModel,
            as: 'investor',
            required: true,
            attributes: [],
          },
          {
            model: IdologyTimestampModel,
            as: 'idologyTimestamps',
            order: [['createdAt', 'DESC']],
            where: {
              isVerified: KycStatus.PASS,
            },
            attributes: [],
            required: true,
          },
        ],
      });

      return users.map((userObj) => User.createFromObject(userObj));
    } catch (err) {
      return [];
    }
  }

  async updateUserPassword({ userId, password }) {
    await UserModel.update(
      { password: password },
      {
        where: { userId: userId },
      },
    );
    return true;
  }

  async updateIntermediary(userId, intermediaryId) {
    return UserModel.update(
      { intermediaryId: intermediaryId },
      {
        where: { userId: userId },
      },
    );
  }
  async updateUserEmailOrPassword(userId, email, password, isEmailVerified) {
    return UserModel.update(
      {
        email,
        password,
        isEmailVerified,
      },
      {
        where: { userId },
      },
    );
  }

  async updateFcmToken(userId, fcmToken) {
    return UserModel.update(
      {
        fcmToken,
      },
      {
        where: { userId },
      },
    );
  }

  async updateBiometricInfo(userId, isBiometricEnabled, biometricKey) {
    return UserModel.update(
      {
        isBiometricEnabled,
        biometricKey,
      },
      {
        where: { userId },
      },
    );
  }

  async updateUserLastPrompt(userId, lastPrompt) {
    await UserModel.update(
      {
        lastPrompt: lastPrompt,
      },
      {
        where: { userId },
      },
    );
    return true;
  }

  async fetchUsersForExport() {
    const users = sequelize.query(
      ` select 
          u.firstName,u.lastName,u.email,u.createdAt,u.detailSubmittedDate,i.investorId,i.annualIncome,i.netWorth,i.userProvidedCurrentInvestments,i.userProvidedCurrentInvestmentsDate,i.isAccredited
        from
          users u
        join
          investors i on i.userId = u.userId`,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    return users;
  }

  async exportEducationalData(startDate, endDate) {
    const dataQuery = `select 
                          u.firstName 'First Name',
                          u.lastName 'Last Name',
                          u.email 'Email Address',
                          case when u.password is null then 'Google' else 'Email' end as 'Registration Type',
                          u.createdAt 'Date User Account Created',
                          u.isEmailVerified 'Email Verified',
                          (select max(createdAt) from campaignFunds where investorId = i.investorId) as 'Last investment date' 
                        from 
                          users u 
                          join investors i on i.userId = u.userId 
                        where 
                          u.deletedAt is null and i.deletedAt is null and u.createdAt between Date("${startDate.toISOString()}") and Date("${endDate.toISOString()}")
                      `;
    return sequelize.query(dataQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
  }

  async fetchUserForInstagram(userName) {
    const user = await super.fetchOneByCustomCritera({
      whereConditions: { userName },
      includes: [
        {
          model: InvestorModel,
        },
      ],
    });
    if (!user) {
      return;
    }
    return user;
  }

  async getAllUsersInvestments(): Promise<any> {
    const users = await UserModel.findAll({
      attributes: [
        'email',
        'firstName',
        'lastName',
        [
          sequelize.fn('COUNT', sequelize.col('investor.investments.CampaignFundId')),
          'campaignFundCount',
        ],
        [
          sequelize.fn('MIN', sequelize.col('investor.investments.createdAt')),
          'firstCampaignFund',
        ],
        [
          sequelize.fn('MAX', sequelize.col('investor.investments.createdAt')),
          'lastCampaignFund',
        ],
      ],
      include: [
        {
          model: InvestorModel,
          as: 'investor',
          required: true,
          attributes: [],
          include: [
            {
              model: CampaignFundModel,
              as: 'investments',
              required: true,
              attributes: [],
            },
          ],
        },
      ],
      group: ['user.userId', 'investor.investorId'],
    });

    return users;
  }
}

export default UserRepository;
