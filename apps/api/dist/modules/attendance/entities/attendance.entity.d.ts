import { Employee } from '../../employee/entities/employee.entity';
export declare class Attendance {
    id: string;
    employee: Employee;
    checkIn: Date;
    checkOut: Date;
    notes: string;
    location: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
