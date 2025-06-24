import { Model, DataTypes, Sequelize } from "sequelize";

// It's good practice to import the types of associated models for strong typing
// For brevity, these are just placeholders. You would import the actual classes.
// import { Naic } from './Naic';
// import { Owner } from './Owner';
// ... and so on

// Interface for type-safety on instance attributes
interface IssuerAttributes {
  issuerId: string;
  issuerName: string;
  physicalAddress: string;
  website: string | null;
  businessType: string;
  legalEntityType: string;
  description: string | null;
  facebook: string | null;
  linkedIn: string | null;
  twitter: string | null;
  instagram: string | null;
  pinterest: string | null;
  reddit: string | null;
  email: string;
  EIN: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  phoneNumber: string | null;
  latitude: string | null;
  longitude: string | null;
  previousName: string | null;
  ncIssuerId: string | null;
  country: string | null;
  naicId?: string; // Foreign key
}

// Extend Sequelize's Model class and implement our attributes interface
export class Issuer
  extends Model<IssuerAttributes>
  implements IssuerAttributes
{
  // --- TYPE DEFINITIONS ---
  public issuerId!: string;
  public issuerName!: string;
  public physicalAddress!: string;
  public website!: string | null;
  public businessType!: string;
  public legalEntityType!: string;
  public description!: string | null;
  public facebook!: string | null;
  public linkedIn!: string | null;
  public twitter!: string | null;
  public instagram!: string | null;
  public pinterest!: string | null;
  public reddit!: string | null;
  public email!: string;
  public EIN!: string | null;
  public city!: string | null;
  public state!: string | null;
  public zipCode!: string | null;
  public phoneNumber!: string | null;
  public latitude!: string | null;
  public longitude!: string | null;
  public previousName!: string | null;
  public ncIssuerId!: string | null;
  public country!: string | null;

  // Foreign keys and associations
  public naicId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // --- STATIC ASSOCIATE METHOD ---
  public static associate(models: any) {
    // Note: All `...Model` suffixes have been removed from the model names
    // and `IssuerModel` is replaced with `this`.

    models.Naic.hasMany(this, { foreignKey: "naicId", as: "issuers" });
    this.belongsTo(models.Naic, { foreignKey: "naicId", as: "naic" });

    models.Owner.belongsToMany(this, {
      through: models.IssuerOwner,
      as: "issuers",
      foreignKey: "ownerId",
    });
    this.belongsToMany(models.Owner, {
      through: models.IssuerOwner,
      as: "owners",
      foreignKey: "issuerId",
    });

    models.IssuerBank.belongsTo(this, { foreignKey: "issuerId" });
    this.hasMany(models.IssuerBank, { foreignKey: "issuerId" });

    // issuer Documents
    this.hasMany(models.IssuerDocument, { foreignKey: "issuerId" });
    models.IssuerDocument.belongsTo(this, { foreignKey: "issuerId" });

    // Entity Intermediary
    this.hasMany(models.EntityIntermediary, { foreignKey: "issuerId" });
    this.hasMany(models.HoneycombDwollaConsent, { foreignKey: "issuerId" });
    this.hasMany(models.HoneycombDwollaCustomer, { foreignKey: "issuerId" });
    this.hasMany(models.DwollaPostTransactions, { foreignKey: "issuerId" });
    this.hasMany(models.EmployeeLog, {
      foreignKey: "issuerId",
      as: "employeeLog",
    });
    this.hasMany(models.DwollaCustodyTransferHistory, {
      foreignKey: "issuerId",
      constraints: false,
    });

    // --- Preserving commented-out association ---
    // models.EntityCampaignFund.hasMany(this, {
    //   as: 'entity',
    //   foreignKey: 'issuerId',
    // });
  }
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  Issuer.init(
    {
      // --- RUNTIME DEFINITIONS ---
      issuerId: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      issuerName: { type: DataTypes.STRING, allowNull: false },
      physicalAddress: { type: DataTypes.STRING, allowNull: false },
      website: { type: DataTypes.STRING },
      businessType: { type: DataTypes.STRING, allowNull: false },
      legalEntityType: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      facebook: { type: DataTypes.STRING },
      linkedIn: { type: DataTypes.STRING },
      twitter: { type: DataTypes.STRING },
      instagram: { type: DataTypes.STRING },
      pinterest: { type: DataTypes.STRING },
      reddit: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, allowNull: false, unique: false },
      EIN: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      zipCode: { type: DataTypes.STRING },
      phoneNumber: { type: DataTypes.STRING },
      latitude: { type: DataTypes.STRING },
      longitude: { type: DataTypes.STRING },
      previousName: { type: DataTypes.STRING },
      ncIssuerId: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "Issuer",
      tableName: "issuers", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return Issuer;
};
