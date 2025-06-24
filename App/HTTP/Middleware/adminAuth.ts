import AuthInfrastructureService from '../../Infrastructure/Service/Auth/AuthService';
import AdminUserRepository from '../../Infrastructure/MySQLRepository/AdminUserRepository';
import container from '../../Infrastructure/DIContainer/container';

const authInfrastructureService = container.get<AuthInfrastructureService>(
  AuthInfrastructureService,
);
const adminUserRepository = container.get<AdminUserRepository>(AdminUserRepository);

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    const decoded = await authInfrastructureService.verifyToken(token);
    const adminUser = await adminUserRepository.fetchById(decoded.adminUserId);

    if (!adminUser) {
      throw new Error();
    }

    req.adminUser = adminUser;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Unauthorized' });
  }
};

export default adminAuth;
