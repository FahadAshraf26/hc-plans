export const IUploadProjectionReturnsId = Symbol.for('IUploadProjectionReturns');
export interface IUploadProjectionReturns {
  importProjectionReturns(projectionReturnsObj: any, email: string): Promise<any>;
}
