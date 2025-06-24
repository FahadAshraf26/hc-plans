export default (sequelize, DataTypes) => {
    const CampaignHoneycombChargeFeeModel = sequelize.define(
        'campaignHoneycombChargeFee',
        {
            campaignHoneycombChargeFeeId: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            isChargeFee: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            timestamps: true,
            paranoid: true,
        },
    );

    return CampaignHoneycombChargeFeeModel;
};
