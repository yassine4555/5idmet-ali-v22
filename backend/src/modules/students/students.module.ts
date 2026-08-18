import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentProfile, StudentProfileSchema } from '../../schemas/student-profile.schema';
import { User, UserSchema } from '../../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentProfile.name, schema: StudentProfileSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
