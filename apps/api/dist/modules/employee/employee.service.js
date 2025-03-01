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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./entities/employee.entity");
const bcrypt = require("bcrypt");
let EmployeeService = class EmployeeService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    async create(createEmployeeDto) {
        const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);
        const employee = this.employeeRepository.create({
            ...createEmployeeDto,
            password: hashedPassword,
        });
        return this.employeeRepository.save(employee);
    }
    async findAll() {
        return this.employeeRepository.find();
    }
    async findOne(id) {
        const employee = await this.employeeRepository.findOne({ where: { id } });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }
    async findByEmail(email) {
        return this.employeeRepository.findOne({ where: { email } });
    }
    async update(id, updateEmployeeDto) {
        const employee = await this.findOne(id);
        if (updateEmployeeDto.password) {
            updateEmployeeDto.password = await bcrypt.hash(updateEmployeeDto.password, 10);
        }
        Object.assign(employee, updateEmployeeDto);
        return this.employeeRepository.save(employee);
    }
    async remove(id) {
        const result = await this.employeeRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map