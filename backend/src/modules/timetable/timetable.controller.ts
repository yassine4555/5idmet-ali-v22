import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { TimetableService } from './timetable.service';

@Controller('api/v1/timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  async list(@Query('classId') classId?: string, @Query('teacherId') teacherId?: string) {
    return this.timetableService.list({ classId, teacherId });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.timetableService.get(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: { classId: string; teacherId: string; subject: string; startTime: string; endTime: string; location?: string; notes?: string }) {
    return this.timetableService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.timetableService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.timetableService.delete(id);
  }
}
