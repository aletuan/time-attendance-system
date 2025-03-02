import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let mockRepository: jest.Mocked<Repository<Employee>>;
  let mockBcrypt = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockEmployee: Employee = {
    id: '1',
    employeeId: 'EMP123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    isActive: true,
    department: 'IT',
    position: 'Developer',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockRepository,
        },
        {
          provide: 'BCRYPT',
          useValue: mockBcrypt,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  describe('create', () => {
    const createEmployeeDto = {
      employeeId: 'EMP123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    it('should create a new employee', async () => {
      const hashedPassword = 'hashedPassword123';
      mockRepository.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(mockEmployee);
      mockRepository.save.mockResolvedValue({ ...mockEmployee, password: hashedPassword });

      const result = await service.create(createEmployeeDto);

      expect(result).toBeDefined();
      expect(result.employeeId).toBe(createEmployeeDto.employeeId);
      expect(result.firstName).toBe(createEmployeeDto.firstName);
      expect(result.lastName).toBe(createEmployeeDto.lastName);
      expect(result.email).toBe(createEmployeeDto.email);
      expect(result.password).toBe(hashedPassword);
      expect(result.id).toBeDefined();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmployee);
      mockRepository.create.mockReturnValue(mockEmployee);
      mockRepository.save.mockRejectedValue(new ConflictException('Employee with this email already exists'));

      await expect(service.create(createEmployeeDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      const employees = [mockEmployee];
      mockRepository.find.mockResolvedValue(employees);

      const result = await service.findAll();
      expect(result).toEqual(employees);
    });
  });

  describe('findOne', () => {
    it('should return an employee when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmployee);

      const result = await service.findOne('1');
      
      expect(result).toEqual(mockEmployee);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when employee is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const updateDto = { firstName: 'Jane', department: 'HR' };
      const updatedEmployee = { ...mockEmployee, ...updateDto };
      
      mockRepository.findOne.mockResolvedValue(mockEmployee);
      mockRepository.save.mockResolvedValue(updatedEmployee);

      const result = await service.update('1', updateDto);
      expect(result).toEqual(updatedEmployee);
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      const deleteResult: DeleteResult = { affected: 1, raw: {} };
      mockRepository.delete.mockResolvedValue(deleteResult);

      await service.remove('1');
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if employee not found', async () => {
      const deleteResult: DeleteResult = { affected: 0, raw: {} };
      mockRepository.delete.mockResolvedValue(deleteResult);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should find an employee by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmployee);

      const result = await service.findByEmail('john@example.com');
      expect(result).toEqual(mockEmployee);
    });
  });
}); 