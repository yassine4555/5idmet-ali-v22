import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { TeachersService } from './teachers.service';

@Controller('api/v1/teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.teachersService.findAll({ search });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.teachersService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: { firstName: string; lastName: string; email: string; phone?: string; institutionId?: string; professionalInfo?: any; personalInfo?: any }) {
    return this.teachersService.createTeacher(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.teachersService.updateTeacher(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.teachersService.deleteTeacher(id);
  }
}
