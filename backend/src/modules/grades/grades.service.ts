import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Grade } from '../../schemas/grade.schema';

@Injectable()
export class GradesService {
  constructor(@InjectModel(Grade.name) private gradeModel: Model<Grade>) {}

  async list(filter: { studentId?: string; classId?: string; subject?: string }) {
    const q: any = {};
    if (filter.studentId && Types.ObjectId.isValid(filter.studentId)) q.studentId = new Types.ObjectId(filter.studentId);
    if (filter.classId && Types.ObjectId.isValid(filter.classId)) q.classId = new Types.ObjectId(filter.classId);
    if (filter.subject) q.subject = filter.subject;
    return this.gradeModel.find(q).lean().exec();
  }

  async get(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid grade ID');
    const g = await this.gradeModel.findById(id).lean().exec();
    if (!g) throw new NotFoundException('Grade not found');
    return g;
  }

  async create(dto: { studentId: string; classId: string; subject: string; type: string; score: number; maxScore?: number; teacherId?: string; date?: string; comment?: string }) {
    if (!Types.ObjectId.isValid(dto.studentId)) throw new BadRequestException('Invalid student ID');
    if (!Types.ObjectId.isValid(dto.classId)) throw new BadRequestException('Invalid class ID');

    const grade = await this.gradeModel.create({
      institutionId: new Types.ObjectId('000000000000000000000001'),
      studentId: new Types.ObjectId(dto.studentId),
      classId: new Types.ObjectId(dto.classId),
      subject: dto.subject,
      type: dto.type,
      score: dto.score,
      maxScore: dto.maxScore || 20,
      teacherId: Types.ObjectId.isValid(dto.teacherId) ? new Types.ObjectId(dto.teacherId) : undefined,
      date: dto.date ? new Date(dto.date) : new Date(),
      comment: dto.comment || '',
    });

    return { message: 'Grade saved', grade };
  }

  async update(id: string, dto: any) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid grade ID');
    const grade = await this.gradeModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean().exec();
    if (!grade) throw new NotFoundException('Grade not found');
    return { message: 'Grade updated', grade };
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid grade ID');
    const g = await this.gradeModel.findByIdAndDelete(id).lean().exec();
    if (!g) throw new NotFoundException('Grade not found');
    return { message: 'Grade deleted', id };
  }
}
