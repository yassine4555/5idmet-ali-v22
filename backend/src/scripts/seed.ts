import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

// Import schemas from project
import { User, UserSchema, UserRole } from '../schemas/user.schema';
import { StudentProfile, StudentProfileSchema } from '../schemas/student-profile.schema';
import { TeacherProfile, TeacherProfileSchema } from '../schemas/teacher-profile.schema';
import { ClassGroup, ClassGroupSchema } from '../schemas/class-group.schema';
import { Grade, GradeSchema } from '../schemas/grade.schema';
import { TimetableEntry, TimetableEntrySchema } from '../schemas/timetable.schema';
import { Invoice, InvoiceSchema, InvoiceStatus } from '../schemas/invoice.schema';
import { Institution, InstitutionSchema, InstitutionType } from '../schemas/institution.schema';

// Simple .env parser fallback
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

async function main() {
  // load backend .env if present
  const envPath = path.resolve(__dirname, '..', '..', '.env');
  loadEnv(envPath);

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment or backend/.env. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: 'edupro' });
  console.log('Connected to MongoDB');

  const conn = mongoose.connection;

  // Register schemas
  const UserModel = conn.model<User & mongoose.Document>('User', UserSchema);
  const StudentProfileModel = conn.model<StudentProfile & mongoose.Document>('StudentProfile', StudentProfileSchema);
  const TeacherProfileModel = conn.model<TeacherProfile & mongoose.Document>('TeacherProfile', TeacherProfileSchema);
  const ClassGroupModel = conn.model<ClassGroup & mongoose.Document>('ClassGroup', ClassGroupSchema);
  const GradeModel = conn.model<Grade & mongoose.Document>('Grade', GradeSchema);
  const TimetableModel = conn.model<TimetableEntry & mongoose.Document>('TimetableEntry', TimetableEntrySchema);
  const InvoiceModel = conn.model<Invoice & mongoose.Document>('Invoice', InvoiceSchema);
  const InstitutionModel = conn.model<Institution & mongoose.Document>('Institution', InstitutionSchema);

  // Cleanup? (do not drop in production)
  console.log('Seeding sample data...');

  // Create or find institution
  let institution = await InstitutionModel.findOne({ slug: 'demo-school' }).lean().exec();
  if (!institution) {
    institution = await InstitutionModel.create({
      name: 'Demo School',
      type: InstitutionType.HIGH_SCHOOL,
      slug: 'demo-school',
      address: { city: 'Rabat', country: 'MA' },
      settings: { academicYearStart: '2025-09-01', academicYearEnd: '2026-06-30', gradingSystem: '20', currency: 'MAD' },
    });
    console.log('Created institution:', (institution as any)._id.toString());
  }

  const institutionId = (institution as any)._id;

  // Admin user
  const adminEmail = 'admin@demo.school';
  let admin = await UserModel.findOne({ email: adminEmail }).lean().exec();
  if (!admin) {
    const adminDoc = await UserModel.create({
      institutionId,
      firstName: 'Admin',
      lastName: 'Demo',
      email: adminEmail,
      passwordHash: 'adminpass',
      role: UserRole.SUPER_ADMIN,
      status: 'ACTIVE',
    });
    admin = adminDoc;
    console.log('Created admin user:', (adminDoc as any)._id.toString());
  }

  // Create classes
  const classNames = ['3ème A', '3ème B', '4ème A', '5ème C', '6ème A', 'Terminale S'];
  const classDocs: any[] = [];
  for (const n of classNames) {
    let c = await ClassGroupModel.findOne({ name: n, academicYear: '2025-2026' }).lean().exec();
    if (!c) {
      c = await ClassGroupModel.create({ institutionId, name: n, level: n.split(' ')[0], academicYear: '2025-2026', studentIds: [] });
    }
    classDocs.push(c);
  }
  console.log('Classes:', classDocs.map((c) => `${c.name}:${c._id}`));

  // Create teachers
  const teacherCount = 5;
  const teacherDocs: any[] = [];
  for (let i = 1; i <= teacherCount; i++) {
    const email = `teacher${i}@demo.school`;
    let u = await UserModel.findOne({ email }).lean().exec();
    if (!u) {
      const created = await UserModel.create({
        institutionId,
        firstName: `Teacher${i}`,
        lastName: 'Demo',
        email,
        passwordHash: `teachpass${i}`,
        role: UserRole.TEACHER,
        status: 'ACTIVE',
      });
      u = created;
    }
    let p = await TeacherProfileModel.findOne({ userId: u._id }).lean().exec();
    if (!p) {
      p = await TeacherProfileModel.create({ userId: u._id, institutionId, employeeNumber: `T-${i.toString().padStart(3, '0')}`, professionalInfo: { subjects: ['Math','Physics'].slice(0, (i%2)+1) }, personalInfo: {} });
    }
    teacherDocs.push({ user: u, profile: p });
  }
  console.log('Teachers created:', teacherDocs.length);

  // Create students
  const studentCount = 30;
  const studentDocs: any[] = [];
  for (let i = 1; i <= studentCount; i++) {
    const email = `student${i}@demo.school`;
    let u = await UserModel.findOne({ email }).lean().exec();
    if (!u) {
      const created = await UserModel.create({
        institutionId,
        firstName: `Student${i}`,
        lastName: 'Demo',
        email,
        passwordHash: `studpass${i}`,
        role: UserRole.STUDENT,
        status: 'ACTIVE',
      });
      u = created;
    }
    let p = await StudentProfileModel.findOne({ userId: u._id }).lean().exec();
    if (!p) {
      p = await StudentProfileModel.create({ userId: u._id, institutionId, studentRegistrationId: `STU-${i.toString().padStart(4,'0')}`, academicInfo: { currentGradeLevel: classDocs[i % classDocs.length].name }, financialInfo: { accountBalance: 0 } });
    }
    // add to class
    const classToUse = classDocs[i % classDocs.length];
    await ClassGroupModel.findByIdAndUpdate(classToUse._id, { $addToSet: { studentIds: u._id } }).exec();
    studentDocs.push({ user: u, profile: p, classId: classToUse._id });
  }
  console.log('Students created:', studentDocs.length);

  // Create grades (safe)
  const subjects = ['Mathematics','Physics','French','English','History'];
  const gradeDocs: any[] = [];
  for (const s of studentDocs.slice(0, 20)) {
    for (let j = 0; j < 3; j++) {
        try {
          const numMatch = (s.user as any).email.match(/\d+/);
          const idx = numMatch ? parseInt(numMatch[0], 10) : 1;
          const subject = subjects[(j + idx) % subjects.length];
          const score = Math.round((10 + Math.random() * 10) * 10) / 10;
          const payload = { institutionId, studentId: s.user._id, classId: s.classId, subject, type: 'Exam', score, maxScore: 20, teacherId: teacherDocs[j % teacherDocs.length].user._id, date: new Date() };
          const grade = await GradeModel.create(payload);
          gradeDocs.push(grade);
        } catch (err) {
          console.error('Failed to create grade for student', (s.user as any).email, 'error:', err && (err as any).message);
        }
      }
    }
    console.log('Grades created (attempted):', gradeDocs.length);

  // Create timetable entries
  const timetableDocs: any[] = [];
  const now = new Date('2026-09-01T08:00:00Z');
  for (let i = 0; i < 40; i++) {
    const classDoc = classDocs[i % classDocs.length];
    const teacher = teacherDocs[i % teacherDocs.length];
    const start = new Date(now.getTime() + i * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 45 * 60 * 1000);
    const t = await TimetableModel.create({ institutionId, classId: classDoc._id, teacherId: teacher.user._id, subject: subjects[i % subjects.length], startTime: start, endTime: end, location: 'Room 101' });
    timetableDocs.push(t);
  }
  console.log('Timetable entries created:', timetableDocs.length);

  // Create invoices (safe)
  const invoiceDocs: any[] = [];
  for (let i = 0; i < 10; i++) {
    try {
      const s = studentDocs[i];
      if (!s) continue;
      const payload = { institutionId, invoiceNumber: `INV-${Date.now().toString().slice(-6)}-${i}`, studentId: s.user._id, items: [{ description: 'Tuition', amount: 2000 }], totalAmount: 2000, paidAmount: i % 3 === 0 ? 2000 : 0, status: i % 3 === 0 ? InvoiceStatus.PAID : InvoiceStatus.PENDING, dueDate: new Date('2026-09-30') };
      const inv = await InvoiceModel.create(payload);
      invoiceDocs.push(inv);
    } catch (err) {
      console.error('Failed to create invoice for index', i, 'error:', err && (err as any).message);
    }
  }
  console.log('Invoices created (attempted):', invoiceDocs.length);

  console.log('\nSeed summary:');
  console.log(' Institution:', (institution as any)._id.toString());
  console.log(' Admin:', (admin as any)._id.toString(), adminEmail, '/ password: adminpass');
  console.log(' Teachers sample credential pattern: teacherN@demo.school / teachpassN');
  console.log(' Students sample credential pattern: studentN@demo.school / studpassN');

  await mongoose.disconnect();
  console.log('Disconnected. Seeding complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
