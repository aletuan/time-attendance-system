import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let service: AttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        {
          provide: AttendanceService,
          useValue: {
            findOne: jest.fn()
          },
        },
      ],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should find one attendance record', async () => {
    const mockAttendance: Attendance = {
      id: '1',
      employee: {
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
      },
      checkIn: new Date('2024-03-20T09:00:00Z'),
      checkOut: new Date('2024-03-20T17:00:00Z'),
      status: 'IN_PROGRESS',
      notes: '',
      location: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(mockAttendance);

    const result = await controller.findOne('1');

    expect(result).toEqual(mockAttendance);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });
});