import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { ConflictException } from '@nestjs/common';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  const mockEmployee = {
    id: '1',
    employeeId: 'EMP123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    isActive: true,
    department: 'IT',
    position: 'Developer',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockEmployeeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createEmployeeDto = {
      employeeId: 'EMP123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      department: 'IT',
      position: 'Developer'
    };

    it('should create a new employee successfully', async () => {
      mockEmployeeService.create.mockResolvedValue(mockEmployee);

      const result = await controller.create(createEmployeeDto);

      expect(result).toEqual(mockEmployee);
      expect(service.create).toHaveBeenCalledWith(createEmployeeDto);
    });

    it('should throw ConflictException when employee already exists', async () => {
      mockEmployeeService.create.mockRejectedValue(
        new ConflictException('Employee already exists')
      );

      await expect(controller.create(createEmployeeDto))
        .rejects
        .toThrow(ConflictException);
    });
  });
}); 