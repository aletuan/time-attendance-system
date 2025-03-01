"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const employee_entity_1 = require("./employee.entity");
describe('Employee Entity', () => {
    let employee;
    beforeEach(() => {
        employee = new employee_entity_1.Employee();
        employee.employeeId = 'EMP001';
        employee.firstName = 'John';
        employee.lastName = 'Doe';
        employee.email = 'john.doe@company.com';
        employee.password = 'password123';
        employee.department = 'IT';
        employee.position = 'Developer';
    });
    it('should be valid with all required fields', async () => {
        const errors = await (0, class_validator_1.validate)(employee);
        expect(errors.length).toBe(0);
    });
    it('should be invalid without employeeId', async () => {
        employee.employeeId = '';
        const errors = await (0, class_validator_1.validate)(employee);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
    it('should be invalid with incorrect email format', async () => {
        employee.email = 'invalid-email';
        const errors = await (0, class_validator_1.validate)(employee);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isEmail');
    });
    it('should be invalid with short password', async () => {
        employee.password = '12345';
        const errors = await (0, class_validator_1.validate)(employee);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('minLength');
    });
});
//# sourceMappingURL=employee.entity.spec.js.map