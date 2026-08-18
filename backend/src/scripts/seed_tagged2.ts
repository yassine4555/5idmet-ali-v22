import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

import { User, UserSchema, UserRole } from '../schemas/user.schema';
import { StudentProfile, StudentProfileSchema } from '../schemas/student-profile.schema';
import { TeacherProfile, TeacherProfileSchema } from '../schemas/teacher-profile.schema';
import { ClassGroup, ClassGroupSchema } from '../schemas/class-group.schema';
import { Grade, GradeSchema } from '../schemas/grade.schema';
import { TimetableEntry, TimetableEntrySchema } from '../schemas/timetable.schema';
import { Invoice, InvoiceSchema, InvoiceStatus } from '../schemas/invoice.schema';
import { Institution, InstitutionSchema, InstitutionType } from '../schemas/institution.schema';

function loadEnv(envPath: string) {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) return;
    let [, key, val] = m;
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    process.env[key] = val;
  });
}

async function recordSeed(conn: mongoose.Connection, seedTag: string, collection: string, docId: any, operation: string) {
  try {
    await conn.collection('seed_metadata').insertOne({ seedTag, collection, docId: typeof docId === 'object' && docId._id ? docId._id : docId, operation, ts: new Date() });
  } catch (err) {
    console.error('Failed to record seed metadata', err && (err as any).message);
  }
}

async function main() {
  loadEnv(path.resolve(__dirname, '..', '..', '.env'));
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found. Aborting.');
    process.exit(1);
  }

  const seedTag = `seed-metadata-${new Date().toISOString()}`;
  console.log('SeedTag:', seedTag);

  await mongoose.connect(uri, { dbName: 'edupro' });
  const conn = mongoose.connection;

  const UserModel = conn.model<User & mongoose.Document>('User', UserSchema);
  const StudentProfileModel = conn.model<StudentProfile & mongoose.Document>('StudentProfile', StudentProfileSchema);
  const TeacherProfileModel = conn.model<TeacherProfile & mongoose.Document>('TeacherProfile', TeacherProfileSchema);
  const ClassGroupModel = conn.model<ClassGroup & mongoose.Document>('ClassGroup', ClassGroupSchema);
  const GradeModel = conn.model<Grade & mongoose.Document>('Grade', GradeSchema);
  const TimetableModel = conn.model<TimetableEntry & mongoose.Document>('TimetableEntry', TimetableEntrySchema);
  const InvoiceModel = conn.model<Invoice & mongoose.Document>('Invoice', InvoiceSchema);
  const InstitutionModel = conn.model<Institution & mongoose.Document>('Institution', InstitutionSchema);

  // Institution
  const institution = await InstitutionModel.findOneAndUpdate(
    { slug: 'demo-school' },
    { $setOnInsert: { name: 'Demo School', type: InstitutionType.HIGH_SCHOOL, slug: 'demo-school', address: { city: 'Rabat', country: 'MA' }, settings: { academicYearStart: '2025-09-01', academicYearEnd: '2026-06-30', gradingSystem: '20', currency: 'MAD' }, isActive: true } },
    { upsert: true, new: true }
  ).lean().exec();
  await recordSeed(conn, seedTag, 'institutions', institution._id, 'upsert');

  const institutionId = (institution as any)._id;

  // Admin
  const adminEmail = 'admin@demo.school';
  const admin = await UserModel.findOneAndUpdate(
    { email: adminEmail },
    { $setOnInsert: { institutionId, firstName: 'Admin', lastName: 'Demo', email: adminEmail, passwordHash: 'adminpass', role: UserRole.SUPER_ADMIN, status: 'ACTIVE' } },
    { upsert: true, new: true }
  ).lean().exec();
  await recordSeed(conn, seedTag, 'users', admin._id, 'upsert');

  // Classes
  const classNames = ['3ème A', '3ème B', '4ème A', '5ème C', '6ème A', 'Terminale S'];
  const classDocs: any[] = [];
  for (const n of classNames) {
    const c = await ClassGroupModel.findOneAndUpdate(
      { name: n, academicYear: '2025-2026' },
      { $setOnInsert: { institutionId, name: n, level: n.split(' ')[0], academicYear: '2025-2026', studentIds: [] } },
      { upsert: true, new: true }
    ).lean().exec();
    classDocs.push(c);
    await recordSeed(conn, seedTag, 'classgroups', c._id, 'upsert');
  }

  // Teachers
  const teacherCount = 5;
  const teacherDocs: any[] = [];
  for (let i = 1; i <= teacherCount; i++) {
    const email = `teacher${i}@demo.school`;
    const user = await UserModel.findOneAndUpdate(
      { email },
      { $setOnInsert: { institutionId, firstName: `Teacher${i}`, lastName: 'Demo', email, passwordHash: `teachpass${i}`, role: UserRole.TEACHER, status: 'ACTIVE' } },
      { upsert: true, new: true }
    ).lean().exec();
    await recordSeed(conn, seedTag, 'users', user._id, 'upsert');

    const profile = await TeacherProfileModel.findOneAndUpdate(
      { userId: user._id },
      { $setOnInsert: { userId: user._id, institutionId, employeeNumber: `T-${i.toString().padStart(3,'0')}`, professionalInfo: { subjects: ['Math','Physics'].slice(0, (i%2)+1) }, personalInfo: {} } },
      { upsert: true, new: true }
    ).lean().exec();
    await recordSeed(conn, seedTag, 'teacherprofiles', profile._id, 'upsert');

    teacherDocs.push({ user, profile });
  }

  // Students
  const studentCount = 30;
  const studentDocs: any[] = [];
  for (let i = 1; i <= studentCount; i++) {
    const email = `student${i}@demo.school`;
    const user = await UserModel.findOneAndUpdate(
      { email },
      { $setOnInsert: { institutionId, firstName: `Student${i}`, lastName: 'Demo', email, passwordHash: `studpass${i}`, role: UserRole.STUDENT, status: 'ACTIVE' } },
      { upsert: true, new: true }
    ).lean().exec();
    await recordSeed(conn, seedTag, 'users', user._id, 'upsert');

    const classToUse = classDocs[i % classDocs.length];

    const profile = await StudentProfileModel.findOneAndUpdate(
      { userId: user._id },
      { $setOnInsert: { userId: user._id, institutionId, studentRegistrationId: `STU-${i.toString().padStart(4,'0')}`, academicInfo: { currentGradeLevel: classToUse.name }, financialInfo: { accountBalance: 0 } } },
      { upsert: true, new: true }
    ).lean().exec();
    await recordSeed(conn, seedTag, 'studentprofiles', profile._id, 'upsert');

    await ClassGroupModel.findOneAndUpdate({ _id: classToUse._id }, { $addToSet: { studentIds: user._id } }).exec();
    await recordSeed(conn, seedTag, 'classgroups', classToUse._id, 'updated-add-student');

    studentDocs.push({ user, profile, classId: classToUse._id });
  }

  // Grades (use bypass and upsert by composite key)
  const subjects = ['Mathematics','Physics','French','English','History'];
  const gradeDocs: any[] = [];
  for (const [idx, s] of studentDocs.slice(0, 20).entries()) {
    for (let j = 0; j < 3; j++) {
      try {
        const subject = subjects[(j + idx) % subjects.length];
        const score = Math.round((10 + Math.random() * 10) * 10) / 10;
        const date = new Date();
        const filter = { studentId: s.user._id, classId: s.classId, subject, type: 'Exam', date };
        const payload: any = { institutionId, studentId: s.user._id, classId: s.classId, subject, type: 'Exam', score, maxScore: 20, teacherId: teacherDocs[j % teacherDocs.length].user._id, date };
        const g = await GradeModel.findOneAndUpdate(filter, { $set: payload }, { upsert: true, new: true, bypassDocumentValidation: true }).lean().exec();
        gradeDocs.push(g);
        await recordSeed(conn, seedTag, 'grades', g._id, 'upsert');
      } catch (err) {
        console.error('Grade upsert failed for student', (s.user as any).email, 'error:', (err as any).message);
      }
    }
  }

  // Timetable
  const timetableDocs: any[] = [];
  const now = new Date('2026-09-01T08:00:00Z');
  for (let i = 0; i < 40; i++) {
    const classDoc = classDocs[i % classDocs.length];
    const teacher = teacherDocs[i % teacherDocs.length];
    const start = new Date(now.getTime() + i * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 45 * 60 * 1000);
    try {
      const filter = { classId: classDoc._id, teacherId: teacher.user._id, startTime: start, endTime: end };
      const payload: any = { institutionId, classId: classDoc._id, teacherId: teacher.user._id, subject: subjects[i % subjects.length], startTime: start, endTime: end, location: 'Room 101' };
      const t = await TimetableModel.findOneAndUpdate(filter, { $set: payload }, { upsert: true, new: true, bypassDocumentValidation: true }).lean().exec();
      timetableDocs.push(t);
      await recordSeed(conn, seedTag, 'timetableentries', t._id, 'upsert');
    } catch (err) {
      console.error('Timetable upsert failed:', (err as any).message);
    }
  }

  // Invoices
  const invoiceDocs: any[] = [];
  for (let i = 0; i < 10; i++) {
    try {
      const s = studentDocs[i];
      const invoiceNumber = `INV-RE-${Date.now().toString().slice(-6)}-${i}`;
      const filter = { invoiceNumber };
      const payload: any = { institutionId, invoiceNumber, number: invoiceNumber, studentId: s.user._id, items: [{ description: 'Tuition', amount: 2000 }], totalAmount: 2000, paidAmount: i % 3 === 0 ? 2000 : 0, status: i % 3 === 0 ? InvoiceStatus.PAID : InvoiceStatus.PENDING, dueDate: new Date('2026-09-30') };
      const inv = await InvoiceModel.findOneAndUpdate(filter, { $set: payload }, { upsert: true, new: true, bypassDocumentValidation: true }).lean().exec();
      invoiceDocs.push(inv);
      await recordSeed(conn, seedTag, 'invoices', inv._id, 'upsert');
    } catch (err) {
      console.error('Invoice upsert failed for index', i, 'error:', (err as any).message);
    }
  }

  console.log('Seed run finished. Recorded metadata entries for inserted/updated docs.');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => { console.error('seed_tagged2 failed:', err); process.exit(1); });
