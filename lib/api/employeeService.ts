// lib/api/employeeService.ts
import apiClient from './apiClient';

export interface Employee {
  id: number;
  name: string;
  gender: string;
  age: number;
  designation: string;
  department: string;
  salary: number;
  username: string;
  email: string;
  contact: string;
}

export const employeeService = {
  /**
   * Get all employees
   * GET /api/employees
   */
  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await apiClient.get<Employee[]>('/employees');
    return response.data || [];
  },

  /**
   * Get employee by ID
   * GET /api/employees/{id}
   */
  getEmployeeById: async (id: number): Promise<Employee | null> => {
    const response = await apiClient.get<Employee>(`/employees/${id}`);
    return response.data || null;
  },

  /**
   * Search employees by name
   * GET /api/employees/search?name={name}
   */
  searchEmployees: async (name: string): Promise<Employee[]> => {
    const response = await apiClient.get<Employee[]>(`/employees/search?name=${name}`);
    return response.data || [];
  },

  /**
   * Create new employee
   * POST /api/employees
   */
  createEmployee: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    const response = await apiClient.post<Employee>('/employees', employee);
    return response.data!;
  },

  /**
   * Update employee
   * PUT /api/employees/{id}
   */
  updateEmployee: async (id: number, employee: Partial<Employee>): Promise<Employee> => {
    const response = await apiClient.put<Employee>(`/employees/${id}`, employee);
    return response.data!;
  },

  /**
   * Delete employee
   * DELETE /api/employees/{id}
   */
  deleteEmployee: async (id: number): Promise<void> => {
    await apiClient.delete(`/employees/${id}`);
  },

  /**
   * Get total employee count
   * GET /api/employees/count
   */
  getEmployeeCount: async (): Promise<number> => {
    const response = await apiClient.get<number>('/employees/count');
    return response.data || 0;
  },
};

export default employeeService;