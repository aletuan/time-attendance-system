import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '../employee/employee.service';
import { LoginDto } from './dto/login.dto';
import { CreateEmployeeDto } from '../employee/dto/create-employee.dto';
export declare class AuthService {
    private employeeService;
    private jwtService;
    constructor(employeeService: EmployeeService, jwtService: JwtService);
    validateEmployee(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    register(createEmployeeDto: CreateEmployeeDto): Promise<{
        access_token: string;
    }>;
}
