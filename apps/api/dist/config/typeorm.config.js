"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const employee_entity_1 = require("../modules/employee/entities/employee.entity");
const attendance_entity_1 = require("../modules/attendance/entities/attendance.entity");
exports.typeOrmConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'time_attendance',
    entities: [employee_entity_1.Employee, attendance_entity_1.Attendance],
    synchronize: true,
    logging: true,
};
//# sourceMappingURL=typeorm.config.js.map