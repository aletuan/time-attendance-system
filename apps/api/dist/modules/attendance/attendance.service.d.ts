import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { EmployeeService } from '../employee/employee.service';
export declare class AttendanceService {
    private attendanceRepository;
    private employeeService;
    constructor(attendanceRepository: Repository<Attendance>, employeeService: EmployeeService);
    checkIn(createAttendanceDto: CreateAttendanceDto): Promise<Attendance>;
    checkOut(id: string): Promise<Attendance>;
    findByEmployeeId(employeeId: string, startDate: Date, endDate: Date): Promise<Attendance[]>;
    findOne(id: string): Promise<Attendance>;
    findAll(): Promise<Attendance[]>;
}
