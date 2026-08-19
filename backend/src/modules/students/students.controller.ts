import { Controller, Get, Post, Put, Delete, Param, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('api/v1/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // GET /api/v1/students?search=&status=&level=
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('classId') classId?: string,
    @Query('level') level?: string,
  ) {
    return this.studentsService.findAll({ search, status, classId, level });
  }

  // GET /api/v1/students/:id/profile
  @Get(':id/profile')
  async getProfile(@Param('id') id: string) {
    return this.studentsService.getProfile(id);
  }

  // POST /api/v1/students
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStudent(@Body() body: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    institutionId?: string;
    personalInfo?: any;
    academicInfo?: any;
    medicalInfo?: any;
    financialInfo?: any;
  }) {
    return this.studentsService.createStudent({
      ...body,
      institutionId: body.institutionId || '000000000000000000000001',
    });
  }

  // PUT /api/v1/students/:id
  @Put(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body() body: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      status?: string;
      currentClassId?: string | null;
      personalInfo?: any;
      academicInfo?: any;
      medicalInfo?: any;
      financialInfo?: any;
    },
  ) {
    return this.studentsService.updateStudent(id, body);
  }

  // DELETE /api/v1/students/:id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteStudent(@Param('id') id: string) {
    return this.studentsService.deleteStudent(id);
  }
}
