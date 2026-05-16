"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ViewAttendance.module.css';

export default function ViewAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const statuses = ["ALL", "PRESENT", "LATE", "ABSENT", "LEAVE"];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      fetchAttendance(userData.userId, userData.username, selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  const fetchAttendance = async (userId, username, month, year) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";
    // We only need one identifier now as the backend is smart
    const identifier = user?.numericId || userId || username;
    try {
      const response = await fetch(`${API_URL}/attendance/employee/${identifier}?month=${month + 1}&year=${year}`, { cache: 'no-store' });
      const result = await response.json();
      const data = (Array.isArray(result) ? result : (result.data || []))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAttendance(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return '-';
    if (Array.isArray(dateVal)) {
      return `${dateVal[0]}-${String(dateVal[1]).padStart(2, '0')}-${String(dateVal[2]).padStart(2, '0')}`;
    }
    return dateVal;
  };

  const formatTime = (timeVal) => {
    if (!timeVal) return null;
    if (Array.isArray(timeVal)) {
      return `${String(timeVal[0]).padStart(2, '0')}:${String(timeVal[1]).padStart(2, '0')}:${String(timeVal[2] || 0).padStart(2, '0')}`;
    }
    return timeVal;
  };

  const calculateTotalHours = (item) => {
    const inRaw = item.clockInTime || item.checkInTime || item.checkIn || item.clockIn;
    const outRaw = item.clockOutTime || item.checkOutTime || item.checkOut || item.clockOut;
    const checkIn = formatTime(inRaw);
    const checkOut = formatTime(outRaw);
    if (!checkIn || !checkOut) return "0.00";
    try {
      const inTime = new Date(`2000-01-01T${checkIn}`);
      const outTime = new Date(`2000-01-01T${checkOut}`);
      const diff = (outTime - inTime) / (1000 * 60 * 60);
      return diff > 0 ? diff.toFixed(2) : "0.00";
    } catch (e) { return "0.00"; }
  };

  const getAttendanceStatus = (item, totalHours) => {
    const inRaw = item.clockInTime || item.checkInTime || item.checkIn || item.clockIn;
    const checkIn = formatTime(inRaw);
    if (!checkIn) return "ABSENT";
    
    // Strict Rule: Work under 4 hours is ABSENT
    const hours = parseFloat(totalHours);
    if (hours < 4.00) return "ABSENT";

    const checkInTime = new Date(`2000-01-01T${checkIn}`);
    const nineAM = new Date(`2000-01-01T09:00:00`);
    return checkInTime > nineAM ? "LATE" : "PRESENT";
  };

  const attendanceList = Array.isArray(attendance) ? attendance : [];

  const filteredAttendance = attendanceList.filter(item => {
    if (selectedStatus === 'ALL') return true;
    const hours = calculateTotalHours(item);
    const status = getAttendanceStatus(item, hours);
    return status === selectedStatus;
  });

  const getSummary = () => {
    let present = 0;
    let late = 0;
    let leave = 0;

    attendanceList.forEach(item => {
      const hours = calculateTotalHours(item);
      const status = getAttendanceStatus(item, hours);
      if (status === "PRESENT") present++;
      if (status === "LATE") late++;
      if (status === "ABSENT" || status === "LEAVE") leave++;
    });

    return { present, late, leave };
  };

  const summary = getSummary();

  return (
    <div className={styles.appContainer}>

  <header className={styles.topHeader}>
    <div className={styles.headerLeft}>
      <img src="/logo.png" alt="Logo" className={styles.mainLogo} />
      <h1 className={styles.systemTitle}>LLSOI Campus HR Management System</h1>
    </div>
    <div className={styles.userProfile}>
      <div className={styles.userText}>
            <p>Welcome, <strong>{user ? user.name : 'Employee'}!</strong></p>
            <span>Employee ID: {user ? user.username : ''}</span>
          </div >
  <img src="/icons/user-profile.png" alt="User" className={styles.avatarImg} />
        </div >
      </header >

  <div className={styles.dashboardBody}>
    <aside className={styles.sidebar}>
      <nav className={styles.navMenu}>
        <Link href="/employees" className={styles.navLink}>
          <img src="/icons/dashboard.png" className={styles.navIcon} alt="" /> Dashboard
        </Link>
        <Link href="/employees/V-Attendance" className={`${styles.navLink} ${styles.active}`}>
          <img src="/icons/attendance.png" className={styles.navIcon} alt="" /> View Attendance
        </Link>
        <Link href="/employees/Leave_Request" className={styles.navLink}>
          <img src="/icons/leave.png" className={styles.navIcon} alt="" /> Request Leave
        </Link>
        <Link href="/employees/Salary" className={styles.navLink}>
          <img src="/icons/salary.png" className={styles.navIcon} alt="" /> View Salary
        </Link>
        <Link href="/login" className={styles.navLink}>
          <img src="/icons/logout.png" className={styles.navIcon} alt="" /> Log Out
        </Link>
      </nav>
    </aside>

    <main className={styles.mainContent}>
      <h2 className={styles.pageTitle}>Attendance</h2>
  <div className={styles.filterRow}>
    <button className={styles.refreshBtn} onClick={() => fetchAttendance(user.userId, user.username, selectedMonth, selectedYear)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
      Refresh Data
    </button>
    <div className={styles.filterItem}>
    <label className={styles.filterLabel}>Month/Year</label>
    <div style={{ display: 'flex', gap: '10px' }}>
      <select className={styles.selectInput} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
        {months.map((m, index) => (<option key={m} value={index}>{m}</option>))}
      </select>
      <select className={styles.selectInput} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
        {[2024, 2025, 2026, 2027, 2028].map((y) => (<option key={y} value={y}>{y}</option>))}
      </select>
    </div>
  </div>
  <div className={styles.filterItem}>
<select className={styles.selectInput} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
  {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
  </select>
</div>
          </div >

  <div className={styles.summaryCard}>
    <div className={styles.summaryHeader}>
      <div className={styles.redTargetIcon}><div className={styles.innerDot}></div></div>
      <h3>Monthly Attendance Summary:</h3>
    </div>
    <div className={styles.statsGrid}>
      <div className={styles.statBox}>{summary.present} Present (On-Time)</div>
      <div className={styles.statBox}>{summary.late} Late (After 9 AM)</div>
<div className={styles.statBox}>{summary.leave} Total Leaves</div>
            </div >
          </div >

  <div className={styles.tableWrapper}>
    <table className={styles.attendanceTable}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Check-in-Time IN</th>
          <th>Check-out-Time OUT</th>
          <th>Total Hours</th>
          <th>Lateness</th>
        </tr>
      </thead>
      <tbody>
        {filteredAttendance.length > 0 ? (
          filteredAttendance.map((item, index) => {
            const inTimeStr = formatTime(item.clockInTime || item.checkInTime || item.checkIn || item.clockIn);
            const outTimeStr = formatTime(item.clockOutTime || item.checkOutTime || item.checkOut || item.clockOut);
            const hours = calculateTotalHours(item);
            const status = getAttendanceStatus(item, hours);
            return (
              <tr key={index}>
                <td>{formatDate(item.date)}</td>
                <td>{inTimeStr || '-'}</td>
                <td>{outTimeStr || '-'}</td>
                <td>{hours}</td>
                <td className={status === 'PRESENT' ? styles.statusPresent : styles.statusLate}>
                  {status}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="5" className={styles.noData}>No attendance records found for the selected month/year.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
        </main >
      </div >
    </div >
  );
}