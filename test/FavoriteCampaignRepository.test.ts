require('dotenv').config();

const chai = require('chai');
const expect = chai.expect;
const CampaignRepository = require('../App/Infrastructure/MySQLRepository/CampaignRepository');
const FavoriteCampaignRepository = require('../App/Infrastructure/MySQLRepository/FavoriteCampaignRepository');
const Campaign = require('../App/Domain/Core/Campaign');
const FavoriteCampaign = require('../App/Domain/Core/FavoriteCampaign');
const Investor = require('../App/Domain/Core/Investor/Investor');
const User = require('../App/Domain/Core/User/User');
const UserRepository = require('../App/Infrastructure/MySQLRepository/UserRepository');
const Issuer = require('../App/Domain/Core/Issuer');
const IssuerRepsoitory = require('../App/Infrastructure/MySQLRepository/IssuerRepository');
const demoObj = require('./Helper/demoObj');
const PaginationOptions = require('../App/Domain/Utils/PaginationOptions');
const NAICRepository = require('../App/Infrastructure/MySQLRepository/NAICRepository');
const NAIC = require('../App/Domain/Core/NAIC');

/* ========== Campaign Test Cases ========= */

describe('FavoriteCampaigns', () => {
  const investor = Investor.createFromObject(demoObj.investorObj);
  const user = User.createFromObject(demoObj.userObj);
  user.setPassword('1234');
  user.setInvestor(investor);
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const campaign = Campaign.createFromObject(demoObj.campaignObj);
  const favoriteCampaign = FavoriteCampaign.createFromObject(demoObj.favoriteCampaignObj);
  const naic = NAIC.createFromObject(demoObj.naicObj);

  before(async () => {
    await NAICRepository.remove(naic, true);
    await FavoriteCampaignRepository.remove(favoriteCampaign, true);
    await UserRepository.remove(user, true);
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
  });

  after(async () => {
    await NAICRepository.remove(naic, true);

    await FavoriteCampaignRepository.remove(favoriteCampaign, true);
    await UserRepository.remove(user, true);
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
  });

  describe('Add Campaign favoriteCampaign', () => {
    it('Should Add Campaign', async () => {
      await UserRepository.add(user);
      await NAICRepository.add(naic);
      await IssuerRepsoitory.add(issuer);
      await CampaignRepository.add(campaign);
      const addResult = await FavoriteCampaignRepository.add(favoriteCampaign);
      expect(addResult).to.equal(true);
    });
  });

  describe('FetchAllwithDeleted', () => {
    it('Should Fetch All Campaigns', async () => {
      const options = new PaginationOptions();
      const result = await FavoriteCampaignRepository.fetchByCampaign(
        campaign.campaignId,
        options,
        true,
      );
      const favoriteCampaign = result.getPaginatedData();
      favoriteCampaign.data.forEach((favoriteCampaign) => {
        expect(favoriteCampaign).to.be.instanceOf(FavoriteCampaign);
        if (favoriteCampaign.investor) {
          expect(favoriteCampaign.investor).to.be.instanceOf(Investor);
        }
      });
    });
  });

  describe('FetchAll', () => {
    it('Should Fetch All Campaigns', async () => {
      const options = new PaginationOptions();
      const result = await FavoriteCampaignRepository.fetchByCampaign(
        campaign.campaignId,
        options,
      );
      const favoriteCampaign = result.getPaginatedData();
      favoriteCampaign.data.forEach((favoriteCampaign) => {
        expect(favoriteCampaign).to.be.instanceOf(FavoriteCampaign);
      });
    });
  });

  describe('FetchAll by campaign', () => {
    it('Should Fetch All Campaigns', async () => {
      const options = new PaginationOptions();
      const result = await FavoriteCampaignRepository.fetchByCampaign(
        campaign.campaignId,
        options,
      );
      const favoriteCampaign = result.getPaginatedData();
      favoriteCampaign.data.forEach((favoriteCampaign) => {
        expect(favoriteCampaign).to.be.instanceOf(FavoriteCampaign);
      });
    });
  });

  describe('FetchById', () => {
    it('Should Fetch Campaign By Id', async () => {
      const campaign = await FavoriteCampaignRepository.fetchById(
        favoriteCampaign.favoriteCampaignId,
      );
      expect(campaign).to.be.instanceOf(FavoriteCampaign);
    });
  });

  describe('Update', () => {
    it('Should Update Campaign', async () => {
      favoriteCampaign.text = 'kuxh';
      const updateResult = await FavoriteCampaignRepository.update(favoriteCampaign);
      expect(updateResult).to.equal(true);
    });
  });

  describe('Remove', () => {
    it('Should Remove Campaign', async () => {
      const removeResult = await FavoriteCampaignRepository.remove(
        favoriteCampaign,
        true,
      );
      expect(removeResult).to.equal(true);
    });
  });
});
