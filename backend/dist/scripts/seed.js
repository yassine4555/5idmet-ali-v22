"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const student_profile_schema_1 = require("../schemas/student-profile.schema");
const teacher_profile_schema_1 = require("../schemas/teacher-profile.schema");
const class_group_schema_1 = require("../schemas/class-group.schema");
const grade_schema_1 = require("../schemas/grade.schema");
const timetable_schema_1 = require("../schemas/timetable.schema");
const invoice_schema_1 = require("../schemas/invoice.schema");
const institution_schema_1 = require("../schemas/institution.schema");
function loadEnv(envPath) {
    if (!fs.existsSync(envPath))
        return;
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach((line) => {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!m)
            return;
        let [, key, val] = m;
        if (val.startsWith('"') && val.endsWith('"'))
            val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'"))
            val = val.slice(1, -1);
        process.env[key] = val;
    });
}
async function main() {
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
    const UserModel = conn.model('User', user_schema_1.UserSchema);
    const StudentProfileModel = conn.model('StudentProfile', student_profile_schema_1.StudentProfileSchema);
    const TeacherProfileModel = conn.model('TeacherProfile', teacher_profile_schema_1.TeacherProfileSchema);
    const ClassGroupModel = conn.model('ClassGroup', class_group_schema_1.ClassGroupSchema);
    const GradeModel = conn.model('Grade', grade_schema_1.GradeSchema);
    const TimetableModel = conn.model('TimetableEntry', timetable_schema_1.TimetableEntrySchema);
    const InvoiceModel = conn.model('Invoice', invoice_schema_1.InvoiceSchema);
    const InstitutionModel = conn.model('Institution', institution_schema_1.InstitutionSchema);
    console.log('Seeding sample data...');
    let institution = await InstitutionModel.findOne({ slug: 'demo-school' }).lean().exec();
    if (!institution) {
        institution = await InstitutionModel.create({
            name: 'Demo School',
            type: institution_schema_1.InstitutionType.HIGH_SCHOOL,
            slug: 'demo-school',
            address: { city: 'Rabat', country: 'MA' },
            settings: { academicYearStart: '2025-09-01', academicYearEnd: '2026-06-30', gradingSystem: '20', currency: 'MAD' },
        });
        console.log('Created institution:', institution._id.toString());
    }
    const institutionId = institution._id;
    const adminEmail = 'admin@demo.school';
    let admin = await UserModel.findOne({ email: adminEmail }).lean().exec();
    if (!admin) {
        const adminDoc = await UserModel.create({
            institutionId,
            firstName: 'Admin',
            lastName: 'Demo',
            email: adminEmail,
            passwordHash: 'adminpass',
            role: user_schema_1.UserRole.SUPER_ADMIN,
            status: 'ACTIVE',
        });
        admin = adminDoc;
        console.log('Created admin user:', adminDoc._id.toString());
    }
    const classNames = ['3ème A', '3ème B', '4ème A', '5ème C', '6ème A', 'Terminale S'];
    const classDocs = [];
    for (const n of classNames) {
        let c = await ClassGroupModel.findOne({ name: n, academicYear: '2025-2026' }).lean().exec();
        if (!c) {
            c = await ClassGroupModel.create({ institutionId, name: n, level: n.split(' ')[0], academicYear: '2025-2026', studentIds: [] });
        }
        classDocs.push(c);
    }
    console.log('Classes:', classDocs.map((c) => `${c.name}:${c._id}`));
    const teacherCount = 5;
    const teacherDocs = [];
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
                role: user_schema_1.UserRole.TEACHER,
                status: 'ACTIVE',
            });
            u = created;
        }
        let p = await TeacherProfileModel.findOne({ userId: u._id }).lean().exec();
        if (!p) {
            p = await TeacherProfileModel.create({ userId: u._id, institutionId, employeeNumber: `T-${i.toString().padStart(3, '0')}`, professionalInfo: { subjects: ['Math', 'Physics'].slice(0, (i % 2) + 1) }, personalInfo: {} });
        }
        teacherDocs.push({ user: u, profile: p });
    }
    console.log('Teachers created:', teacherDocs.length);
    const studentCount = 30;
    const studentDocs = [];
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
                role: user_schema_1.UserRole.STUDENT,
                status: 'ACTIVE',
            });
            u = created;
        }
        let p = await StudentProfileModel.findOne({ userId: u._id }).lean().exec();
        if (!p) {
            p = await StudentProfileModel.create({ userId: u._id, institutionId, studentRegistrationId: `STU-${i.toString().padStart(4, '0')}`, academicInfo: { currentGradeLevel: classDocs[i % classDocs.length].name }, financialInfo: { accountBalance: 0 } });
        }
        const classToUse = classDocs[i % classDocs.length];
        await ClassGroupModel.findByIdAndUpdate(classToUse._id, { $addToSet: { studentIds: u._id } }).exec();
        studentDocs.push({ user: u, profile: p, classId: classToUse._id });
    }
    console.log('Students created:', studentDocs.length);
    const subjects = ['Mathematics', 'Physics', 'French', 'English', 'History'];
    const gradeDocs = [];
    for (const s of studentDocs.slice(0, 20)) {
        for (let j = 0; j < 3; j++) {
            try {
                const numMatch = s.user.email.match(/\d+/);
                const idx = numMatch ? parseInt(numMatch[0], 10) : 1;
                const subject = subjects[(j + idx) % subjects.length];
                const score = Math.round((10 + Math.random() * 10) * 10) / 10;
                const payload = { institutionId, studentId: s.user._id, classId: s.classId, subject, type: 'Exam', score, maxScore: 20, teacherId: teacherDocs[j % teacherDocs.length].user._id, date: new Date() };
                const grade = await GradeModel.create(payload);
                gradeDocs.push(grade);
            }
            catch (err) {
                console.error('Failed to create grade for student', s.user.email, 'error:', err && err.message);
            }
        }
    }
    console.log('Grades created (attempted):', gradeDocs.length);
    const timetableDocs = [];
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
    const invoiceDocs = [];
    for (let i = 0; i < 10; i++) {
        try {
            const s = studentDocs[i];
            if (!s)
                continue;
            const payload = { institutionId, invoiceNumber: `INV-${Date.now().toString().slice(-6)}-${i}`, studentId: s.user._id, items: [{ description: 'Tuition', amount: 2000 }], totalAmount: 2000, paidAmount: i % 3 === 0 ? 2000 : 0, status: i % 3 === 0 ? invoice_schema_1.InvoiceStatus.PAID : invoice_schema_1.InvoiceStatus.PENDING, dueDate: new Date('2026-09-30') };
            const inv = await InvoiceModel.create(payload);
            invoiceDocs.push(inv);
        }
        catch (err) {
            console.error('Failed to create invoice for index', i, 'error:', err && err.message);
        }
    }
    console.log('Invoices created (attempted):', invoiceDocs.length);
    console.log('\nSeed summary:');
    console.log(' Institution:', institution._id.toString());
    console.log(' Admin:', admin._id.toString(), adminEmail, '/ password: adminpass');
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
//# sourceMappingURL=seed.js.map