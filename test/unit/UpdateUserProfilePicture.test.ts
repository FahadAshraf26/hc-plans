const chai = require('chai');
const expect = chai.expect;
const demoObj = require('../Helper/Fixtures/users/updateUserProfilePictureFixture');
const UpdateUserProfilePictureDTO = require('../../App/Application/User/updateUserProfilePicture/UpdateUserProfilePictureDTO');
const UpdateUserProfilePicture = require('../../App/Application/User/updateUserProfilePicture/updateUserProfilePicture');
const updateUserProfilePicture = new UpdateUserProfilePicture({
    fetchById: async (id) => demoObj.user,
    update: async (user) => true,
},
    (name) => "uploads/profilePic-1615897035345-683432052_tiny.png",
);

describe("Update user profile picture service", () => {
    let updateUserProfilePictureDTO;
    
    before(()=> {
        updateUserProfilePictureDTO = new UpdateUserProfilePictureDTO(
            demoObj.user.userId, imageName=undefined
        );
        updateUserProfilePictureDTO.setProfilePic({...demoObj.user.profilePic})
    })

    it("when user will send an image", async ()=> {

        const result =  await updateUserProfilePicture.execute(updateUserProfilePictureDTO);
        expect(result).to.be.true;
    });

    it("when user will send image name", async () => {
        updateUserProfilePictureDTO.profilePic = undefined;
        updateUserProfilePictureDTO.imageName = 'GoodDoge';
        const result =  await updateUserProfilePicture.execute(updateUserProfilePictureDTO);
        expect(result).to.be.true;

    })
});