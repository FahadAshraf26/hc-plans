import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface CampaignTagAttributes {
  campaignTagId: string;
  // Explicitly define the foreign keys
  campaignId: string;
  tagId: string;
}

// Extend Sequelize's Model class and implement our attributes interface
export class CampaignTag
  extends Model<CampaignTagAttributes>
  implements CampaignTagAttributes
{
  // --- TYPE DEFINITIONS ---
  public campaignTagId!: string;
  public campaignId!: string;
  public tagId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // Associations for this model are defined in Campaign and Tag via 'belongsToMany'
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  CampaignTag.init(
    {
      // --- RUNTIME DEFINITIONS ---
      campaignTagId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      // --- ADD THESE DEFINITIONS ---
      campaignId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "campaigns", // table name
          key: "campaignId",
        },
      },
      tagId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "tags", // table name
          key: "tagId",
        },
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "CampaignTag",
      tableName: "campaignTags",
      timestamps: true,
      paranoid: true,
      // Note: You do not need to define the unique index here.
      // The `belongsToMany` association will still automatically create it.
    }
  );

  return CampaignTag;
};
