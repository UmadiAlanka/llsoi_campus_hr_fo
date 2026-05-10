"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './LeaveHistory.module.css';

const LeaveHistory = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchHistory(parsedUser.userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchHistory = async (userId) => {
    if (!userId) {
      console.error("No userId provided to fetchHistory");
      setLoading(false);
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";
    setError(null);
    try {
      // Trying the employee endpoint with no-cache
      const response = await fetch(`${API_URL}/leave/employee/${userId}`, { cache: 'no-store' });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }

      // Handle both ApiResponse wrapper and direct array response
      let data = [];
      if (result && result.data && Array.isArray(result.data)) {
        data = result.data;
      } else if (Array.isArray(result)) {
        data = result;
      } else if (result && result.success && Array.isArray(result.data)) {
        data = result.data;
      }

      setHistory(data);
    } catch (error) {
      console.error("Error fetching leave history:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return styles.statusPending;
    const s = status.toUpperCase();
    if (s === 'APPROVED' || s === 'Approved') return styles.statusApproved;
    if (s === 'REJECTED' || s === 'Rejected') return styles.statusRejected;
    return styles.statusPending;
  };

  // Helper to format date strings or arrays from backend
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    
    // If it's an array [YYYY, M, D]
    if (Array.isArray(dateValue)) {
      const [year, month, day] = dateValue;
      return new Date(year, month - 1, day).toLocaleDateString();
    }
    
    // If it's already a date string
    const date = new Date(dateValue);
    return date.toString() !== "Invalid Date" ? date.toLocaleDateString() : dateValue;
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
            <Link href="/employees/Leave_Request" className={styles.navLink}><img src="/icons/leave.png" className={styles.navIcon} /> Request Leave</Link>
            <Link href="/employees/Salary" className={styles.navLink}><img src="/icons/salary.png" className={styles.navIcon} /> View Salary</Link>
            <Link href="/login" className={styles.navLink}><img src="/icons/logout.png" className={styles.navIcon} /> Log Out</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Leave History</h2>

          <div className={styles.requestCard}>
            <div className={styles.balanceHeader}>
              <img src="/icons/MRcalender.png" alt="Calendar Icon" className={styles.balanceIcon} />
              <div>
                <p className={styles.balanceTitle}>Your Leave Records:</p>
              </div>
            </div>

            {loading ? (
              <p>Loading history...</p>
            ) : error ? (
              <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
                <p><strong>Error:</strong> {error}</p>
                <button onClick={() => fetchHistory(user.userId)} className={styles.submitBtn} style={{ marginTop: '10px' }}>Retry</button>
              </div>
            ) : history.length > 0 ? (
              <div className={styles.tableContainer}>
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id || Math.random()}>
                        <td>{formatDate(record.startDate || record.start_date)}</td>
                        <td>{formatDate(record.endDate || record.end_date)}</td>
                        <td>{record.reason}</td>
                        <td className={getStatusClass(record.status)}>
                          {record.status ? (record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase()) : 'Pending'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No leave history found.</p>
            )}

            <div className={styles.buttonRow}>
              <button type="button" className={styles.submitBtn} onClick={() => router.push('/employees')}>Back to Dashboard</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaveHistory;

