import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassGroup, ClassGroupSchema } from '../../schemas/class-group.schema';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ClassGroup.name, schema: ClassGroupSchema }]),
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}

