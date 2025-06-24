import * as dotenv from 'dotenv';
dotenv.config();

const profilePictureConfig = {
  SpaceCat: process.env.PICTURE_SPACE_CAT,
  GoodDoge: process.env.PICTURE_GOOD_DOGE,
  ChillCactus: process.env.PICTURE_CHILL_CACTUS,
  returnRandomImageUrl: (imageName) => {
    if (imageName === 'SpaceCat') {
      return profilePictureConfig.SpaceCat;
    }
    if (imageName === 'GoodDoge') {
      return profilePictureConfig.GoodDoge;
    }
    if (imageName === 'ChillCactus') {
      return profilePictureConfig.ChillCactus;
    }
  },
};

export default profilePictureConfig;
