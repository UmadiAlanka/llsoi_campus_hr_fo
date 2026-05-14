import apiClient from './apiClient';
import { attendanceService } from './attendanceService';
import { leaveService } from './leaveService';
export interface Salary {
  id: number;
  employeeId: number;
  employeeName?: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  overtimePay: number;
  totalDaysWorked: number;
  totalLeaves: number;
  epfDeduction: number;
  etfDeduction: number;
  otherDeductions: number;
  grossSalary: number;
  netSalary: number;
  status: string; // PENDING, APPROVED, PAID
  generatedDate: string;
}

export const salaryService = {
  generateSalary: async (
    employeeId: number,
    month: number,
    year: number,
    generatedBy: string
  ): Promise<Salary> => {
    const response = await apiClient.post<Salary>(
      `/salary/generate/${employeeId}?month=${month}&year=${year}&generatedBy=${generatedBy}`
    );
    return response.data!;
  },

  generateSalaryForAll: async (month: number, year: number, generatedBy: string): Promise<Salary[]> => {
    const response = await apiClient.post<Salary[]>(
      `/salary/generate-all?month=${month}&year=${year}&generatedBy=${generatedBy}`
    );
    return response.data || [];
  },

  getSalaryById: async (salaryId: number): Promise<Salary | null> => {
    const response = await apiClient.get<Salary>(`/salary/${salaryId}`);
    return response.data || null;
  },

  getEmployeeSalaries: async (employeeId: number): Promise<Salary[]> => {
    const response = await apiClient.get<Salary[]>(`/salary/employee/${employeeId}`);
    return response.data || [];
  },

  getSalariesByMonthYear: async (month: number, year: number): Promise<Salary[]> => {
    const response = await apiClient.get<Salary[]>(`/salary/month-year?month=${month}&year=${year}`);
    return response.data || [];
  },

  approveSalary: async (salaryId: number, approvedBy: string): Promise<Salary> => {
    const response = await apiClient.put<Salary>(
      `/salary/approve/${salaryId}?approvedBy=${approvedBy}`
    );
    return response.data!;
  },

  updateSalary: async (
    salaryId: number,
    salary: Partial<Salary>,
    updatedBy: string
  ): Promise<Salary> => {
    const response = await apiClient.put<Salary>(
      `/salary/${salaryId}?updatedBy=${updatedBy}`,
      salary
    );
    return response.data!;
  },

  deleteSalary: async (salaryId: number): Promise<void> => {
    await apiClient.delete(`/salary/${salaryId}`);
  },
};

export default { attendanceService, leaveService, salaryService };