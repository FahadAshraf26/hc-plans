import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class Release extends BaseEntity {
  private readonly releaseId: string;
  private readonly version: string;
  private readonly action: string;
  private readonly description: string;
  constructor(releaseId, version, action, description = null) {
    super();
    this.releaseId = releaseId;
    this.version = version;
    this.action = action;
    this.description = description;
  }

  /**
   *
   * @param {object} releaseObject
   * @returns Release
   */
  static createFromObject(releaseObject): Release {
    const release = new Release(
      releaseObject.releaseId,
      releaseObject.version,
      releaseObject.action,
      releaseObject.description,
    );

    if (releaseObject.createdAt) {
      release.setCreatedAt(releaseObject.createdAt);
    }

    if (releaseObject.updatedAt) {
      release.setUpdatedAt(releaseObject.updatedAt);
    }

    return release;
  }

  /**
   * @param {*} version
   * @param {*} action
   * @param {*} description
   * @returns Release
   */
  static createFromDetail(version, action, description): Release {
    return new Release(uuid(), version, action, description);
  }
}

export default Release;
