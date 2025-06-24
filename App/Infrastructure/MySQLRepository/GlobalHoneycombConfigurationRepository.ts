import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import models from '@infrastructure/Model';
import GlobalHoneycombConfiguration from '@domain/Core/GlobalHoneycombConfiguration/GlobalHoneycombConfiguration';
import {injectable} from 'inversify';
import {IGlobalHoneycombConfigurationRepository} from '@domain/Core/GlobalHoneycombConfiguration/IGlobalHoneycombConfigurationRepository';

const {GlobalHoneycombConfigurationModel} = models;

@injectable()
class GlobalHoneycombConfigurationRepository extends BaseRepository implements IGlobalHoneycombConfigurationRepository {
    constructor() {
        super(GlobalHoneycombConfigurationModel, 'globalHoneycombConfigurationId', GlobalHoneycombConfiguration);
    }

    async fetchLatestRecord() {
        const configuration = await GlobalHoneycombConfigurationModel.findOne({
            order: [['createdAt', 'DESC']]
        });
        return GlobalHoneycombConfiguration.createFromObj(configuration)
    }
}

export default GlobalHoneycombConfigurationRepository;
