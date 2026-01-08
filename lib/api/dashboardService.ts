import { anomalyService } from './anomalyService';
import apiClient from './apiClient';
export interface DashboardStats {
  totalEmployees?: number;
  totalAdmins?: number;
  totalHRStaff?: number;
  pendingLeaveRequests?: number;
  pendingAnomalies?: number;
  criticalAnomalies?: number;
  todayAttendance?: number;
  totalLeaveRequests?: number;
  approvedLeaves?: number;
  currentMonthSalaries?: number;
  pendingSalaries?: number;
  totalAttendance?: number;
  todayAttendanceMarked?: boolean;
  todayAttendanceStatus?: string;
  clockedIn?: boolean;
  clockedOut?: boolean;
}

export const dashboardService = {
  /**
   * Get Admin dashboard stats
   * GET /api/dashboard/admin
   */
  getAdminDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/dashboard/admin');
    return response.data || {};
  },

  /**
   * Get HR dashboard stats
   * GET /api/dashboard/hr
   */
  getHRDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/dashboard/hr');
    return response.data || {};
  },

  /**
   * Get Employee dashboard stats
   * GET /api/dashboard/employee/{employeeId}
   */
  getEmployeeDashboard: async (employeeId: number): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>(`/dashboard/employee/${employeeId}`);
    return response.data || {};
  },

  /**
   * Get monthly statistics
   * GET /api/dashboard/monthly
   */
  getMonthlyStats: async (month: number, year: number): Promise<any> => {
    const response = await apiClient.get(`/dashboard/monthly?month=${month}&year=${year}`);
    return response.data || {};
  },
};

export default { anomalyService, dashboardService };