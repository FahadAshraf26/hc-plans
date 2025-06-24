const demoObj = require('../../demoObj');

const user = {
    ...demoObj.userObj,
    profilePic: {
        ...demoObj.profilePicObj
    },
    investor:{
        ...demoObj.investorObj
    },
    setProfilePic: (profilePic) => {user.profilePic = {...profilePic};}
  }

module.exports = {
    user
}