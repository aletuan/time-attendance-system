import { validate } from 'class-validator';
import { Employee } from './employee.entity';

describe('Employee Entity', () => {
  let employee: Employee;

  beforeEach(() => {
    employee = new Employee();
    employee.employeeId = 'EMP001';
    employee.firstName = 'John';
    employee.lastName = 'Doe';
    employee.email = 'john.doe@company.com';
    employee.password = 'password123';
    employee.department = 'IT';
    employee.position = 'Developer';
  });

  it('should be valid with all required fields', async () => {
    const errors = await validate(employee);
    expect(errors.length).toBe(0);
  });

  it('should be invalid without employeeId', async () => {
    employee.employeeId = '';
    const errors = await validate(employee);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid with incorrect email format', async () => {
    employee.email = 'invalid-email';
    const errors = await validate(employee);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should be invalid with short password', async () => {
    employee.password = '12345';
    const errors = await validate(employee);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });
}); 