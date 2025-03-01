import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Employee } from '../modules/employee/entities/employee.entity';
import { Attendance } from '../modules/attendance/entities/attendance.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'time_attendance',
  entities: [Employee, Attendance],
  synchronize: true, // Set to false in production
  logging: true,
}; 