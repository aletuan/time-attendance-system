"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const employee_service_1 = require("../employee/employee.service");
let AuthService = class AuthService {
    constructor(employeeService, jwtService) {
        this.employeeService = employeeService;
        this.jwtService = jwtService;
    }
    async validateEmployee(email, password) {
        const employee = await this.employeeService.findByEmail(email);
        if (employee && (await bcrypt.compare(password, employee.password))) {
            const { password, ...result } = employee;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const employee = await this.employeeService.findByEmail(loginDto.email);
        if (!employee) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, employee.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { email: employee.email, sub: employee.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(createEmployeeDto) {
        const employee = await this.employeeService.create(createEmployeeDto);
        const payload = { email: employee.email, sub: employee.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map