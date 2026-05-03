"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './edit-attendance.module.css';

const EditAttendancePage = () => {
  const router = useRouter();
  const params = useParams(); // params.id contains the Employee ID from URL
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Form state to hold the attendance record details
  const [formData, setFormData] = useState({
    attendanceId: '',
    name: '',
    employeeId: '',
    type: 'Academic',
    course: 'BSc IT',
    department: 'IT',
    timeIn: '',
    timeOut: '',
    date: ''
  });

  /**
   * Fetch a specific employee's attendance record using their ID.
   * This runs when the page loads or the ID in the URL changes.
   */
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Fetching data from the filter endpoint using employeeId
        const response = await fetch(`http://localhost:2027/api/attendance/filter?employeeId=${params.id}`);
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        // Check if data was returned successfully
        if (result.success && result.data && result.data.length > 0) {
          // Get the most recent record (last item in the array)
          const record = result.data[result.data.length - 1]; 
          
          setFormData({
            attendanceId: record.id?.toString() || '', // This is the Primary Key (e.g., ID 4)
            name: record.employeeName || '', 
            employeeId: record.employeeId?.toString() || params.id as string,
            type: record.jobType || 'Academic',
            course: record.course || 'N/A', 
            department: record.department || '',
            timeIn: record.clockInTime || '', 
            timeOut: record.clockOutTime || '', 
            date: record.date || '' 
          });
        } else {
          // If no record found, at least set the employee ID from URL
          setFormData(prev => ({ ...prev, employeeId: params.id as string }));
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setStatus('error'); // Trigger error UI if needed
      }
    };

    if (params.id) {
      fetchAttendance();
    }
  }, [params.id]);

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Submit the updated attendance data to the backend.
   * Uses the Attendance Record ID (attendanceId) for the PUT request.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Data payload to be sent to Spring Boot
    const payload = {
      clockInTime: formData.timeIn,
      clockOutTime: formData.timeOut,
      date: formData.date,
      status: "PRESENT" 
    };

    try {
      const updateId = formData.attendanceId;
      if (!updateId) {
        alert("Cannot update: Attendance Record ID is missing!");
        setStatus('error');
        return;
      }

      // PUT request to update the record
      const response = await fetch(`http://localhost:2027/api/attendance/${updateId}?updatedBy=HR_Staff`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        // Redirect back to the main list after 2 seconds
        setTimeout(() => {
          router.push('/hr_staff/attendance');
        }, 2000);
      } else {
        alert("Update failed: " + result.message);
        setStatus('error');
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatus('error');
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Success Notification */}
      {status === 'success' && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Attendance updated successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.title}>Edit Attendance Record</h1>
      
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Name:</label>
          <input type="text" name="name" value={formData.name} className={styles.whiteInput} readOnly />
        </div>

        <div className={styles.row}>
          <div className={styles.inputWrapper}>
            <label className={styles.fieldLabel}>Employee ID:</label>
            <input type="text" name="employeeId" value={formData.employeeId} className={styles.whiteInput} readOnly />
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.fieldLabel}>Job Type:</label>
            <select name="type" value={formData.type} className={styles.whiteInput} onChange={handleChange}>
              <option value="Academic">Academic</option>
              <option value="Non-Academic">Non-Academic</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.inputWrapper}>
            <label className={styles.fieldLabel}>Time in:</label>
            <input type="time" name="timeIn" value={formData.timeIn} className={styles.whiteInput} onChange={handleChange} />
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.fieldLabel}>Time out:</label>
            <input type="time" name="timeOut" value={formData.timeOut} className={styles.whiteInput} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.fieldLabel}>Date:</label>
          <input type="date" name="date" value={formData.date} className={styles.whiteInput} onChange={handleChange} required />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
          {status === 'loading' ? 'Updating...' : 'Update Attendance'}
        </button>
      </form>
    </div>
  );
};

export default EditAttendancePage;