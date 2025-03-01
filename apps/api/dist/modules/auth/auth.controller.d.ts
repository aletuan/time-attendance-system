import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateEmployeeDto } from '../employee/dto/create-employee.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    register(createEmployeeDto: CreateEmployeeDto): Promise<{
        access_token: string;
    }>;
}
