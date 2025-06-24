import AuthInfrastructureService from '../../Infrastructure/Service/Auth/AuthService';
import AdminUserRepository from '../../Infrastructure/MySQLRepository/AdminUserRepository';
import AdminRoleRepository from '../../Infrastructure/MySQLRepository/AdminRoleRepository';
import container from '../../Infrastructure/DIContainer/container';
import AdminRole from '../../Domain/Core/AdminRole/AdminRole';
import PaginationOptions from '../../Domain/Utils/PaginationOptions';

const authInfrastructureService = container.get<AuthInfrastructureService>(
  AuthInfrastructureService,
);
const adminUserRepository = container.get<AdminUserRepository>(AdminUserRepository);
const adminRoleRepository = container.get<AdminRoleRepository>(AdminRoleRepository);

const superAdminAuth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    const decoded = await authInfrastructureService.verifyToken(token);
    const adminUser = await adminUserRepository.fetchById(decoded.adminUserId);

    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    const adminRoles = await adminRoleRepository.fetchAll({ paginationOptions: new PaginationOptions() });
    const adminRole = adminUser.role as unknown as AdminRole;
    
    const superAdminRole = adminRoles.items.find(role => role.name === 'Super Admin');
    if (!superAdminRole || adminRole.adminRoleId !== superAdminRole.adminRoleId) {
      throw new Error('Super Admin access required');
    }
    req.adminUser = adminUser;
    next();
  } catch (e) {
    res.status(403).send({ error: 'Super Admin access required' });
  }
};

export default superAdminAuth; 