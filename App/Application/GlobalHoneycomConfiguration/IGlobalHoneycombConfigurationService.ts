import AddGlobalHoneycombConfigurationDTO
    from '@application/GlobalHoneycomConfiguration/AddGlobalHoneycombConfigurationDTO';

export const IGlobalHoneycombConfigurationServiceId = Symbol.for('IGlobalHoneycombConfigurationService');

export interface IGlobalHoneycombConfigurationService {
    addHoneycombFee(addGlobalHoneycombFeeDTO: AddGlobalHoneycombConfigurationDTO): Promise<boolean>;

    fetchLatestConfiguration(isMobilePlatform: boolean): Promise<any>;
}
