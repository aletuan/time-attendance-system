import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private employeeService: EmployeeService,
  ) {}

  async checkIn(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const employee = await this.employeeService.findOne(createAttendanceDto.employeeId);
    
    const attendance = this.attendanceRepository.create({
      employee,
      checkIn: new Date(),
      notes: createAttendanceDto.notes,
      location: createAttendanceDto.location,
      status: createAttendanceDto.status || 'present',
    });

    return this.attendanceRepository.save(attendance);
  }

  async checkOut(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    if (attendance.checkOut) {
      throw new NotFoundException('Employee has already checked out');
    }

    attendance.checkOut = new Date();
    return this.attendanceRepository.save(attendance);
  }

  async findByEmployeeId(employeeId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: {
        employee: { id: employeeId },
        checkIn: Between(startDate, endDate),
      },
      relations: ['employee'],
      order: { checkIn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    return attendance;
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['employee'],
      order: { checkIn: 'DESC' },
    });
  }
} 