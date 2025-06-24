export const INachaServiceId = Symbol.for('INachaService');

export interface INachaService{
  createNachaFile(data: any, fileName: string):Promise<{filePath: string}>;
}
