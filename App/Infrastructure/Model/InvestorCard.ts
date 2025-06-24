import { Model, DataTypes, Sequelize } from "sequelize";
import EncryptionService from "../Service/EncryptionService/EncryptionService";

// Interface for type-safety on instance attributes
interface InvestorCardAttributes {
  investorCardId: string;
  creditCardName: string | null;
  cardType: string | null;
  lastFour: string | null;
  isStripeCard: boolean;
  // Attributes used in methods but not originally defined
  creditCardNumber: string | null;
  expirationDate: string | null;
  cvvNumber: string | null;
  investorPaymentOptionsId?: string;
}

// Extend Sequelize's Model class and implement our attributes interface
export class InvestorCard
  extends Model<InvestorCardAttributes>
  implements InvestorCardAttributes
{
  // --- TYPE DEFINITIONS ---
  public investorCardId!: string;
  public creditCardName!: string | null;
  public cardType!: string | null;
  public lastFour!: string | null;
  public isStripeCard!: boolean;
  public creditCardNumber!: string | null;
  public expirationDate!: string | null;
  public cvvNumber!: string | null;

  // This foreign key is added by the association
  public investorPaymentOptionsId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // --- STATIC ASSOCIATE METHOD ---
  public static associate(models: any) {
    // Note: `...Model` suffixes are removed, and `InvestorCardModel` is replaced with `this`.
    this.belongsTo(models.InvestorPaymentOption, {
      foreignKey: "investorPaymentOptionsId",
    });

    // Preserving commented-out association
    // models.InvestorPaymentOption.hasOne(this, {
    //     foreignKey: 'investorPaymentOptionsId',
    //     as: 'card',
    // });
  }

  // --- INSTANCE METHODS ---
  // Note: Typo 'encrpyt' is corrected to 'encrypt'
  public encrypt() {
    try {
      if (this.creditCardNumber) {
        this.creditCardNumber = EncryptionService.encryptBankDetails(
          this.creditCardNumber
        );
      }
      if (this.expirationDate) {
        this.expirationDate = EncryptionService.encryptBankDetails(
          this.expirationDate
        );
      }
      if (this.cvvNumber) {
        this.cvvNumber = EncryptionService.encryptBankDetails(this.cvvNumber);
      }
    } catch (err) {
      console.error(err); // Good practice to log errors
    }
  }

  public decrypt() {
    try {
      if (this.creditCardNumber) {
        this.creditCardNumber = EncryptionService.decryptBankDetails(
          this.creditCardNumber
        );
      }
      if (this.expirationDate) {
        this.expirationDate = EncryptionService.decryptBankDetails(
          this.expirationDate
        );
      }
      if (this.cvvNumber) {
        this.cvvNumber = EncryptionService.decryptBankDetails(this.cvvNumber);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  InvestorCard.init(
    {
      // --- RUNTIME DEFINITIONS ---
      investorCardId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      creditCardName: { type: DataTypes.STRING },
      cardType: { type: DataTypes.STRING },
      lastFour: { type: DataTypes.STRING },
      isStripeCard: { type: DataTypes.BOOLEAN, defaultValue: false },
      // Adding attributes that were used in methods but missing from the definition
      creditCardNumber: { type: DataTypes.STRING },
      expirationDate: { type: DataTypes.STRING },
      cvvNumber: { type: DataTypes.STRING },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "InvestorCard",
      tableName: "investorCards", // Explicitly set table name
      timestamps: true,
      paranoid: true,
      // --- HOOKS ---
      hooks: {
        beforeCreate(investorCard: InvestorCard) {
          investorCard.encrypt(); // Corrected method name
        },
        beforeUpdate(investorCard: InvestorCard) {
          // Check if sensitive fields changed to prevent re-encrypting already encrypted data
          if (
            investorCard.changed("creditCardNumber") ||
            investorCard.changed("expirationDate") ||
            investorCard.changed("cvvNumber")
          ) {
            investorCard.encrypt(); // Corrected method name
          }
        },
        afterFind(result: InvestorCard | InvestorCard[] | null) {
          if (!result) return;
          if (Array.isArray(result)) {
            result.forEach((record) => record.decrypt());
          } else {
            result.decrypt();
          }
        },
      },
    }
  );

  return InvestorCard;
};
