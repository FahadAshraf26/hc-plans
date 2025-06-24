import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface IssuerDocumentAttributes {
  issuerDocumentId: string;
  documentType: string;
  name: string;
  path: string;
  mimeType: string;
  ext: string | null;
}

// Extend Sequelize's Model class and implement our attributes interface
export class IssuerDocument
  extends Model<IssuerDocumentAttributes>
  implements IssuerDocumentAttributes
{
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public issuerDocumentId!: string;
  public documentType!: string;
  public name!: string;
  public path!: string;
  public mimeType!: string;
  public ext!: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // This model does not define any associations itself,
  // so the static 'associate' method is not needed here.
  // The relationship is likely defined in another model (e.g., Issuer.hasMany(IssuerDocument)).
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  IssuerDocument.init(
    {
      // --- RUNTIME DEFINITIONS ---
      issuerDocumentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      documentType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ext: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "IssuerDocument",
      tableName: "issuerDocuments", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return IssuerDocument;
};
