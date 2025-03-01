import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { EmployeeService } from '../employee/employee.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let repository: Repository<Attendance>;
  let employeeService: EmployeeService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockEmployeeService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getRepositoryToken(Attendance),
          useValue: mockRepository,
        },
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    repository = module.get<Repository<Attendance>>(getRepositoryToken(Attendance));
    employeeService = module.get<EmployeeService>(EmployeeService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkIn', () => {
    it('should create check-in record', async () => {
      const employee = { id: '1', firstName: 'John' };
      const createAttendanceDto = {
        employeeId: '1',
        location: 'Office',
        notes: 'Working on project',
      };

      const now = new Date();
      const attendance = {
        id: '1',
        employee,
        checkIn: now,
        location: 'Office',
        notes: 'Working on project',
        status: 'present',
      };

      mockEmployeeService.findOne.mockResolvedValue(employee);
      mockRepository.create.mockReturnValue(attendance);
      mockRepository.save.mockResolvedValue(attendance);
      mockRepository.findOne.mockResolvedValue(null); // No existing check-in

      const result = await service.checkIn(createAttendanceDto);

      expect(result).toEqual(attendance);
      expect(mockEmployeeService.findOne).toHaveBeenCalledWith('1');
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if employee already checked in today', async () => {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      
      const existingAttendance = {
        id: '1',
        employee: { id: '1', firstName: 'John' },
        checkIn: today,
        checkOut: null,
        status: 'present',
        location: 'Office',
        notes: 'Working on project'
      };

      mockEmployeeService.findOne.mockResolvedValue({ id: '1', firstName: 'John' });
      mockRepository.findOne.mockResolvedValue(existingAttendance);
      
      const checkInDto = { 
        employeeId: '1',
        location: 'Office',
        notes: 'Working on project'
      };

      service.checkIn(checkInDto).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Employee has already checked in today');
      });
      
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if employee not found', async () => {
      mockEmployeeService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.checkIn({ employeeId: '1' }))
        .rejects.toThrow(NotFoundException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('checkOut', () => {
    it('should update check-out time', async () => {
      const attendance = {
        id: '1',
        employee: { id: '1', firstName: 'John' },
        checkIn: new Date(),
        checkOut: null,
      };

      mockRepository.findOne.mockResolvedValue(attendance);
      mockRepository.save.mockImplementation(entity => Promise.resolve(entity));

      const result = await service.checkOut('1');

      expect(result.checkOut).toBeDefined();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['employee'],
      });
    });

    it('should throw error if attendance record not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.checkOut('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw error if already checked out', async () => {
      const attendance = {
        id: '1',
        employee: { id: '1' },
        checkIn: new Date(),
        checkOut: new Date(),
        status: 'completed'
      };

      mockRepository.findOne.mockResolvedValue(attendance);

      await expect(service.checkOut('1')).rejects.toThrow(NotFoundException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findByEmployeeId', () => {
    it('should find attendance records by employee id and date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const attendanceRecords = [
        {
          id: '1',
          employee: { id: '1' },
          checkIn: new Date('2024-01-15'),
        },
        {
          id: '2',
          employee: { id: '1' },
          checkIn: new Date('2024-01-16'),
        },
      ];

      mockRepository.find.mockResolvedValue(attendanceRecords);

      const result = await service.findByEmployeeId('1', startDate, endDate);

      expect(result).toEqual(attendanceRecords);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          employee: { id: '1' },
          checkIn: Between(startDate, endDate),
        },
        relations: ['employee'],
        order: { checkIn: 'DESC' },
      });
    });

    it('should return empty array when no records found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByEmployeeId(
        '1',
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should find attendance record by id', async () => {
      const attendance = {
        id: '1',
        employee: { id: '1', firstName: 'John' },
        checkIn: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(attendance);

      const result = await service.findOne('1');
      expect(result).toEqual(attendance);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['employee'],
      });
    });

    it('should throw NotFoundException when record not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all attendance records', async () => {
      const attendanceRecords = [
        { id: '1', checkIn: new Date() },
        { id: '2', checkIn: new Date() },
      ];

      mockRepository.find.mockResolvedValue(attendanceRecords);

      const result = await service.findAll();
      expect(result).toEqual(attendanceRecords);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['employee'],
        order: { checkIn: 'DESC' },
      });
    });
  });
}); 