import apiClient from './apiClient';
export interface Leave {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: string; // PENDING, APPROVED, REJECTED
}

export const leaveService = {
  requestLeave: async (employeeId: number, leave: Omit<Leave, 'id'>): Promise<Leave> => {
    const response = await apiClient.post<Leave>(`/leave/request/${employeeId}`, leave);
    return response.data!;
  },

  getAllLeaves: async (): Promise<Leave[]> => {
    const response = await apiClient.get<Leave[]>('/leave');
    return response.data || [];
  },

  getLeavesByEmployee: async (employeeId: number): Promise<Leave[]> => {
    const response = await apiClient.get<Leave[]>(`/leave/employee/${employeeId}`);
    return response.data || [];
  },

  approveLeave: async (leaveId: number): Promise<Leave> => {
    const response = await apiClient.put<Leave>(`/leave/approve/${leaveId}`);
    return response.data!;
  },

  rejectLeave: async (leaveId: number): Promise<Leave> => {
    const response = await apiClient.put<Leave>(`/leave/reject/${leaveId}`);
    return response.data!;
  },

  getPendingLeaves: async (): Promise<Leave[]> => {
    const response = await apiClient.get<Leave[]>('/leave/pending');
    return response.data || [];
  },

  deleteLeave: async (leaveId: number): Promise<void> => {
    await apiClient.delete(`/leave/${leaveId}`);
  },
};