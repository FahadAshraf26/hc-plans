import DatabaseError from '../Errors/DatabaseError';
import EmployeeMap from '../../Domain/Core/Employee/EmployeeMap';
import PaginationData from '../../Domain/Utils/PaginationData';
import models from '../Model';
import { injectable } from 'inversify';
import { IEmployeeRepository } from '@domain/Core/Employee/IEmployeeRepository';
const { EmployeeModel } = models;

@injectable()
class EmployeeRepository implements IEmployeeRepository {
  async add(employeeEntity) {
    try {
      const employeeObj = EmployeeMap.toPersistence(employeeEntity);

      await EmployeeModel.create(employeeObj);

      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchById(employeeId) {
    try {
      const employeeObj = await EmployeeModel.findOne({
        where: {
          employeeId,
        },
        raw: true,
      });

      if (!employeeObj) {
        return false;
      }

      return EmployeeMap.toDomain(employeeObj);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchAll(issuerId, paginationOptions, options) {
    try {
      const { count, rows } = await EmployeeModel.findAndCountAll({
        where: {
          issuerId,
        },
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        raw: true,
        order: [['createdAt', 'desc']],
      });

      const paginationData = new PaginationData(paginationOptions, count);

      rows.forEach((row) => {
        paginationData.addItem(EmployeeMap.toDomain(row));
      });

      return paginationData;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async update(employeeEntity) {
    try {
      const employeeObj = EmployeeMap.toPersistence(employeeEntity);

      await EmployeeModel.update(employeeObj, {
        where: { employeeId: employeeObj.employeeId },
      });

      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async remove(employeeId) {
    try {
      await EmployeeModel.destroy({
        where: { employeeId },
      });

      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

export default EmployeeRepository;
