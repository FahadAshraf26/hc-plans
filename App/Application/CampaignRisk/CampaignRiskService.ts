import HttpException from '../../Infrastructure/Errors/HttpException';
import GeneralIndustryRisks, {
    replaceBusinessName,
} from '@domain/Utils/GeneralIndustryRisks';
import CampaignRisk from '../../Domain/Core/CampaignRisk/CampaignRisk';
import CreateCampaignRiskDTO from './CreateCampaignRiskDTO';
import FindCampaignRiskDTO from './FindCampaignRiskDTO';
import GetCampaignRiskDTO from './GetCampaignRiskDTO';
import RemoveCampaignRiskDTO from './RemoveCampaignRiskDTO';
import UpdateCampaignRiskDTO from './UpdateCampaignRiskDTO';
import {injectable, inject} from 'inversify';
import {
    ICampaignRiskRepository,
    ICampaignRiskRepositoryId,
} from '@domain/Core/CampaignRisk/ICampaignRiskRepository';
import {ICampaignRiskService} from './ICampaignRiskService';
import {
    ICampaignRepository,
    ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';

@injectable()
class CampaignRiskService implements ICampaignRiskService {
    constructor(
        @inject(ICampaignRiskRepositoryId)
        private campaignRiskRepository: ICampaignRiskRepository,
        @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    ) {
    }

    /**
     *
     * @param {CreateCampaignRiskDTO} createCampaignRiskDTO
     * @return {Promise<boolean>}
     */
    async createCampaignRisk(createCampaignRiskDTO: CreateCampaignRiskDTO) {
        const createResult = await this.campaignRiskRepository.add(
            createCampaignRiskDTO.getCampaignRisk(),
        );

        if (!createResult) {
            throw new HttpException(400, 'Unable to create campaignRisk');
        }

        return createResult;
    }

    /**
     *
     * @param {GetCampaignRiskDTO} getCampaignRiskDTO
     * @return {Promise<{data: ([]|*[]), paginationInfo: {totalItems: *, totalPages: number, currentPage: number}}>}
     */
    async getCampaignRisk(getCampaignRiskDTO: GetCampaignRiskDTO) {
        const result = await this.campaignRiskRepository.fetchByCampaign(
            getCampaignRiskDTO.getCampaignId(),
            getCampaignRiskDTO.getPaginationOptions(),
            {
                showTrashed: getCampaignRiskDTO.isShowTrashed(),
                query: getCampaignRiskDTO.getQuery(),
            },
        );

        return result.getPaginatedData();
    }

    async findCampaignRisk(findCampaignRiskDTO: FindCampaignRiskDTO) {
        const campaignRisk = await this.campaignRiskRepository.fetchById(
            findCampaignRiskDTO.getCampaignRiskId(),
        );

        if (!campaignRisk) {
            throw new HttpException(
                404,
                'No campaign risk record exists against the provided input',
            );
        }

        return campaignRisk;
    }

    /**
     *
     * @param {UpdateCampaignRiskDTO} updateCampaignRiskDTO
     * @return {Promise<*>}
     */
    async updateCampaignRisk(updateCampaignRiskDTO: UpdateCampaignRiskDTO) {
        const campaignRisk = await this.campaignRiskRepository.fetchById(
            updateCampaignRiskDTO.getCampaignRiskId(),
        );

        if (!campaignRisk) {
            throw new HttpException(
                404,
                'No CampaignRisk record exists against the provided input',
            );
        }
        const updateResult = await this.campaignRiskRepository.update(
            updateCampaignRiskDTO.getCampaignRisk(),
        );

        if (!updateResult) {
            throw new HttpException(400, 'Campaign Risk update failed');
        }

        return updateResult;
    }

    async removeCampaignRisk(removeCampaignRiskDTO: RemoveCampaignRiskDTO) {
        const campaignRisk = await this.campaignRiskRepository.fetchById(
            removeCampaignRiskDTO.getCampaignRiskId(),
        );

        if (!campaignRisk) {
            throw new HttpException(
                404,
                'No CampaignRisk record exists against the provided input',
            );
        }

        const removeResult = await this.campaignRiskRepository.remove(
            campaignRisk,
            removeCampaignRiskDTO.shouldHardDeleted(),
        );

        if (!removeResult) {
            throw new HttpException(400, 'Campaign Risk deleted failed');
        }

        return removeResult;
    }

    async recreateRisks(campaignId: string) {
        if (!campaignId) {
            throw Error('campaignId cannot be empty');
        }

        const campaign = await this.campaignRepository.fetchById(campaignId);

        if (!campaign) {
            throw Error('campaign does not exist');
        }

        // delete previous risks
        await this.campaignRiskRepository.removeByCampaign(campaignId);

        // create new risks
        const issuer = campaign.issuer;

        const campaignRisks = GeneralIndustryRisks.map((generalRisk) =>
            CampaignRisk.createFromDetail(
                campaignId,
                generalRisk.riskTitle,
                replaceBusinessName(issuer.issuerName, generalRisk.riskDescription),
            ),
        );

        const createResult = await this.campaignRiskRepository.addBulk(campaignRisks);

        if (!createResult) {
            throw new HttpException(400, 'Unable to create campaignRisk');
        }

        return createResult;
    }
}

export default CampaignRiskService;
