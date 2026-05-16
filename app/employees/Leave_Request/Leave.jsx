"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Leave.module.css';
import { toast } from 'react-hot-toast';

const LeaveRequest = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(48);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    type: '',
    reason: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchLeaveBalance(parsedUser.userId);
    }
  }, []);

  const parseDate = (dateVal) => {
    if (Array.isArray(dateVal)) return new Date(dateVal[0], dateVal[1] - 1, dateVal[2]);
    return new Date(dateVal);
  };

  const fetchLeaveBalance = async (userId) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";
    try {
      // 1. Try fetching directly from the new balance endpoint
      const balanceRes = await fetch(`${API_URL}/leave/employee/${userId}/balance`);
      const balanceResult = await balanceRes.json();
      
      if (balanceRes.ok && balanceResult.success) {
        setLeaveBalance(balanceResult.data);
        return;
      }

      // 2. Fallback to manual calculation if endpoint fails
      const response = await fetch(`${API_URL}/leave/employee/${userId}`);
      const result = await response.json();
      const leaves = (result && result.data) || (Array.isArray(result) ? result : []);
      const currentYear = new Date().getFullYear();
      const usedLeaves = leaves
        .filter(l => l.status && l.status.toUpperCase() === 'APPROVED')
        .filter(l => parseDate(l.startDate).getFullYear() === currentYear)
        .reduce((sum, l) => {
          const start = parseDate(l.startDate);
          const end = parseDate(l.endDate);
          if (isNaN(start.getTime()) || isNaN(end.getTime())) return sum;
          const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
          return sum + (diffDays > 0 ? diffDays : 0);
        }, 0);
      setLeaveBalance(48 - usedLeaves);
    } catch (error) {
      console.error("Error fetching leave balance:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('User data is not loaded yet. Please refresh and try again.');
      return;
    }

    setLoading(true);
    setMessage('');

    // Calculate requested days
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (end < start) {
      toast.error('End date cannot be before start date.');
      setLoading(false);
      return;
    }

    const requestedDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (requestedDays > leaveBalance) {
      toast.error(`Insufficient leave balance. You only have ${leaveBalance} days left.`);
      setLoading(false);
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";

    try {
      let response;
      const endpoint = `/leave/request/${encodeURIComponent(user.userId)}`;
      if (formData.file) {
        const data = new FormData();
        data.append('employeeId', user.userId);
        data.append('startDate', formData.startDate);
        data.append('endDate', formData.endDate);
        data.append('reason', `${formData.type}: ${formData.reason}`);
        data.append('document', formData.file);

        response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          body: data
        });
      } else {
        response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeId: user.userId,
            startDate: formData.startDate,
            endDate: formData.endDate,
            reason: `${formData.type}: ${formData.reason}`
          })
        });
      }

      let result = {};
      try {
        result = await response.json();
      } catch (jsonError) {
        console.warn('Response is not valid JSON', jsonError);
      }

      if (response.ok && (result.success || !result.hasOwnProperty('success'))) {
        setMessage('Leave request submitted successfully!');
        toast.success('Leave request submitted successfully!');
        setFormData({ startDate: '', endDate: '', type: '', reason: '', file: null }); // Reset form
        fetchLeaveBalance(user.userId);
      } else {
        toast.error(result.message || 'Failed to submit request.');
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      toast.error('Error submitting request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.appContainer}>
      {/* HEADER */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <img src="/logo.png" alt="Logo" className={styles.mainLogo} />
          <h1 className={styles.systemTitle}>
            LLSOI Campus HR Management System
          </h1>
        </div>

        <div className={styles.userProfile}>
          <div className={styles.userText}>
            <p>
              Welcome, <strong>{user ? user.name : 'Employee'}!</strong>
            </p>
            <span>Employee ID: {user ? user.username : ''}</span>
          </div>
          <img
            src="/icons/user-profile.png"
            alt="User"
            className={styles.avatarImg}
          />
        </div>
      </header>

      <div className={styles.dashboardBody}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            <Link href="/employees" className={styles.navLink}><img src="/icons/dashboard.png" className={styles.navIcon} /> Dashboard</Link>
            <Link href="/employees/V-Attendance" className={styles.navLink}><img src="/icons/attendance.png" className={styles.navIcon} /> View Attendance</Link>
            <Link href="/employees/Leave_Request" className={`${styles.navLink} ${styles.active}`}><img src="/icons/leave.png" className={styles.navIcon} /> Request Leave</Link>
            <Link href="/employees/Salary" className={styles.navLink}><img src="/icons/salary.png" className={styles.navIcon} /> View Salary</Link>
            <Link href="/login" className={styles.navLink}><img src="/icons/logout.png" className={styles.navIcon} /> Log Out</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Request Leave</h2>

          <div className={styles.requestCard}>
            <div className={styles.balanceHeader}>
              <img src="/icons/MRcalender.png" alt="Calendar Icon" className={styles.balanceIcon} />
              <div>
                <p className={styles.balanceTitle}>Leave Balance:</p>
                <p className={styles.balanceDays}><strong>{leaveBalance}</strong> /48 Days Left</p>
              </div>
            </div>

            {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}

            <form className={styles.leaveForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Name:</label>
                  <input type="text" value={user ? user.name : ''} readOnly />
                </div>

                <div className={styles.formGroup}>
                  <label>ID:</label>
                  <input type="text" value={user ? user.username : ''} readOnly />
                </div>

                <div className={styles.formGroup}>
                  <label>Start Date:</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="date"
                      className={styles.dateInput}
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                    <img
                      src="/icons/Rcalender.png"
                      alt="Calendar"
                      className={styles.innerCalendarIcon}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>End Of Leave:</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="date"
                      className={styles.dateInput}
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                    <img
                      src="/icons/Rcalender.png"
                      alt="Calendar"
                      className={styles.innerCalendarIcon}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Type Of Leave:</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="">Select Type Of Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Reason For Leave</label>
                <textarea
                  rows={3}
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className={styles.uploadSection}>
                <label htmlFor="file-upload" className={styles.uploadLabel}>
                  <img src="/icons/upload.png" alt="Upload" className={styles.uploadIcon} />
                  <span className={styles.uploadText}>{formData.file ? formData.file.name : "Optional : Upload Supporting Documents"}</span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              <div className={styles.buttonRow}>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Submitting...' : 'SUBMIT REQUEST'}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={() => router.push('/employees')}>Cancel</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaveRequest;