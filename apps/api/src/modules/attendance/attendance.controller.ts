import { Controller, Get, Post, Body, Param, UseGuards, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Check in an employee' })
  async checkIn(@Body() createAttendanceDto: CreateAttendanceDto) {
    try {
      const attendance = await this.attendanceService.checkIn(createAttendanceDto);
      return {
        status: 'success',
        data: attendance
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/check-out')
  @ApiOperation({ summary: 'Check out an employee' })
  checkOut(@Param('id') id: string) {
    return this.attendanceService.checkOut(id);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get attendance records for an employee' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  findByEmployeeId(
    @Param('employeeId') employeeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.findByEmployeeId(
      employeeId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an attendance record by id' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records' })
  findAll() {
    return this.attendanceService.findAll();
  }
} 