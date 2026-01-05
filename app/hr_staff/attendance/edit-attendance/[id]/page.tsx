"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './edit-attendance.module.css';

// Mock data 
const initialAttendanceRecords = [
  { id: '001', name: 'S.Perera', employeeId: '001', type: 'Academic', course: 'BSc IT', department: 'IT', timeIn: '08:30', timeOut: '16:30', date: '2023-10-27' },
  { id: '002', name: 'M.Silva', employeeId: '002', type: 'Non-academic', course: 'Finance Management', department: 'Finance', timeIn: '09:00', timeOut: '17:00', date: '2023-10-27' },
  { id: '003', name: 'N.Fernando', employeeId: '003', type: 'Academic', course: 'BSc IT', department: 'Finance', timeIn: '08:00', timeOut: '16:00', date: '2025-09-10' },
];

const EditAttendancePage = () => {
  const router = useRouter();
  const params = useParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    type: '',
    course: '',
    department: '',
    timeIn: '',
    timeOut: '',
    date: ''
  });

  useEffect(() => {
    const record = initialAttendanceRecords.find(rec => rec.id === params.id);
    if (record) {
      setFormData(record);
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      router.push('/hr_staff/attendance');
    }, 2000);
  };

  if (!formData.employeeId) return <div className={styles.loading}>Loading Attendance Data...</div>;

  return (
    <div className={styles.container}>
      {status === 'success' && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Attendance updated successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.title}>Attendance and payroll operations</h1>
      
      <div className={styles.subHeader}>
        <h2 className={styles.subtitle}>Edit / View Attendance form</h2>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            className={styles.whiteInput} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Employee ID and Select Type */}
        <div className={styles.row}>
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
            <label className={styles.fieldLabel}>Select Type:</label>
            <select 
              name="type" 
              value={formData.type} 
              className={styles.whiteInput} 
              onChange={handleChange}
            >
              <option value="Academic">Academic</option>
              <option value="Non-academic">Non-academic</option>
            </select>
          </div>
        </div>

        {/* Select Course and Select Department */}
        <div className={styles.row}>
          <div className={styles.inputWrapper}>
            <label className={styles.fieldLabel}>Select Course:</label>
            <select 
              name="course" 
              value={formData.course} 
              className={styles.whiteInput} 
              onChange={handleChange}
            >
              <option value="BSc IT">BSc IT</option>
              <option value="Finance Management">Finance Management</option>
            </select>
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.fieldLabel}>Select Department:</label>
            <select 
              name="department" 
              value={formData.department} 
              className={styles.whiteInput} 
              onChange={handleChange}
            >
              <option value="IT">IT</option>
              <option value="Management">Management</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>

        {/* Time In and Time Out */}
        <div className={styles.row}>
          <div className={styles.inputWrapper}>
            <label className={styles.fieldLabel}>Time in:</label>
            <input 
              type="time" 
              name="timeIn" 
              value={formData.timeIn} 
              className={styles.whiteInput} 
              onChange={handleChange} 
            />
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.fieldLabel}>Time out:</label>
            <input 
              type="time" 
              name="timeOut" 
              value={formData.timeOut} 
              className={styles.whiteInput} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Date Field */}
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

        <button 
          type="submit" 
          className={styles.submitBtn} 
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Updating...' : 'Update Attendance'}
        </button>
      </form>
    </div>
  );
};

export default EditAttendancePage;