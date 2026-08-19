import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StudentProfile } from '../../schemas/student-profile.schema';
import { User, UserRole } from '../../schemas/user.schema';
import { ClassGroup } from '../../schemas/class-group.schema';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(StudentProfile.name) private studentProfileModel: Model<StudentProfile>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(ClassGroup.name) private classGroupModel: Model<ClassGroup>,
    private configService: ConfigService,
  ) {}

  // ─── READ: List all students with optional filters ───────────────────────
  async findAll(query: { search?: string; status?: string; classId?: string; level?: string }) {
    const filter: any = { role: UserRole.STUDENT };
    if (query.status && query.status !== 'ALL') filter.status = query.status;

    let users = await this.userModel.find(filter).select('-passwordHash').lean().exec();

    if (query.search) {
      const term = query.search.toLowerCase();
      users = users.filter(
        (u) =>
          u.firstName.toLowerCase().includes(term) ||
          u.lastName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term),
      );
    }

    const userIds = users.map((u) => u._id);
    const profiles = await this.studentProfileModel.find({ userId: { $in: userIds } }).lean().exec();
    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

    return users.map((u) => {
      const p = profileMap.get((u._id as any).toString());

      // ─── Filter by classId using StudentProfile.currentClassId ───
      if (query.classId && Types.ObjectId.isValid(query.classId)) {
        if (!p?.currentClassId || p.currentClassId.toString() !== query.classId) return null;
      }

      const gradeLevel = p?.academicInfo?.currentGradeLevel || 'Non assigné';
      const matchesLevel = !query.level || gradeLevel.includes(query.level);
      if (!matchesLevel) return null;

      return {
        id: u._id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        status: u.status,
        avatarUrl: u.avatarUrl,
        registrationId: p?.studentRegistrationId || `EDU-${(u._id as any).toString().slice(-6).toUpperCase()}`,
        currentGradeLevel: gradeLevel,
        currentClassId: p?.currentClassId || null,
        gpa: p?.academicInfo?.currentGPA || 0,
        paymentStatus: p?.financialInfo?.accountBalance != null && (p.financialInfo.accountBalance as number) < 0 ? 'OVERDUE' : 'PAID',
      };
    }).filter(Boolean);
  }

  // ─── READ: Single student full 4-tab profile ────────────────────────────
  async getProfile(userId: string) {
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid student ID');
    const user = await this.userModel.findById(userId).select('-passwordHash').lean().exec();
    if (!user) throw new NotFoundException('Student not found');

    const profile = await this.studentProfileModel.findOne({ userId: user._id }).lean().exec();

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        status: user.status,
      },
      profile: profile || null,
    };
  }

  // ─── CREATE: Enroll a new student ───────────────────────────────────────
  async createStudent(dto: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    institutionId: string;
    personalInfo?: any;
    academicInfo?: any;
    medicalInfo?: any;
    financialInfo?: any;
  }) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (existing) throw new BadRequestException('A user with this email already exists');

    const institutionId = Types.ObjectId.isValid(dto.institutionId)
      ? new Types.ObjectId(dto.institutionId)
      : new Types.ObjectId('000000000000000000000001'); // default institution

    // Determine a temporary initial password for the new user. Prefer an admin-provided default via env.
    const configuredDefault = this.configService.get<string>('NEW_USER_DEFAULT_PASSWORD');
    const plainPassword = configuredDefault || crypto.randomBytes(6).toString('hex');
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const user = await this.userModel.create({
      institutionId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email.toLowerCase(),
      passwordHash,
      role: UserRole.STUDENT,
      phone: dto.phone,
      status: 'ACTIVE',
    });

    const regId = `EDU-${new Date().getFullYear()}-${(user._id as any).toString().slice(-4).toUpperCase()}`;

    const profile = await this.studentProfileModel.create({
      userId: user._id,
      institutionId,
      studentRegistrationId: regId,
      personalInfo: dto.personalInfo || {},
      academicInfo: dto.academicInfo || { currentGradeLevel: 'Non assigné', currentGPA: 0 },
      medicalInfo: dto.medicalInfo || {},
      financialInfo: dto.financialInfo || { accountBalance: 0, paymentPlan: 'TRIMESTRIAL' },
    });

    return {
      message: 'Student enrolled successfully',
      // return the temporary password when available so admins can communicate credentials to students/parents.
      tempPassword: plainPassword,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, status: user.status },
      profile: { id: profile._id, registrationId: regId },
    };
  }

  // ─── UPDATE: Edit student user + profile tabs ────────────────────────────
  async updateStudent(userId: string, dto: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    status?: string;
    currentClassId?: string | null;
    personalInfo?: any;
    academicInfo?: any;
    medicalInfo?: any;
    financialInfo?: any;
  }) {
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid student ID');

    const userUpdate: any = {};
    if (dto.firstName) userUpdate.firstName = dto.firstName;
    if (dto.lastName) userUpdate.lastName = dto.lastName;
    if (dto.phone) userUpdate.phone = dto.phone;
    if (dto.status) userUpdate.status = dto.status;

    const user = await this.userModel.findByIdAndUpdate(userId, { $set: userUpdate }, { new: true }).select('-passwordHash').lean().exec();
    if (!user) throw new NotFoundException('Student not found');

    const profileUpdate: any = {};
    if (dto.personalInfo) profileUpdate.personalInfo = dto.personalInfo;
    if (dto.academicInfo) profileUpdate.academicInfo = dto.academicInfo;
    if (dto.medicalInfo) profileUpdate.medicalInfo = dto.medicalInfo;
    if (dto.financialInfo) profileUpdate.financialInfo = dto.financialInfo;

    // ─── Enrollment: update currentClassId and sync ClassGroup.studentIds ───
    if (dto.currentClassId !== undefined) {
      const oldProfile = await this.studentProfileModel.findOne({ userId }).select('currentClassId').lean().exec();
      const oldClassId = oldProfile?.currentClassId?.toString();
      const newClassId = dto.currentClassId && Types.ObjectId.isValid(dto.currentClassId) ? dto.currentClassId : null;

      if (oldClassId && oldClassId !== newClassId) {
        // Remove from old class's studentIds
        await this.classGroupModel.findByIdAndUpdate(oldClassId, {
          $pull: { studentIds: new Types.ObjectId(userId) },
        }).exec();
      }

      if (newClassId) {
        profileUpdate.currentClassId = new Types.ObjectId(newClassId);
        // Add to new class's studentIds (avoid duplicates with $addToSet)
        await this.classGroupModel.findByIdAndUpdate(newClassId, {
          $addToSet: { studentIds: new Types.ObjectId(userId) },
        }).exec();
      } else {
        profileUpdate.currentClassId = null;
      }
    }

    const profile = await this.studentProfileModel.findOneAndUpdate(
      { userId },
      { $set: profileUpdate },
      { new: true, upsert: true },
    ).lean().exec();

    return { message: 'Student updated successfully', user, profile };
  }

  // ─── DELETE: Remove student + profile ───────────────────────────────────
  async deleteStudent(userId: string) {
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid student ID');

    // Get profile first to find current class before deleting
    const profile = await this.studentProfileModel.findOne({ userId }).select('currentClassId').lean().exec();

    const user = await this.userModel.findByIdAndDelete(userId).exec();
    if (!user) throw new NotFoundException('Student not found');

    await this.studentProfileModel.findOneAndDelete({ userId }).exec();

    // Cascade: remove this student from their class's studentIds array
    if (profile?.currentClassId) {
      await this.classGroupModel.findByIdAndUpdate(profile.currentClassId, {
        $pull: { studentIds: new Types.ObjectId(userId) },
      }).exec();
    }

    return { message: `Student ${user.firstName} ${user.lastName} deleted successfully` };
  }
}
