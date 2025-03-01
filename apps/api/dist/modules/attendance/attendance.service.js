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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const employee_service_1 = require("../employee/employee.service");
let AttendanceService = class AttendanceService {
    constructor(attendanceRepository, employeeService) {
        this.attendanceRepository = attendanceRepository;
        this.employeeService = employeeService;
    }
    async checkIn(createAttendanceDto) {
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
    async checkOut(id) {
        const attendance = await this.attendanceRepository.findOne({
            where: { id },
            relations: ['employee'],
        });
        if (!attendance) {
            throw new common_1.NotFoundException(`Attendance record with ID ${id} not found`);
        }
        if (attendance.checkOut) {
            throw new common_1.NotFoundException('Employee has already checked out');
        }
        attendance.checkOut = new Date();
        return this.attendanceRepository.save(attendance);
    }
    async findByEmployeeId(employeeId, startDate, endDate) {
        return this.attendanceRepository.find({
            where: {
                employee: { id: employeeId },
                checkIn: (0, typeorm_2.Between)(startDate, endDate),
            },
            relations: ['employee'],
            order: { checkIn: 'DESC' },
        });
    }
    async findOne(id) {
        const attendance = await this.attendanceRepository.findOne({
            where: { id },
            relations: ['employee'],
        });
        if (!attendance) {
            throw new common_1.NotFoundException(`Attendance record with ID ${id} not found`);
        }
        return attendance;
    }
    async findAll() {
        return this.attendanceRepository.find({
            relations: ['employee'],
            order: { checkIn: 'DESC' },
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        employee_service_1.EmployeeService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map