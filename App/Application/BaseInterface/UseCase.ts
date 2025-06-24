export interface UseCase<T, R> {
  execute(dto: T): Promise<R>;
}
