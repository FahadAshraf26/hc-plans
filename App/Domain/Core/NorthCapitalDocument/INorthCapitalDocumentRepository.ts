import { IBaseRepository } from './../BaseEntity/IBaseRepository';

export const INorthCapitalDocumentRepositoryId = Symbol.for('INorthCapitalDocumentRepository') 

export interface INorthCapitalDocumentRepository extends IBaseRepository{
}