export default (sequelize, DataTypes) => {
  const SiteBannerConfigurationModel = sequelize.define(
    'siteBannerConfiguration',
    {
      siteBannerConfigurationId: {
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

  return SiteBannerConfigurationModel;
};
