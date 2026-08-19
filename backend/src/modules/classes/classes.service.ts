import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClassGroup } from '../../schemas/class-group.schema';
import { StudentProfile } from '../../schemas/student-profile.schema';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(ClassGroup.name) private classModel: Model<ClassGroup>,
    @InjectModel(StudentProfile.name) private studentProfileModel: Model<StudentProfile>,
  ) {}

  async findAll(search?: string): Promise<any[]> {
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { level: { $regex: search, $options: 'i' } },
        { academicYear: { $regex: search, $options: 'i' } },
      ];
    }

    const classes = await this.classModel
      .find(query)
      .populate('mainTeacherId', 'firstName lastName email')
      .lean()
      .exec();

    return classes.map((classGroup) => ({
      ...classGroup,
      studentCount: classGroup.studentIds?.length || 0,
    }));
  }

  async getById(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid class ID');
    const classGroup = await this.classModel
      .findById(id)
      .populate('mainTeacherId', 'firstName lastName email')
      .lean()
      .exec();
    if (!classGroup) throw new NotFoundException('Class not found');

    // Fetch students enrolled in this class from StudentProfile (source of truth)
    const enrolledProfiles = await this.studentProfileModel
      .find({ currentClassId: classGroup._id })
      .populate('userId', 'firstName lastName email status')
      .lean()
      .exec();

    return {
      ...classGroup,
      studentCount: enrolledProfiles.length,
      students: enrolledProfiles.map((p) => ({
        profileId: p._id,
        userId: p.userId,
        registrationId: p.studentRegistrationId,
      })),
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

    // Sync StudentProfile.currentClassId for initially enrolled students
    if (studentIds.length > 0) {
      await this.studentProfileModel.updateMany(
        { userId: { $in: studentIds } },
        { $set: { currentClassId: classGroup._id } },
      ).exec();
    }

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

    const payload: any = {};
    if (dto.name !== undefined) payload.name = dto.name;
    if (dto.level !== undefined) payload.level = dto.level;
    if (dto.academicYear !== undefined) payload.academicYear = dto.academicYear;

    if (dto.mainTeacherId !== undefined) {
      payload.mainTeacherId = Types.ObjectId.isValid(dto.mainTeacherId)
        ? new Types.ObjectId(dto.mainTeacherId)
        : null;
    }

    if (dto.studentIds !== undefined) {
      const newStudentIds = dto.studentIds
        .filter((sid) => Types.ObjectId.isValid(sid))
        .map((sid) => new Types.ObjectId(sid));

      payload.studentIds = newStudentIds;

      // Get the old student list to compute diff
      const existing = await this.classModel.findById(id).select('studentIds').lean().exec();
      const oldIds = (existing?.studentIds || []).map((sid: any) => sid.toString());
      const newIds = newStudentIds.map((sid) => sid.toString());

      const added = newIds.filter((sid) => !oldIds.includes(sid));
      const removed = oldIds.filter((sid) => !newIds.includes(sid));

      // Set currentClassId for newly added students
      if (added.length > 0) {
        await this.studentProfileModel.updateMany(
          { userId: { $in: added.map((sid) => new Types.ObjectId(sid)) } },
          { $set: { currentClassId: new Types.ObjectId(id) } },
        ).exec();
      }

      // Clear currentClassId for removed students
      if (removed.length > 0) {
        await this.studentProfileModel.updateMany(
          { userId: { $in: removed.map((sid) => new Types.ObjectId(sid)) }, currentClassId: new Types.ObjectId(id) },
          { $unset: { currentClassId: '' } },
        ).exec();
      }
    }

    const classGroup = await this.classModel.findByIdAndUpdate(id, { $set: payload }, { new: true })
      .populate('mainTeacherId', 'firstName lastName email')
      .lean()
      .exec();
    if (!classGroup) throw new NotFoundException('Class not found');
    return { message: 'Class updated', classGroup };
  }

  async delete(id: string): Promise<{ message: string; id: string }> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid class ID');
    const classGroup = await this.classModel.findByIdAndDelete(id).lean().exec();
    if (!classGroup) throw new NotFoundException('Class not found');

    // Cascade: clear currentClassId for all students enrolled in this class
    await this.studentProfileModel.updateMany(
      { currentClassId: new Types.ObjectId(id) },
      { $unset: { currentClassId: '' } },
    ).exec();

    return { message: 'Class deleted', id };
  }
}
