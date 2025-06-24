import { Model, DataTypes } from "sequelize";
import EncryptionService from "../Service/EncryptionService/EncryptionService";
// Assuming the other model class is named InvestorPaymentOption

// Define an interface for the model's attributes for strong typing
interface InvestorBankAttributes {
  investorBankId: string;
  bankToken: string | null;
  accountType: string | null;
  accountName: string | null;
  lastFour: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  wireRoutingNumber: string | null;
  bankName: string | null;
  dwollaFundingSourceId: string | null;
  investorPaymentOptionsId?: string; // Foreign Key from association
}

// Extend Sequelize's Model class and implement our attributes interface
export class InvestorBank
  extends Model<InvestorBankAttributes>
  implements InvestorBankAttributes
{
  // --- TYPE DEFINITIONS (The Fix) ---
  // These properties are now explicitly declared for TypeScript's benefit.
  public investorBankId!: string; // '!' denotes that this will be definitely assigned by Sequelize
  public bankToken!: string | null;
  public accountType!: string | null;
  public accountName!: string | null;
  public lastFour!: string | null;
  public accountNumber!: string | null;
  public routingNumber!: string | null;
  public wireRoutingNumber!: string | null;
  public bankName!: string | null;
  public dwollaFundingSourceId!: string | null;

  // This foreign key is added by the association
  public investorPaymentOptionsId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // --- STATIC ASSOCIATE METHOD ---
  public static associate(models: any) {
    this.belongsTo(models.InvestorPaymentOption, {
      foreignKey: "investorPaymentOptionsId",
    });
    models.InvestorPaymentOption.hasOne(this, {
      foreignKey: "investorPaymentOptionsId",
      as: "bank",
    });
  }

  // --- INSTANCE METHODS ---
  public encrypt() {
    try {
      if (this.routingNumber && this.routingNumber.trim().length > 0) {
        this.routingNumber = EncryptionService.encryptBankDetails(
          this.routingNumber
        );
      }
      if (this.accountNumber && this.accountNumber.trim().length > 0) {
        this.accountNumber = EncryptionService.encryptBankDetails(
          this.accountNumber
        );
      }
      if (this.wireRoutingNumber && this.wireRoutingNumber.trim().length > 0) {
        this.wireRoutingNumber = EncryptionService.encryptBankDetails(
          this.wireRoutingNumber
        );
      }
    } catch (e) {
      console.error(e); // It's good practice to log errors
    }
  }

  public decrypt() {
    try {
      if (this.routingNumber && this.routingNumber.trim().length > 0) {
        this.routingNumber = EncryptionService.decryptBankDetails(
          this.routingNumber
        );
      }
      if (this.accountNumber && this.accountNumber.trim().length > 0) {
        this.accountNumber = EncryptionService.decryptBankDetails(
          this.accountNumber
        );
      }
      if (this.wireRoutingNumber && this.wireRoutingNumber.trim().length > 0) {
        this.wireRoutingNumber = EncryptionService.decryptBankDetails(
          this.wireRoutingNumber
        );
      }
    } catch (e) {
      console.error(e); // It's good practice to log errors
    }
  }
}

// The exported initialization function remains the same
export default (sequelize: any, DataTypes: any) => {
  InvestorBank.init(
    {
      // --- RUNTIME DEFINITIONS ---
      // These definitions are for Sequelize's runtime.
      investorBankId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      bankToken: { type: DataTypes.STRING, allowNull: true },
      accountType: { type: DataTypes.STRING, allowNull: true },
      accountName: { type: DataTypes.STRING, allowNull: true },
      lastFour: { type: DataTypes.STRING, allowNull: true },
      accountNumber: { type: DataTypes.STRING, allowNull: true },
      routingNumber: { type: DataTypes.STRING, allowNull: true },
      wireRoutingNumber: { type: DataTypes.STRING, allowNull: true },
      bankName: { type: DataTypes.STRING, allowNull: true },
      dwollaFundingSourceId: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "InvestorBank",
      tableName: "investorBanks",
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeCreate(investorBank: InvestorBank) {
          investorBank.encrypt();
        },
        beforeUpdate(investorBank: InvestorBank) {
          if (
            investorBank.changed("routingNumber") ||
            investorBank.changed("accountNumber") ||
            investorBank.changed("wireRoutingNumber")
          ) {
            investorBank.encrypt();
          }
        },
        afterFind(result: InvestorBank | InvestorBank[] | null) {
          if (!result) return;
          if (Array.isArray(result)) {
            for (const record of result) {
              record.decrypt();
            }
          } else {
            result.decrypt();
          }
        },
      },
    }
  );

  return InvestorBank;
};
