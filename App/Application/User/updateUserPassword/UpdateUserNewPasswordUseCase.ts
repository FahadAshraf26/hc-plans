import {inject, injectable} from 'inversify';

import {IRedisAuthService, IRedisAuthServiceId} from "@infrastructure/Service/RedisAuth/IRedisAuthService";
import {IUpdateUserNewPasswordUseCase} from "@application/User/updateUserPassword/IUpdateUserNewPasswordUseCase";
import {IUserRepository, IUserRepositoryId} from "@domain/Core/User/IUserRepository";
import User from "@domain/Core/User/User";
import UserPassword from "@domain/Users/UserPassword";

@injectable()
class UpdateUserPasswordUseCase implements IUpdateUserNewPasswordUseCase {
    constructor(
        @inject(IRedisAuthServiceId) private redisAuthService: IRedisAuthService,
        @inject(IUserRepositoryId) private userRepository: IUserRepository
    ) {
    }

    async execute({userId, password, ip}) {
        const userPassword = UserPassword.createFromValue({value: password});
        const hashPassword = await userPassword.getHashedValue();
        await this.userRepository.updateUserPassword({userId, password: hashPassword});
        const user = await this.userRepository.fetchById(userId);
        return User.createFromObject(user);
    }
}

export default UpdateUserPasswordUseCase;
