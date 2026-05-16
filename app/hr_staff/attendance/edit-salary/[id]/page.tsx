"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './edit-salary.module.css';

/**
 * EditSalaryPage Component
 * Fetches and updates a specific payroll record from the Spring Boot backend.
 */
const EditSalaryPage = () => {
  const router = useRouter();
  const params = useParams(); // Retrieves the ID from the URL path
  
  // UI states for handling the lifecycle of the data fetch and update
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isFetching, setIsFetching] = useState(true);

  // Local state for form fields
  const [formData, setFormData] = useState({
    id: '', 
    name: '',
    employeeId: '',
    employeeType: '',
    date: '',
    basicSalary: '',
    netSalary: ''
  });

  /**
   * Effect hook to fetch data when the component mounts or the ID changes.
   */
  useEffect(() => {
    const fetchSalaryData = async () => {
      // Validation: Ensure the ID exists in the URL before making the request
      if (!params?.id) {
        console.error("No ID found in URL parameters.");
        return;
      }

      setIsFetching(true);
      const apiUrl = `http://localhost:2027/api/payroll/${params.id}`;
      
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} at ${apiUrl}`);
        }

        const result = await response.json();

        // Map backend response (nested employee object) to flat form state
        if (result.success && result.data) {
          const record = result.data;
          setFormData({
            id: record.id?.toString() || '',
            name: record.employee?.name || 'N/A',
            employeeId: record.employee?.employeeId?.toString() || '',
            employeeType: record.employee?.jobType || '',
            date: record.generatedDate || '', // Ensure backend provides this in YYYY-MM-DD format
            basicSalary: record.basicSalary?.toString() || '0',
            netSalary: record.netSalary?.toString() || '0'
          });
        } else {
          console.error("Backend returned success:false", result.message);
          setStatus('error');
        }
      } catch (error) {
        console.error("Network or Fetch Error:", error);
        setStatus('error');
      } finally {
        setIsFetching(false);
      }
    };

    fetchSalaryData();
  }, [params?.id]);

  /**
   * Updates state for all input fields.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Sends a PUT request to update the payroll record including the date.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`http://localhost:2027/api/payroll/update/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basicSalary: parseFloat(formData.basicSalary),
          netSalary: parseFloat(formData.netSalary),
          generatedDate: formData.date // Added date to the update payload
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setTimeout(() => router.push('/hr_staff/attendance'), 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Update failed:", error);
      setStatus('error');
    }
  };

  if (isFetching) return <div className={styles.loading}>Connecting to Payroll Server...</div>;
  
  if (status === 'error' && !formData.id) {
    return (
      <div className={styles.container}>
        <p className={styles.errorText}>
          Error: Unable to load payroll record. Please check if the backend is running on port 2027.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {status === 'success' && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Payroll Record Updated!</p>
          </div>
        </div>
      )}

      <h1 className={styles.title}>Edit Salary Record</h1>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Employee Name:</label>
          <input type="text" value={formData.name} className={styles.whiteInput} readOnly />
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Employee ID:</label>
          <input type="text" value={formData.employeeId} className={styles.whiteInput} readOnly />
        </div>

        {/* --- New Date Update Field --- */}
        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Record Date:</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            className={styles.whiteInput} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Basic Salary (LKR):</label>
          <input 
            type="number" 
            name="basicSalary" 
            value={formData.basicSalary} 
            className={styles.whiteInput} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Net Salary (LKR):</label>
          <input 
            type="number" 
            name="netSalary" 
            value={formData.netSalary} 
            className={styles.whiteInput} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
          {status === 'loading' ? 'Processing...' : 'Update Record'}
        </button>
      </form>

      <div className={styles.backButtonContainer}>
        <button 
          type="button" 
          className={styles.backBtn} 
          onClick={() => router.push('/hr_staff/attendance')}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default EditSalaryPage;