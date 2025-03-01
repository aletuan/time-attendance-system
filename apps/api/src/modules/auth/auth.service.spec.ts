import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '../employee/employee.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let employeeService: EmployeeService;
  let jwtService: JwtService;

  const mockEmployeeService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
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
    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
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

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'correctPassword',
    };

    it('should return access token when credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const mockEmployee = {
        id: '123',
        email: loginDto.email,
        password: hashedPassword,
      };
      const mockToken = 'jwt-token';

      mockEmployeeService.findByEmail.mockResolvedValue(mockEmployee);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: mockToken });
      expect(mockEmployeeService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: loginDto.email,
        sub: mockEmployee.id,
      });
    });

    it('should throw UnauthorizedException when employee is not found', async () => {
      mockEmployeeService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockEmployeeService.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockEmployee = {
        id: '123',
        email: loginDto.email,
        password: await bcrypt.hash('differentPassword', 10),
      };

      mockEmployeeService.findByEmail.mockResolvedValue(mockEmployee);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockEmployeeService.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });
  });

  describe('register', () => {
    const createEmployeeDto = {
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      department: 'IT',
      position: 'Developer'
    };

    it('should register a new employee and return access token', async () => {
      const createdEmployee = {
        id: '123',
        ...createEmployeeDto,
        password: 'hashedPassword'
      };
      const mockToken = 'jwt-token';

      mockEmployeeService.create.mockResolvedValue(createdEmployee);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(createEmployeeDto);

      expect(result).toEqual({ access_token: mockToken });
      expect(mockEmployeeService.create).toHaveBeenCalledWith(createEmployeeDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: createdEmployee.email,
        sub: createdEmployee.id,
      });
    });

    it('should pass through any errors from employee creation', async () => {
      const error = new Error('Database error');
      mockEmployeeService.create.mockRejectedValue(error);

      await expect(service.register(createEmployeeDto)).rejects.toThrow(error);
      expect(mockEmployeeService.create).toHaveBeenCalledWith(createEmployeeDto);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });
}); 