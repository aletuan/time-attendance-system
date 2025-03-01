"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const employee_service_1 = require("./employee.service");
const employee_entity_1 = require("./entities/employee.entity");
const common_1 = require("@nestjs/common");
describe('EmployeeService', () => {
    let service;
    let mockRepository;
    let mockBcrypt = {
        hash: jest.fn(),
        compare: jest.fn(),
    };
    const mockEmployee = {
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
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                employee_service_1.EmployeeService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(employee_entity_1.Employee),
                    useValue: mockRepository,
                },
                {
                    provide: 'BCRYPT',
                    useValue: mockBcrypt,
                },
            ],
        }).compile();
        service = module.get(employee_service_1.EmployeeService);
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
            mockRepository.save.mockRejectedValue(new common_1.ConflictException('Employee with this email already exists'));
            await expect(service.create(createEmployeeDto)).rejects.toThrow(common_1.ConflictException);
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
            const deleteResult = { affected: 1, raw: {} };
            mockRepository.delete.mockResolvedValue(deleteResult);
            await service.remove('1');
            expect(mockRepository.delete).toHaveBeenCalledWith('1');
        });
        it('should throw NotFoundException if employee not found', async () => {
            const deleteResult = { affected: 0, raw: {} };
            mockRepository.delete.mockResolvedValue(deleteResult);
            await expect(service.remove('1')).rejects.toThrow(common_1.NotFoundException);
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
//# sourceMappingURL=employee.service.spec.js.map