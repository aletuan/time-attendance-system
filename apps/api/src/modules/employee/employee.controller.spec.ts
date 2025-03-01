import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

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

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      const mockEmployees = [mockEmployee];
      mockEmployeeService.findAll.mockResolvedValue(mockEmployees);

      const result = await controller.findAll();

      expect(result).toEqual(mockEmployees);
      expect(mockEmployeeService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single employee', async () => {
      const id = '1';
      mockEmployeeService.findOne.mockResolvedValue(mockEmployee);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockEmployee);
      expect(mockEmployeeService.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when employee is not found', async () => {
      const id = 'non-existent-id';
      mockEmployeeService.findOne.mockRejectedValue(new NotFoundException('Employee not found'));

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
      expect(mockEmployeeService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    const updateDto = {
      firstName: 'Updated',
      lastName: 'Employee',
      department: 'IT',
      position: 'Senior Developer'
    };

    it('should update an employee successfully', async () => {
      const id = '1';
      const updatedEmployee = { ...mockEmployee, ...updateDto };
      mockEmployeeService.update.mockResolvedValue(updatedEmployee);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(updatedEmployee);
      expect(mockEmployeeService.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should throw NotFoundException when updating non-existent employee', async () => {
      const id = 'non-existent-id';
      mockEmployeeService.update.mockRejectedValue(new NotFoundException('Employee not found'));

      await expect(controller.update(id, updateDto)).rejects.toThrow(NotFoundException);
      expect(mockEmployeeService.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an employee successfully', async () => {
      const id = '1';
      mockEmployeeService.remove.mockResolvedValue(mockEmployee);

      const result = await controller.remove(id);

      expect(result).toEqual(mockEmployee);
      expect(mockEmployeeService.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when removing non-existent employee', async () => {
      const id = 'non-existent-id';
      mockEmployeeService.remove.mockRejectedValue(new NotFoundException('Employee not found'));

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
      expect(mockEmployeeService.remove).toHaveBeenCalledWith(id);
    });
  });
}); 