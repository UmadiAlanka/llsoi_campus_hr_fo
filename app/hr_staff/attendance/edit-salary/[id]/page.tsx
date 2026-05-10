"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './edit-salary.module.css';

// Mock data (Simulating existing payroll records)
const initialSalaryRecords = [
  { id: '001', name: 'S.Perera', employeeId: '001', employeeType: 'Academic', date: '2024-01-05', basicSalary: '50000', netSalary: '52000' },
  { id: '002', name: 'M.Silva', employeeId: '002', employeeType: 'Non-academic', date: '2024-01-05', basicSalary: '60000', netSalary: '61000' },
];

const EditSalaryPage = () => {
  const router = useRouter();
  const params = useParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    employeeType: '',
    date: '',
    basicSalary: '',
    netSalary: ''
  });

  useEffect(() => {
    const record = initialSalaryRecords.find(rec => rec.id === params.id);
    if (record) {
      setFormData({
        name: record.name,
        employeeId: record.id,
        employeeType: record.employeeType,
        date: record.date,
        basicSalary: record.basicSalary,
        netSalary: record.netSalary
      });
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call to Java Backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      router.push('/hr_staff/attendance'); 
    }, 2000);
  };

  if (!formData.employeeId) return <div className={styles.loading}>Loading Salary Data...</div>;

  return (
    <div className={styles.container}>
      {status === 'success' && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Salary updated successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.title}>Attendance and payroll operations</h1>
      
      <div className={styles.subHeader}>
        <h2 className={styles.subtitle}>Edit/View Salary form</h2>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <h3 className={styles.formInternalTitle}>Salary form</h3>

        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Employee Name:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            className={styles.whiteInput} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Employee ID:</label>
          <input 
            type="text" 
            name="employeeId" 
            value={formData.employeeId} 
            className={styles.whiteInput} 
            readOnly 
          />
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Employee Type:</label>
          <select 
            name="employeeType" 
            value={formData.employeeType} 
            className={styles.whiteInput} 
            onChange={handleChange}
          >
            <option value="">Select Employee Type</option>
            <option value="Academic">Academic</option>
            <option value="Non-academic">Non-academic</option>
          </select>
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Date:</label>
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
          <label className={styles.fieldLabel}>Basic Salary:</label>
          <input 
            type="text" 
            name="basicSalary" 
            value={formData.basicSalary} 
            className={styles.whiteInput} 
            onChange={handleChange} 
          />
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Net Salary:</label>
          <input 
            type="text" 
            name="netSalary" 
            value={formData.netSalary} 
            className={styles.whiteInput} 
            onChange={handleChange} 
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitBtn} 
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Updating...' : 'Update Salary'}
        </button>
      </form>
    </div>
  );
};

export default EditSalaryPage;