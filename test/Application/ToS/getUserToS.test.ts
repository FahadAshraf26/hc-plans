const chai = require('chai');
const expect = chai.expect;
const demoObj = require('../../Helper/demoObj');
const GetUserTosDTO = require('../../../App/Application/ToS/getUserToS/GetUserTosDTO');
const GetUserToS = require('../../../App/Application/ToS/getUserToS/getUserToS');
const HttpError = require('../../../App/Infrastructure/Errors/HttpException');
const UserEventTypes = require('../../../App/Domain/Core/ValueObjects/UserEventTypes');

const getUserTos = new GetUserToS ({
    fetchById: async (id) => { 
        return {...demoObj.userObj, investor: {...demoObj.investorObj}} 
    }
},
{
    fetchTos: async () => { return {...demoObj.tosObj} }
},
{
    fetchLatestByType: async (UserEventType, {userId}) => {return UserEventType == 'Terms of Service Update Acknowledged' ? {createdAt: '2021-04-04'}: false},
});

describe('Testing get user tos usecase', () => {
    let getUserTosDTO;
    before(() => {
      getUserTosDTO = new GetUserTosDTO(demoObj.userObj.userId);
    });
  
    it('will check when wrong user id is provided', async () => {
        getUserTos.userRepository.fetchById = () => {return ''};
        try {
            await getUserTos.execute(getUserTosDTO);
        }
        catch (err){
            expect(err).to.be.instanceOf(HttpError);
            expect(err.message).to.eq("no user found against provided input");
        }
    });

    it("will check when TosUpdate will be true", async () => {
        getUserTos.userRepository.fetchById = () => {return {...demoObj.userObj,investor: {...demoObj.investorObj}}};
        getUserTos.toSRepository.fetchTos = async () => { return {...demoObj.tosObj,termOfServicesUpdateDate: true} }

        const result = await getUserTos.execute(getUserTosDTO);
        expect(result).to.eql({
            userOnBoarded: false,
            TosUpdated: true,
            PrivacyPolicyUpdated: false,
            educationalMaterialUpdated: false,
            faqUpdated: false
          })
    });

    it("will check when PrivacyPolicyUpdated will be true", async () => {
        getUserTos.toSRepository.fetchTos = async () => { return {...demoObj.tosObj,privacyPolicyUpdateDate: true} };
        getUserTos.userEventDAO.fetchLatestByType = async (UserEventType, {userId}) => {return UserEventType == 'Privacy Policy Update Acknowledged' ? {createdAt: '2021-04-04'}: false};


        const result = await getUserTos.execute(getUserTosDTO);
        expect(result).to.eql({
            userOnBoarded: false,
            TosUpdated: false,
            PrivacyPolicyUpdated: true,
            educationalMaterialUpdated: false,
            faqUpdated: false
          })


    });

    it("will check when educationalMaterialUpdated will be true", async () => {
        getUserTos.toSRepository.fetchTos = async () => { return {...demoObj.tosObj,educationalMaterialUpdateDate: true} }
        getUserTos.userEventDAO.fetchLatestByType = async (UserEventType, {userId}) => {return UserEventType == 'Education Material Update Acknowledged' ? {createdAt: '2021-04-04'}: false};


        const result = await getUserTos.execute(getUserTosDTO);
        expect(result).to.eql({
            userOnBoarded: false,
            TosUpdated: false,
            PrivacyPolicyUpdated: false,
            educationalMaterialUpdated: true,
            faqUpdated: false
          })
    });

    it("will check when faqUpdated will be true", async () => {
        getUserTos.toSRepository.fetchTos = async () => { return {...demoObj.tosObj,faqsUpdateDate: true} }
        getUserTos.userEventDAO.fetchLatestByType = async (UserEventType, {userId}) => {return UserEventType == 'faq' ? {createdAt: '2021-04-04'}: false};


        const result = await getUserTos.execute(getUserTosDTO);
        expect(result).to.eql({
            userOnBoarded: false,
            TosUpdated: false,
            PrivacyPolicyUpdated: false,
            educationalMaterialUpdated: false,
            faqUpdated: true
          })
    });


    it("will check when all of them will be true", async () => {
        getUserTos.toSRepository.fetchTos = async () => { return {...demoObj.tosObj,termOfServicesUpdateDate: true,privacyPolicyUpdateDate: true,educationalMaterialUpdateDate: true,faqsUpdateDate: true} }
        getUserTos.userEventDAO.fetchLatestByType = async (UserEventType, {userId}) => {return {createdAt: '2021-04-04'}};


        const result = await getUserTos.execute(getUserTosDTO);
        expect(result).to.eql({
            userOnBoarded: true,
            TosUpdated: true,
            PrivacyPolicyUpdated: true,
            educationalMaterialUpdated: true,
            faqUpdated: true
          })
    });

    it("will check when all of them will be false", async () => {
        getUserTos.toSRepository.fetchTos = async () => { return {...demoObj.tosObj}}
        getUserTos.userEventDAO.fetchLatestByType = async (UserEventType, {userId}) => {return false};


        const result = await getUserTos.execute(getUserTosDTO);
        expect(result).to.eql({
            userOnBoarded: false,
            TosUpdated: false,
            PrivacyPolicyUpdated: false,
            educationalMaterialUpdated: false,
            faqUpdated: false
          })
    });
    
  });
  

