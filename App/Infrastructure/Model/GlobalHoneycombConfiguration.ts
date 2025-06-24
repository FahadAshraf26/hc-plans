export default (sequelize, DataTypes) => {
    const GlobalHoneycombConfigurationModel = sequelize.define(
        'globalHoneycombConfiguration',
        {
            globalHoneycombConfigurationId: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            configuration: {
                type: DataTypes.JSON,
            },
        },
        {
            timestamps: true,
            paranoid: true,
        },
    );

    return GlobalHoneycombConfigurationModel;
};
