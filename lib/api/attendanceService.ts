import apiClient from './apiClient';

export interface Attendance {
  id: number;
  employeeId: number;
  employeeName?: string;
  date: string;
  clockInTime?: string;
  clockOutTime?: string;
  status: string;
  workingHours?: number;
  remarks?: string;
}

export const attendanceService = {
  clockIn: async (employeeId: number, markedBy: string): Promise<Attendance> => {
    const response = await apiClient.post<Attendance>(
      `/attendance/clock-in/${employeeId}?markedBy=${markedBy}`
    );
    return response.data!;
  },

  clockOut: async (employeeId: number): Promise<Attendance> => {
    const response = await apiClient.post<Attendance>(`/attendance/clock-out/${employeeId}`);
    return response.data!;
  },

  getEmployeeAttendance: async (employeeId: number): Promise<Attendance[]> => {
    const response = await apiClient.get<Attendance[]>(`/attendance/employee/${employeeId}`);
    return response.data || [];
  },

  getAttendanceByDate: async (employeeId: number, date: string): Promise<Attendance | null> => {
    const response = await apiClient.get<Attendance>(`/attendance/employee/${employeeId}/date/${date}`);
    return response.data || null;
  },

  getAllAttendanceByDate: async (date: string): Promise<Attendance[]> => {
    const response = await apiClient.get<Attendance[]>(`/attendance/date/${date}`);
    return response.data || [];
  },

  updateAttendance: async (
    attendanceId: number,
    attendance: Partial<Attendance>,
    updatedBy: string
  ): Promise<Attendance> => {
    const response = await apiClient.put<Attendance>(
      `/attendance/${attendanceId}?updatedBy=${updatedBy}`,
      attendance
    );
    return response.data!;
  },
};