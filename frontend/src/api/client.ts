import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Students ───────────────────────────────────────────────────────────────
export const studentsApi = {
  list: (params?: { search?: string; status?: string; level?: string }) =>
    api.get('/api/v1/students', { params }).then((r) => r.data),

  getProfile: (id: string) =>
    api.get(`/api/v1/students/${id}/profile`).then((r) => r.data),

  create: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    academicInfo?: { currentGradeLevel?: string };
  }) => api.post('/api/v1/students', data).then((r) => r.data),

  update: (id: string, data: Record<string, any>) =>
    api.put(`/api/v1/students/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/api/v1/students/${id}`).then((r) => r.data),
};

// ─── Teachers ────────────────────────────────────────────────────────────────
export const teachersApi = {
  list: (search?: string) =>
    api.get('/api/v1/teachers', { params: { search } }).then((r) => r.data),

  getById: (id: string) =>
    api.get(`/api/v1/teachers/${id}`).then((r) => r.data),

  create: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    professionalInfo?: { subjects?: string[]; bio?: string; qualifications?: string[] };
    personalInfo?: { gender?: string; address?: string };
  }) => api.post('/api/v1/teachers', data).then((r) => r.data),

  update: (id: string, data: Record<string, any>) =>
    api.put(`/api/v1/teachers/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/api/v1/teachers/${id}`).then((r) => r.data),
};

// ─── Classes ─────────────────────────────────────────────────────────────────
export const classesApi = {
  list: (search?: string) =>
    api.get('/api/v1/classes', { params: { search } }).then((r) => r.data),

  getById: (id: string) =>
    api.get(`/api/v1/classes/${id}`).then((r) => r.data),

  create: (data: {
    name: string;
    level: string;
    academicYear: string;
    mainTeacherId?: string;
    studentIds?: string[];
  }) => api.post('/api/v1/classes', data).then((r) => r.data),

  update: (id: string, data: Record<string, any>) =>
    api.put(`/api/v1/classes/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/api/v1/classes/${id}`).then((r) => r.data),
};

// ─── Grades / Notes ──────────────────────────────────────────────────────────
export const gradesApi = {
  list: (params?: { studentId?: string; classId?: string; subject?: string }) =>
    api.get('/api/v1/grades', { params }).then((r) => r.data),

  create: (data: {
    studentId: string;
    classId: string;
    subject: string;
    type: string;
    score: number;
    maxScore?: number;
    teacherId?: string;
    date?: string;
    comment?: string;
  }) => api.post('/api/v1/grades', data).then((r) => r.data),

  update: (id: string, data: Record<string, any>) =>
    api.put(`/api/v1/grades/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/api/v1/grades/${id}`).then((r) => r.data),
};

// ─── Timetable ───────────────────────────────────────────────────────────────
export const timetableApi = {
  list: (params?: { classId?: string; teacherId?: string }) =>
    api.get('/api/v1/timetable', { params }).then((r) => r.data),

  create: (data: {
    classId: string;
    teacherId: string;
    subject: string;
    startTime: string;
    endTime: string;
    location?: string;
    notes?: string;
  }) => api.post('/api/v1/timetable', data).then((r) => r.data),

  update: (id: string, data: Record<string, any>) =>
    api.put(`/api/v1/timetable/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/api/v1/timetable/${id}`).then((r) => r.data),
};

// ─── Finance ─────────────────────────────────────────────────────────────────
export const financeApi = {
  summary: () =>
    api.get('/api/v1/finance/summary').then((r) => r.data),

  listInvoices: (status?: string) =>
    api.get('/api/v1/finance/invoices', { params: { status } }).then((r) => r.data),

  createInvoice: (data: {
    studentId: string;
    description: string;
    totalAmount: number;
    dueDate: string;
  }) => api.post('/api/v1/finance/invoices', data).then((r) => r.data),

  updateInvoice: (id: string, data: { paidAmount?: number; status?: string }) =>
    api.put(`/api/v1/finance/invoices/${id}`, data).then((r) => r.data),

  deleteInvoice: (id: string) =>
    api.delete(`/api/v1/finance/invoices/${id}`).then((r) => r.data),

  sendReminder: (id: string) =>
    api.post(`/api/v1/finance/invoices/${id}/remind`).then((r) => r.data),
};

// ─── Messaging ───────────────────────────────────────────────────────────────
export const messagingApi = {
  listConversations: () =>
    api.get('/api/v1/messaging/conversations').then((r) => r.data),

  getMessages: (conversationId: string) =>
    api.get(`/api/v1/messaging/conversations/${conversationId}/messages`).then((r) => r.data),

  sendMessage: (data: { conversationId: string; senderId: string; content: string; attachments?: any[] }) =>
    api.post('/api/v1/messaging/messages', data).then((r) => r.data),
};
