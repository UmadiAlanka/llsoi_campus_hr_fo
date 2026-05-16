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
      fetchAttendance(userData.username, selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  const fetchAttendance = async (username, month, year) => {
    try {
      const response = await fetch(`http://localhost:2027/api/attendance/employee/${username}?month=${month + 1}&year=${year}`);
      const data = await response.json();
      setAttendance(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const calculateTotalHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "0.00";
    const inTime = new Date(`2000-01-01T${checkIn}`);
    const outTime = new Date(`2000-01-01T${checkOut}`);
    const diff = (outTime - inTime) / (1000 * 60 * 60);
    return diff.toFixed(2);
  };

  const getAttendanceStatus = (checkIn, totalHours) => {
    if (!checkIn) return "ABSENT";
    
    // Strict Rule: Work under 4 hours is ABSENT
    const hours = parseFloat(totalHours);
    if (hours < 4.00) return "ABSENT";

    const checkInTime = new Date(`2000-01-01T${checkIn}`);
    const nineAM = new Date(`2000-01-01T09:00:00`);
    return checkInTime > nineAM ? "LATE" : "PRESENT";
  };

  const filteredAttendance = attendance.filter(item => {
    if (selectedStatus === 'ALL') return true;
    const hours = calculateTotalHours(item.checkInTime, item.checkOutTime);
    const status = getAttendanceStatus(item.checkInTime, hours);
    return status === selectedStatus;
  });

  const getSummary = () => {
    let present = 0;
    let late = 0;
    let leave = 0;

    attendance.forEach(item => {
      const hours = calculateTotalHours(item.checkInTime, item.checkOutTime);
      const status = getAttendanceStatus(item.checkInTime, hours);
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
            const hours = calculateTotalHours(item.checkInTime, item.checkOutTime);
            return (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.checkInTime || '-'}</td>
                <td>{item.checkOutTime || '-'}</td>
                <td>{hours}</td>
                <td className={getAttendanceStatus(item.checkInTime, hours) === 'PRESENT' ? styles.statusPresent : styles.statusLate}>
                  {getAttendanceStatus(item.checkInTime, hours)}
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