import apiClient from './apiClient';

export interface SalaryAnomaly {
  id: number;
  salaryId: number;
  employeeId: number;
  employeeName?: string;
  detectedDate: string;
  anomalyType: string; // SUDDEN_INCREASE, SUDDEN_DECREASE, UNUSUAL_DEDUCTION, MISSING_ATTENDANCE
  currentAmount: number;
  previousAmount: number;
  deviationPercentage: number;
  description: string;
  status: string; // PENDING, REVIEWED, RESOLVED, IGNORED
  severity: string; // LOW, MEDIUM, HIGH, CRITICAL
  resolutionNotes?: string;
}

export const anomalyService = {
  /**
   * Get all anomalies
   * GET /api/anomalies
   */
  getAllAnomalies: async (): Promise<SalaryAnomaly[]> => {
    const response = await apiClient.get<SalaryAnomaly[]>('/anomalies');
    return response.data || [];
  },

  /**
   * Get anomalies by status
   * GET /api/anomalies/status/{status}
   */
  getAnomaliesByStatus: async (status: string): Promise<SalaryAnomaly[]> => {
    const response = await apiClient.get<SalaryAnomaly[]>(`/anomalies/status/${status}`);
    return response.data || [];
  },

  /**
   * Get anomalies by severity
   * GET /api/anomalies/severity/{severity}
   */
  getAnomaliesBySeverity: async (severity: string): Promise<SalaryAnomaly[]> => {
    const response = await apiClient.get<SalaryAnomaly[]>(`/anomalies/severity/${severity}`);
    return response.data || [];
  },

  /**
   * Get pending anomalies
   * GET /api/anomalies/pending
   */
  getPendingAnomalies: async (): Promise<SalaryAnomaly[]> => {
    const response = await apiClient.get<SalaryAnomaly[]>('/anomalies/pending');
    return response.data || [];
  },

  /**
   * Get critical anomalies
   * GET /api/anomalies/critical
   */
  getCriticalAnomalies: async (): Promise<SalaryAnomaly[]> => {
    const response = await apiClient.get<SalaryAnomaly[]>('/anomalies/critical');
    return response.data || [];
  },

  /**
   * Review/resolve anomaly
   * PUT /api/anomalies/review/{anomalyId}
   */
  reviewAnomaly: async (
    anomalyId: number,
    status: string,
    resolutionNotes: string,
    reviewedBy: string
  ): Promise<SalaryAnomaly> => {
    const response = await apiClient.put<SalaryAnomaly>(
      `/anomalies/review/${anomalyId}?status=${status}&resolutionNotes=${resolutionNotes}&reviewedBy=${reviewedBy}`
    );
    return response.data!;
  },

  /**
   * Delete anomaly
   * DELETE /api/anomalies/{anomalyId}
   */
  deleteAnomaly: async (anomalyId: number): Promise<void> => {
    await apiClient.delete(`/anomalies/${anomalyId}`);
  },
};