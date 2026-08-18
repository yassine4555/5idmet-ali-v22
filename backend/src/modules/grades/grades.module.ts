import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { Grade, GradeSchema } from '../../schemas/grade.schema';
import { StudentProfile, StudentProfileSchema } from '../../schemas/student-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Grade.name, schema: GradeSchema },
      { name: StudentProfile.name, schema: StudentProfileSchema },
    ]),
  ],
  providers: [GradesService],
  controllers: [GradesController],
  exports: [GradesService],
})
export class GradesModule {}
