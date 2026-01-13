const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2027/api';

export const api = {
  // Authentication
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  // Employees
  getAllEmployees: async () => {
    const response = await fetch(`${API_BASE_URL}/employees`);
    return response.json();
  },

  getEmployeeById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`);
    return response.json();
  },

  createEmployee: async (employee) => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    return response.json();
  },

  updateEmployee: async (id, employee) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    return response.json();
  },

  deleteEmployee: async (id) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Dashboard
  getDashboardStats: async (role, userId) => {
    const endpoint = role === 'ADMIN' ? 'dashboard/admin' : 
                     role === 'HR' ? 'dashboard/hr' : 
                     `dashboard/employee/${userId}`;
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    return response.json();
  },

  // Attendance
  getAllAttendance: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance`);
    return response.json();
  },

  markAttendance: async (employeeId, markedBy) => {
    const response = await fetch(`${API_BASE_URL}/attendance/clock-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, markedBy })
    });
    return response.json();
  },

  // Leave
  getAllLeaves: async () => {
    const response = await fetch(`${API_BASE_URL}/leaves`);
    return response.json();
  },

  requestLeave: async (employeeId, leaveData) => {
    const response = await fetch(`${API_BASE_URL}/leaves/${employeeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveData)
    });
    return response.json();
  },

  approveLeave: async (leaveId) => {
    const response = await fetch(`${API_BASE_URL}/leaves/${leaveId}/approve`, {
      method: 'PUT'
    });
    return response.json();
  },

  // Salary
  getAllSalaries: async () => {
    const response = await fetch(`${API_BASE_URL}/salaries`);
    return response.json();
  },

  generateSalary: async (employeeId, month, year, generatedBy) => {
    const response = await fetch(`${API_BASE_URL}/salaries/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, month, year, generatedBy })
    });
    return response.json();
  }
};

export default api;