import Release from '@domain/Core/Release/Release';

export const IPushUpdateServiceId = Symbol.for('IPushUpdateService');
export interface IPushUpdateService {
  addNewRelease(createNewUpdateDTO): Promise<boolean>;
  getLatestRelease(): Promise<Release>;
}
