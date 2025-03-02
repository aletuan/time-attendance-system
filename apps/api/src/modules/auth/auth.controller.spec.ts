import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateEmployeeDto } from '../employee/dto/create-employee.dto';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '../employee/employee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee } from '../employee/entities/employee.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock data
  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockCreateEmployeeDto: CreateEmployeeDto = {
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    department: 'IT',
    position: 'Developer',
  };

  const mockAccessToken = { access_token: 'mock-jwt-token' };

  // Mock services
  const mockAuthService = {
    login: jest.fn().mockImplementation((dto) => Promise.resolve(mockAccessToken)),
    register: jest.fn().mockImplementation((dto) => Promise.resolve(mockAccessToken)),
  };

  const mockEmployeeService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockEmployeeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(Employee),
          useValue: mockEmployeeRepository,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token when login is successful', async () => {
      // Arrange
      jest.spyOn(authService, 'login').mockResolvedValue(mockAccessToken);

      // Act
      const result = await controller.login(mockLoginDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(mockAccessToken);
      expect(result).toHaveProperty('access_token');
    });

    it('should call authService.login with the login DTO', async () => {
      // Act
      await controller.login(mockLoginDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });
  });

  describe('register', () => {
    it('should return an access token when registration is successful', async () => {
      // Arrange
      jest.spyOn(authService, 'register').mockResolvedValue(mockAccessToken);

      // Act
      const result = await controller.register(mockCreateEmployeeDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(mockCreateEmployeeDto);
      expect(result).toEqual(mockAccessToken);
      expect(result).toHaveProperty('access_token');
    });

    it('should call authService.register with the create employee DTO', async () => {
      // Act
      await controller.register(mockCreateEmployeeDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(mockCreateEmployeeDto);
    });
  });
}); 