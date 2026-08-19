import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { TimetableEntry, TimetableEntrySchema } from '../../schemas/timetable.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TimetableEntry.name, schema: TimetableEntrySchema },
    ]),
  ],
  providers: [TimetableService],
  controllers: [TimetableController],
  exports: [TimetableService],
})
export class TimetableModule {}
