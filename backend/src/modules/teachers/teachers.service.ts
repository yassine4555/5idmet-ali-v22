import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserRole } from '../../schemas/user.schema';
import { TeacherProfile } from '../../schemas/teacher-profile.schema';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(TeacherProfile.name) private teacherProfileModel: Model<TeacherProfile>,
  ) {}

  async findAll(query: { search?: string }) {
    const filter: any = { role: UserRole.TEACHER };
    let users = await this.userModel.find(filter).select('-passwordHash').lean().exec();

    if (query.search) {
      const term = query.search.toLowerCase();
      users = users.filter((u) => u.firstName.toLowerCase().includes(term) || u.lastName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    }

    const userIds = users.map((u) => u._id);
    const profiles = await this.teacherProfileModel.find({ userId: { $in: userIds } }).lean().exec();
    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

    return users.map((u) => ({
      id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      avatarUrl: u.avatarUrl,
      profile: profileMap.get((u._id as any).toString()) || null,
    }));
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid teacher ID');
    const user = await this.userModel.findById(id).select('-passwordHash').lean().exec();
    if (!user) throw new NotFoundException('Teacher not found');
    const profile = await this.teacherProfileModel.findOne({ userId: user._id }).lean().exec();
    return { user, profile };
  }

  async createTeacher(dto: { firstName: string; lastName: string; email: string; phone?: string; institutionId?: string; professionalInfo?: any; personalInfo?: any }) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (existing) throw new BadRequestException('A user with this email already exists');

    const institutionId = Types.ObjectId.isValid(dto.institutionId) ? new Types.ObjectId(dto.institutionId) : new Types.ObjectId('000000000000000000000001');

    const user = await this.userModel.create({
      institutionId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email.toLowerCase(),
      passwordHash: 'REPLACE_ME',
      role: UserRole.TEACHER,
      phone: dto.phone,
      status: 'ACTIVE',
    });

    const profile = await this.teacherProfileModel.create({
      userId: user._id,
      institutionId,
      employeeNumber: `T-${new Date().getFullYear()}-${(user._id as any).toString().slice(-4).toUpperCase()}`,
      professionalInfo: dto.professionalInfo || {},
      personalInfo: dto.personalInfo || {},
    });

    return { message: 'Teacher created', user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }, profile };
  }

  async updateTeacher(id: string, dto: any) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid teacher ID');
    const userUpdate: any = {};
    if (dto.firstName) userUpdate.firstName = dto.firstName;
    if (dto.lastName) userUpdate.lastName = dto.lastName;
    if (dto.phone) userUpdate.phone = dto.phone;
    if (dto.status) userUpdate.status = dto.status;

    const user = await this.userModel.findByIdAndUpdate(id, { $set: userUpdate }, { new: true }).select('-passwordHash').lean().exec();
    if (!user) throw new NotFoundException('Teacher not found');

    const profileUpdate: any = {};
    if (dto.personalInfo) profileUpdate.personalInfo = dto.personalInfo;
    if (dto.professionalInfo) profileUpdate.professionalInfo = dto.professionalInfo;
    const profile = await this.teacherProfileModel.findOneAndUpdate({ userId: id }, { $set: profileUpdate }, { new: true, upsert: true }).lean().exec();

    return { message: 'Teacher updated', user, profile };
  }

  async deleteTeacher(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid teacher ID');
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) throw new NotFoundException('Teacher not found');
    await this.teacherProfileModel.findOneAndDelete({ userId: id }).exec();
    return { message: `Teacher ${user.firstName} ${user.lastName} deleted` };
  }
}
