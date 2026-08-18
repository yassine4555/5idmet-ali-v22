import { Controller, Get, Post, Put, Delete, Param, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GradesService } from './grades.service';

@Controller('api/v1/grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  async list(@Query('studentId') studentId?: string, @Query('classId') classId?: string, @Query('subject') subject?: string) {
    return this.gradesService.list({ studentId, classId, subject });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.gradesService.get(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: { studentId: string; classId: string; subject: string; type: string; score: number; maxScore?: number; teacherId?: string; date?: string; comment?: string }) {
    return this.gradesService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.gradesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.gradesService.delete(id);
  }
}
