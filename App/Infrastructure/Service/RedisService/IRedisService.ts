export const IRedisServiceId = Symbol.for('IRedisService');
export interface IRedisService {
  start();
  set(key?, data?, setExpiry?, seconds?): Promise<any>;
  get(key): Promise<any>;
  delete(key): Promise<any>;
  addSMembers(key, data, setExpiry, seconds): Promise<any>;
  getSMembers(key): Promise<any>;
  expire(key, ttl): Promise<any>;
  getAllkeys(pattern): Promise<any>;
  count(keys): Promise<any>;
  exists(key): Promise<any>;
  getOne(key): Promise<any>;
  getAllKeyValue(wildcard): Promise<any>;
  setWithExpiry(key, data, expiryTime);
  testConnection(): Promise<any>;
}
