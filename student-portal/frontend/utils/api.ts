import axios from 'axios';
import { useAuthStore } from './authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  refreshToken: () => api.post('/auth/refresh', {}),
};

export const studentAPI = {
  getProfile: () => api.get('/students/me'),
  getProfileStats: () => api.get('/students/profile-stats'),
  updateProfile: (data: any) => api.put('/students/profile', data),
};

export const gradesAPI = {
  getAll: () => api.get('/grades'),
  getByYear: (params: any) => api.get('/grades/by-year', { params }),
  getTranscript: () => api.get('/grades/transcript'),
};

export const coursesAPI = {
  getAvailable: (params?: any) => api.get('/courses', { params }),
  getDetails: (courseId: number) => api.get(`/courses/${courseId}`),
  getEnrolled: () => api.get('/courses/enrolled'),
};

export const enrollmentAPI = {
  register: (courseId: number) => api.post('/enrollments', { courseId }),
  drop: (courseId: number) => api.delete(`/enrollments/${courseId}`),
};

export const feesAPI = {
  getInfo: () => api.get('/fees'),
  getInvoice: (semester: number) => api.get(`/fees/invoice/${semester}`),
};

export const paymentsAPI = {
  initiate: (data: any) => api.post('/payments', data),
  confirm: (data: any) => api.post('/payments/confirm', data),
  getHistory: () => api.get('/payments/history'),
};

export const assignmentAPI = {
  getAll: () => api.get('/assignments'),
  getDetails: (assignmentId: number) => api.get(`/assignments/${assignmentId}`),
  getByCourse: (courseId: number) => api.get(`/assignments/course/${courseId}`),
};

export const submissionAPI = {
  submit: (data: any) => api.post('/submissions', data),
  getAll: () => api.get('/submissions'),
  getDetails: (submissionId: number) => api.get(`/submissions/${submissionId}`),
};

export const adminAPI = {
  getStudents: () =>
    api.get('/students/admin'),

  getStudentById: (studentId: number) =>
    api.get(`/students/admin/${studentId}`),

  updateStudent: (studentId: number, data: any) =>
    api.put(`/students/admin/${studentId}`, data),

  updateStudentStatus: (studentId: number, isActive: boolean) =>
    api.patch(`/students/admin/${studentId}/status`, {
      isActive,
    }),


    getCourses: () =>
  api.get('/courses/admin'),

createCourse: (data: any) =>
  api.post('/courses', data),

updateCourse: (courseId: number, data: any) =>
  api.put(`/courses/${courseId}`, data),

deleteCourse: (courseId: number) =>
  api.delete(`/courses/${courseId}`),

getEnrollments: () =>
  api.get('/enrollments/admin'),

getGrades: () =>
  api.get('/grades/admin'),

getFees: () =>
  api.get('/fees/admin'),

};

export default api;