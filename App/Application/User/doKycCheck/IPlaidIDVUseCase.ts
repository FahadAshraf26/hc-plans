export interface IPlaidIDVUseCase {
    execute(params: { userId: string, verificationId: string, requestOrigin: string, ip: string }): Promise<{
      isVerified: boolean;
      status: string;
    }>;
  }
  
  export const IPlaidIDVUseCaseId = Symbol.for('IPlaidIDVUseCase');
  