import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';

@Controller('api/v1/classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  async findAll(@Query('search') search?: string): Promise<any[]> {
    return this.classesService.findAll(search);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    return this.classesService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body()
    body: {
      institutionId?: string;
      name: string;
      level: string;
      academicYear: string;
      mainTeacherId?: string;
      studentIds?: string[];
    },
  ): Promise<{ message: string; classGroup: any }> {
    return this.classesService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      name: string;
      level: string;
      academicYear: string;
      mainTeacherId: string;
      studentIds: string[];
    }>,
  ): Promise<{ message: string; classGroup: any }> {
    return this.classesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string; id: string }> {
    return this.classesService.delete(id);
  }
}
