import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    checkIn(createAttendanceDto: CreateAttendanceDto): Promise<{
        status: string;
        data: import("./entities/attendance.entity").Attendance;
    }>;
    checkOut(id: string): Promise<import("./entities/attendance.entity").Attendance>;
    findByEmployeeId(employeeId: string, startDate: string, endDate: string): Promise<import("./entities/attendance.entity").Attendance[]>;
    findOne(id: string): Promise<import("./entities/attendance.entity").Attendance>;
    findAll(): Promise<import("./entities/attendance.entity").Attendance[]>;
}
