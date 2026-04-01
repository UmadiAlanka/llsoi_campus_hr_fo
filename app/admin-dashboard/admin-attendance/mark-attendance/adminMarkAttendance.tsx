"use client";

import React, { useRef, useState } from 'react';
import styles from './adminMarkAttendance.module.css';
import { useRouter } from 'next/navigation';

const AdminMarkAttendance: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleCalendarClick = () => {
    if (dateInputRef.current && 'showPicker' in HTMLInputElement.prototype) {
      (dateInputRef.current as any).showPicker();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validating ID (Assuming your DB uses numeric IDs)
    if (!employeeId) {
      alert("Please enter a valid Employee ID number");
      return;
    }

    setIsSubmitting(true);

    try {
      // Your Controller uses @RequestParam, so we append them to the URL
      const response = await fetch(
        `http://localhost:2027/api/attendance/clock-in?employeeId=${employeeId}&markedBy=Admin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Attendance marked successfully in database!");
        router.push('/admin-dashboard/admin-attendance'); // Redirect back to table
      } else {
        // This will show "Attendance already marked for today" or "Employee not found"
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Could not connect to the server. Check if Backend is running on 2027.");
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
              <label className={styles.label}>Employee ID (Numeric):</label>
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
                <select className={styles.select}>
                  <option value="">-- Select --</option>
                  <option value="academic">Academic</option>
                  <option value="non-academic">Non-academic</option>
                </select>
                <img src="/icons/dropdown.png" alt="" className={styles.selectIcon} />
              </div>
            </div>
          </div>

          {/* ... Other fields like Course/Dept can stay for UI, 
              but ID is the key that saves to DB ... */}

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
    </>
  );
};

export default AdminMarkAttendance;