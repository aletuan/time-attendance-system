import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let service: AttendanceService;

  const mockEmployee = {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    department: 'IT',
    position: 'Developer',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockAttendance: Attendance = {
    id: '1',
    employee: mockEmployee,
    checkIn: new Date('2024-03-20T09:00:00Z'),
    checkOut: new Date('2024-03-20T17:00:00Z'),
    status: 'IN_PROGRESS',
    notes: '',
    location: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        {
          provide: AttendanceService,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn()
          },
        },
      ],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should find one attendance record', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockAttendance);

    const result = await controller.findOne('1');

    expect(result).toEqual(mockAttendance);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should find all attendance records', async () => {
    const mockAttendances = [
      mockAttendance,
      {
        ...mockAttendance,
        id: '2',
        employee: { ...mockEmployee, id: '2', employeeId: 'EMP002' },
        checkIn: new Date('2024-03-21T09:00:00Z'),
        checkOut: new Date('2024-03-21T17:00:00Z')
      }
    ];

    jest.spyOn(service, 'findAll').mockResolvedValue(mockAttendances);

    const result = await controller.findAll();

    expect(result).toEqual(mockAttendances);
    expect(service.findAll).toHaveBeenCalled();
    expect(result.length).toBe(2);
  });
});