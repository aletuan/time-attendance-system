import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '../employee/employee.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let employeeService: EmployeeService;

  const mockEmployeeService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    employeeService = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateEmployee', () => {
    it('should return employee without password if validation is successful', async () => {
      const testPassword = 'testPassword';
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const mockEmployee = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
      };

      mockEmployeeService.findByEmail.mockResolvedValue(mockEmployee);

      const result = await service.validateEmployee('test@example.com', testPassword);

      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
      expect(result.email).toBe(mockEmployee.email);
      expect(mockEmployeeService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null if employee is not found', async () => {
      mockEmployeeService.findByEmail.mockResolvedValue(null);

      const result = await service.validateEmployee('nonexistent@example.com', 'password');

      expect(result).toBeNull();
      expect(mockEmployeeService.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });

    it('should return null if password is incorrect', async () => {
      const mockEmployee = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('correctPassword', 10),
      };

      mockEmployeeService.findByEmail.mockResolvedValue(mockEmployee);

      const result = await service.validateEmployee('test@example.com', 'wrongPassword');

      expect(result).toBeNull();
      expect(mockEmployeeService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
}); 