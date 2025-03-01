import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmployeeService } from '../employee/employee.service';
import { LoginDto } from './dto/login.dto';
import { CreateEmployeeDto } from '../employee/dto/create-employee.dto';

@Injectable()
export class AuthService {
  constructor(
    private employeeService: EmployeeService,
    private jwtService: JwtService,
  ) {}

  async validateEmployee(email: string, password: string): Promise<any> {
    const employee = await this.employeeService.findByEmail(email);
    if (employee && (await bcrypt.compare(password, employee.password))) {
      const { password, ...result } = employee;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const employee = await this.employeeService.findByEmail(loginDto.email);
    if (!employee) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      employee.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: employee.email, sub: employee.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createEmployeeDto: CreateEmployeeDto) {
    const employee = await this.employeeService.create(createEmployeeDto);
    const payload = { email: employee.email, sub: employee.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
} 