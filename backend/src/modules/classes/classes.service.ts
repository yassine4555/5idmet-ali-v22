import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClassGroup } from '../../schemas/class-group.schema';

@Injectable()
export class ClassesService {
  constructor(@InjectModel(ClassGroup.name) private classModel: Model<ClassGroup>) {}

  async findAll(search?: string): Promise<any[]> {
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { level: { $regex: search, $options: 'i' } },
        { academicYear: { $regex: search, $options: 'i' } },
      ];
    }

    const classes = await this.classModel.find(query).lean().exec();
    return classes.map((classGroup) => ({
      ...classGroup,
      studentCount: classGroup.studentIds?.length || 0,
    }));
  }

  async getById(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid class ID');
    const classGroup = await this.classModel.findById(id).lean().exec();
    if (!classGroup) throw new NotFoundException('Class not found');
    return {
      ...classGroup,
      studentCount: classGroup.studentIds?.length || 0,
    };
  }

  async create(dto: {
    institutionId?: string;
    name: string;
    level: string;
    academicYear: string;
    mainTeacherId?: string;
    studentIds?: string[];
  }): Promise<{ message: string; classGroup: any }> {
    const institutionId = Types.ObjectId.isValid(dto.institutionId || '')
      ? new Types.ObjectId(dto.institutionId)
      : new Types.ObjectId('000000000000000000000001');

    const mainTeacherId = dto.mainTeacherId && Types.ObjectId.isValid(dto.mainTeacherId)
      ? new Types.ObjectId(dto.mainTeacherId)
      : undefined;

    const studentIds = (dto.studentIds || [])
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    const classGroup = await this.classModel.create({
      institutionId,
      name: dto.name,
      level: dto.level,
      academicYear: dto.academicYear,
      mainTeacherId,
      studentIds,
    });

    return { message: 'Class created', classGroup };
  }

  async update(
    id: string,
    dto: Partial<{
      name: string;
      level: string;
      academicYear: string;
      mainTeacherId: string;
      studentIds: string[];
    }>,
  ): Promise<{ message: string; classGroup: any }> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid class ID');

    const payload: any = { ...dto };
    if (dto.mainTeacherId !== undefined) {
      payload.mainTeacherId = Types.ObjectId.isValid(dto.mainTeacherId)
        ? new Types.ObjectId(dto.mainTeacherId)
        : null;
    }
    if (dto.studentIds !== undefined) {
      payload.studentIds = dto.studentIds
        .filter((studentId) => Types.ObjectId.isValid(studentId))
        .map((studentId) => new Types.ObjectId(studentId));
    }

    const classGroup = await this.classModel.findByIdAndUpdate(id, { $set: payload }, { new: true }).lean().exec();
    if (!classGroup) throw new NotFoundException('Class not found');
    return { message: 'Class updated', classGroup };
  }

  async delete(id: string): Promise<{ message: string; id: string }> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid class ID');
    const classGroup = await this.classModel.findByIdAndDelete(id).lean().exec();
    if (!classGroup) throw new NotFoundException('Class not found');
    return { message: 'Class deleted', id };
  }
}
