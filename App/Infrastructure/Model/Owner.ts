export default (sequelize, DataTypes) => {
    const OwnerModel = sequelize.define(
        'owner',
        {
            ownerId: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            subTitle: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            primaryOwner: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            beneficialOwner: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            beneficialOwnerId: {
                type: DataTypes.STRING,
            },
            businessOwner: {
                type: DataTypes.BOOLEAN
            }
        },
        {
            timestamps: true,
            paranoid: true,
        },
    );
    OwnerModel.associate = (models) => {
        OwnerModel.hasOne(models.HoneycombDwollaBeneficialOwnerModel, {
            foreignKey: 'ownerId',
            as: 'dwollaBeneficialOwner'
        });
      };
    return OwnerModel;
};
