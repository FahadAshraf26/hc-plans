export const IFetchEntitiesFromDatabaseId = Symbol.for('IFetchEntitiesFromDatabase');
export interface IFetchEntitiesFromDatabase{
  fetchEntitiesFromDatabase(dto): Promise<any>;
}