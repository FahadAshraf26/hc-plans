import { Model, Sequelize, FindOptions } from "sequelize";
import EncryptionService from "@infrastructure/Service/EncryptionService/EncryptionService";

// Interface for type-safety on instance attributes
interface UserAttributes {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  email: string;
  password?: string | null; // Often write-only
  address: string | null;
  apartment: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  dob: Date | null;
  phoneNumber: string | null;
  facebook: string | null;
  linkedIn: string | null;
  twitter: string | null;
  instagram: string | null;
  website: string | null;
  ssn: string | null;
  prefix: string | null;
  isVerified: string | null;
  detailSubmittedDate: Date | null;
  notificationToken: string | null;
  isEmailVerified: string | null;
  idVerifiedPrompt: boolean | null;
  portfolioVisited: boolean | null;
  ncPartyId: string | null;
  optOutOfEmail: Date | null;
  moneyMadeId: string | null;
  shouldVerifySsn: boolean;
  isSsnVerified: boolean;
  country: string | null;
  isIntermediary: boolean | null;
  tos: boolean | null;
  optIn: boolean | null;
  businessOwner: boolean;
  lastPrompt: Date | null; // Corrected type
  vcCustomerId: string | null;
  stripeCustomerId: string | null;
  idologyIdNumber: string | null;
  stripePaymentMethodId: string | null;
  signUpType: string | null;
  fcmToken: string | null;
  isBiometricEnabled: boolean | null;
  biometricKey: string | null;
  vcThreadBankCustomerId: string | null;
  isRaisegreen: boolean | null;
  kycProvider: string | null;
}

// Extend Sequelize's Model class and implement our attributes interface
export class User extends Model<UserAttributes> implements UserAttributes {
  // --- TYPE DEFINITIONS ---
  public userId!: string;
  public firstName!: string | null;
  public lastName!: string | null;
  public userName!: string | null;
  public email!: string;
  public password!: string | null;
  public address!: string | null;
  public apartment!: string | null;
  public city!: string | null;
  public state!: string | null;
  public zipCode!: string | null;
  public dob!: Date | null;
  public phoneNumber!: string | null;
  public facebook!: string | null;
  public linkedIn!: string | null;
  public twitter!: string | null;
  public instagram!: string | null;
  public website!: string | null;
  public ssn!: string | null;
  public prefix!: string | null;
  public isVerified!: string | null;
  public detailSubmittedDate!: Date | null;
  public notificationToken!: string | null;
  public isEmailVerified!: string | null;
  public idVerifiedPrompt!: boolean | null;
  public portfolioVisited!: boolean | null;
  public ncPartyId!: string | null;
  public optOutOfEmail!: Date | null;
  public moneyMadeId!: string | null;
  public shouldVerifySsn!: boolean;
  public isSsnVerified!: boolean;
  public country!: string | null;
  public isIntermediary!: boolean | null;
  public tos!: boolean | null;
  public optIn!: boolean | null;
  public businessOwner!: boolean;
  public lastPrompt!: Date | null;
  public vcCustomerId!: string | null;
  public stripeCustomerId!: string | null;
  public idologyIdNumber!: string | null;
  public stripePaymentMethodId!: string | null;
  public signUpType!: string | null;
  public fcmToken!: string | null;
  public isBiometricEnabled!: boolean | null;
  public biometricKey!: string | null;
  public vcThreadBankCustomerId!: string | null;
  public isRaisegreen!: boolean | null;
  public kycProvider!: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // Potential associations (add types for better safety if you have them)
  public investor?: any;

  // --- STATIC ASSOCIATE METHOD ---
  public static associate(models: any) {
    this.hasOne(models.ProfilePic, { foreignKey: "userId", as: "profilePic" });
    models.ProfilePic.belongsTo(this, { foreignKey: "userId" });

    this.hasOne(models.Owner, {
      onDelete: "cascade",
      foreignKey: "userId",
      as: "owner",
    });
    models.Owner.belongsTo(this, { foreignKey: "userId", as: "user" });

    this.hasOne(models.Investor, { onDelete: "cascade", foreignKey: "userId" });
    models.Investor.belongsTo(this, { foreignKey: "userId" });

    // this.hasMany(models.Invitation, { foreignKey: "initiator", as: "invitor" });
    this.hasMany(models.UserDocument, { foreignKey: "userId" });
    models.UserDocument.belongsTo(this, { foreignKey: "userId" });

    // this.hasMany(models.CapitalRequest, { foreignKey: "userId", as: "user" });
    // this.hasMany(models.UserMedia, { foreignKey: "userId", as: "userMedia" });
    // models.UserMedia.belongsTo(this, { foreignKey: "userId", as: "user" });

    this.hasMany(models.EntityIntermediary, { foreignKey: "userId" });
    this.hasMany(models.HoneycombDwollaConsent, { foreignKey: "userId" });
    this.hasMany(models.HoneycombDwollaCustomer, { foreignKey: "userId" });
  }

  // --- INSTANCE METHODS ---
  private encryptSsn() {
    if (this.ssn) {
      this.ssn = EncryptionService.encryptSsn(this.ssn);
    }
  }

  private decryptSsn() {
    if (this.ssn && this.ssn !== "null") {
      this.ssn = EncryptionService.decryptSsn(this.ssn);
    }
  }
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  User.init(
    {
      // --- RUNTIME DEFINITIONS ---
      userId: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      userName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      apartment: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      zipCode: { type: DataTypes.STRING },
      dob: { type: DataTypes.DATEONLY },
      phoneNumber: { type: DataTypes.STRING },
      facebook: { type: DataTypes.STRING },
      linkedIn: { type: DataTypes.STRING },
      twitter: { type: DataTypes.STRING },
      instagram: { type: DataTypes.STRING },
      website: { type: DataTypes.STRING },
      ssn: { type: DataTypes.STRING },
      prefix: { type: DataTypes.STRING },
      isVerified: { type: DataTypes.STRING },
      detailSubmittedDate: { type: DataTypes.DATE },
      notificationToken: { type: DataTypes.STRING },
      isEmailVerified: { type: DataTypes.STRING },
      idVerifiedPrompt: { type: DataTypes.BOOLEAN },
      portfolioVisited: { type: DataTypes.BOOLEAN },
      ncPartyId: { type: DataTypes.STRING },
      optOutOfEmail: { type: DataTypes.DATE },
      moneyMadeId: { type: DataTypes.STRING },
      shouldVerifySsn: { type: DataTypes.BOOLEAN, defaultValue: false },
      isSsnVerified: { type: DataTypes.BOOLEAN, defaultValue: true },
      country: { type: DataTypes.STRING },
      isIntermediary: { type: DataTypes.BOOLEAN },
      tos: { type: DataTypes.BOOLEAN },
      optIn: { type: DataTypes.BOOLEAN },
      businessOwner: { type: DataTypes.BOOLEAN, defaultValue: false },
      lastPrompt: { type: DataTypes.DATE }, // Corrected from invalid OR syntax
      vcCustomerId: { type: DataTypes.STRING },
      stripeCustomerId: { type: DataTypes.STRING },
      idologyIdNumber: { type: DataTypes.STRING },
      stripePaymentMethodId: { type: DataTypes.STRING },
      signUpType: { type: DataTypes.STRING },
      fcmToken: { type: DataTypes.STRING },
      isBiometricEnabled: { type: DataTypes.BOOLEAN },
      biometricKey: { type: DataTypes.STRING },
      vcThreadBankCustomerId: { type: DataTypes.STRING },
      isRaisegreen: { type: DataTypes.BOOLEAN },
      kycProvider: { type: DataTypes.STRING, allowNull: true },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      paranoid: true,
      // --- HOOKS ---
      hooks: {
        beforeCreate(user: User) {
          user["encryptSsn"]();
        },
        beforeUpdate(user: User) {
          if (user.changed("ssn")) {
            user["encryptSsn"]();
          }
        },
        beforeFind(options: FindOptions) {
          if (options.where && options.where["ssn"]) {
            options.where["ssn"] = EncryptionService.encryptSsn(
              options.where["ssn"] as string
            );
          }
        },
        afterFind(result: User | User[] | null) {
          if (!result) return;

          // This function handles both single and array results
          const decryptRecord = (record: User) => {
            record["decryptSsn"]();
            // The complex logic for decrypting nested associated models
            if (record.investor && record.investor.investorBank) {
              if (Array.isArray(record.investor.investorBank)) {
                record.investor.investorBank.forEach((po: any) => {
                  if (po.bank && typeof po.bank.decrypt === "function") {
                    po.bank.decrypt();
                  }
                  if (po.card && typeof po.card.decrypt === "function") {
                    po.card.decrypt();
                  }
                });
              }
            }
          };

          if (Array.isArray(result)) {
            result.forEach(decryptRecord);
          } else {
            decryptRecord(result);
          }
        },
      },
    }
  );

  return User;
};
