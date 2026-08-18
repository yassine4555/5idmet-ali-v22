import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TimetableEntry } from '../../schemas/timetable.schema';

@Injectable()
export class TimetableService {
  constructor(@InjectModel(TimetableEntry.name) private timetableModel: Model<TimetableEntry>) {}

  async list(filter: { classId?: string; teacherId?: string }) {
    const q: any = {};
    if (filter.classId && Types.ObjectId.isValid(filter.classId)) q.classId = new Types.ObjectId(filter.classId);
    if (filter.teacherId && Types.ObjectId.isValid(filter.teacherId)) q.teacherId = new Types.ObjectId(filter.teacherId);
    return this.timetableModel.find(q).lean().exec();
  }

  async get(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid timetable entry ID');
    const e = await this.timetableModel.findById(id).lean().exec();
    if (!e) throw new NotFoundException('Timetable entry not found');
    return e;
  }

  async create(dto: { classId: string; teacherId: string; subject: string; startTime: string; endTime: string; location?: string; notes?: string }) {
    if (!Types.ObjectId.isValid(dto.classId)) throw new BadRequestException('Invalid class ID');
    if (!Types.ObjectId.isValid(dto.teacherId)) throw new BadRequestException('Invalid teacher ID');

    const entry = await this.timetableModel.create({
      institutionId: new Types.ObjectId('000000000000000000000001'),
      classId: new Types.ObjectId(dto.classId),
      teacherId: new Types.ObjectId(dto.teacherId),
      subject: dto.subject,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
      location: dto.location || '',
      notes: dto.notes || '',
    });

    return { message: 'Timetable entry created', entry };
  }

  async update(id: string, dto: any) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid timetable entry ID');
    const entry = await this.timetableModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean().exec();
    if (!entry) throw new NotFoundException('Timetable entry not found');
    return { message: 'Timetable entry updated', entry };
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid timetable entry ID');
    const e = await this.timetableModel.findByIdAndDelete(id).lean().exec();
    if (!e) throw new NotFoundException('Timetable entry not found');
    return { message: 'Timetable entry deleted', id };
  }
}
