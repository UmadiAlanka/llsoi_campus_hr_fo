"use client";

import React, { useRef, useState } from 'react';
import styles from './adminMarkAttendance.module.css';
import { useRouter } from 'next/navigation';
import MessageBox from '../../components/MessageBox';

const AdminMarkAttendance: React.FC = () => {
  // 1. Unified State for Form
  const [employeeId, setEmployeeId] = useState('');
  const [attendanceType, setAttendanceType] = useState('Academic'); // Default value
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error';
    msg: string;
  }>({
    show: false,
    type: 'success',
    msg: '',
  });

  const handleCalendarClick = () => {
    if (dateInputRef.current && 'showPicker' in HTMLInputElement.prototype) {
      (dateInputRef.current as any).showPicker();
    }
  };

  const handleCloseModal = () => {
    const isSuccess = modal.type === 'success';
    setModal({ ...modal, show: false });
    if (isSuccess) router.push('/admin-dashboard/admin-attendance');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean ID: Convert "001" -> 1
    const cleanId = Number(employeeId);

    if (!cleanId || isNaN(cleanId)) {
      setModal({
        show: true,
        type: 'error',
        msg: "Please enter a valid numeric Employee ID"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Added 'type' to the query parameters so it saves the dropdown choice
      const response = await fetch(
        `http://localhost:2027/api/attendance/clock-in?employeeId=${cleanId}&markedBy=Admin&type=${attendanceType}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const result = await response.json();

      if (result.success) {
        setModal({
          show: true,
          type: 'success',
          msg: "Attendance marked successfully!"
        });
      } else {
        setModal({
          show: true,
          type: 'error',
          msg: result.message || "Attendance already marked for today"
        });
      }
    } catch (error) {
      setModal({
        show: true,
        type: 'error',
        msg: "Backend Connection Error."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className={styles.pageTitle}>Mark Attendance</h2>
      <div className={styles.formCard}>
        <form className={styles.attendanceForm} onSubmit={handleSubmit}>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee ID:</label>
              <input 
                type="number" 
                className={styles.input} 
                placeholder="Ex: 1" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Type:</label>
              <div className={styles.selectWrapper}>
                <select 
                  className={styles.select}
                  value={attendanceType}
                  onChange={(e) => setAttendanceType(e.target.value)}
                >
                  <option value="Academic">Academic</option>
                  <option value="Non-Academic">Non-academic</option>
                </select>
                <img src="/icons/dropdown.png" alt="" className={styles.selectIcon} />
              </div>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Time In:</label>
              <input type="time" className={styles.input} defaultValue="08:00" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date:</label>
              <div className={styles.dateWrapper} onClick={handleCalendarClick}>
                <input 
                  type="date" 
                  ref={dateInputRef} 
                  className={styles.dateInput} 
                  defaultValue={new Date().toISOString().split('T')[0]} 
                />
                <img src="/icons/calendar.png" alt="calendar" className={styles.calendarIcon} />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "SAVING..." : "SUBMIT"}
          </button>
        </form>
      </div>

      {modal.show && (
        <MessageBox 
          type={modal.type} 
          message={modal.msg} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default AdminMarkAttendance;