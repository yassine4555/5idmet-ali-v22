import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { User, UserSchema } from '../../schemas/user.schema';
import { TeacherProfile, TeacherProfileSchema } from '../../schemas/teacher-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TeacherProfile.name, schema: TeacherProfileSchema },
    ]),
  ],
  providers: [TeachersService],
  controllers: [TeachersController],
  exports: [TeachersService],
})
export class TeachersModule {}
