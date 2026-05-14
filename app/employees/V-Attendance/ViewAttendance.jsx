"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './ViewAttendance.module.css';

const ViewAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({ present: 0, late: 0, leave: 0 });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStatus, setSelectedStatus] = useState("Status");

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchAttendance(parsedUser.userId);
    }
  }, []);

  const fetchAttendance = async (userId) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";
    try {
      const response = await fetch(`${API_URL}/attendance/employee/${userId}`, { cache: 'no-store' });
      const result = await response.json();
      let attendance = [];
      if (result.data && Array.isArray(result.data)) {
        attendance = result.data;
      } else if (Array.isArray(result)) {
        attendance = result;
      }
      setAllData(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    const parseDate = (dateVal) => {
      if (Array.isArray(dateVal)) return new Date(dateVal[0], dateVal[1] - 1, dateVal[2]);
      return new Date(dateVal);
    };

    const formatTime = (timeVal) => {
      if (!timeVal) return null;
      if (Array.isArray(timeVal)) {
        return `${String(timeVal[0]).padStart(2, '0')}:${String(timeVal[1]).padStart(2, '0')}:${String(timeVal[2] || 0).padStart(2, '0')}`;
      }
      return timeVal;
    };

    let filtered = allData.filter(record => {
      const dateObj = parseDate(record.date);
      const recordMonth = dateObj.getMonth();
      const recordYear = dateObj.getFullYear();
      return recordMonth === parseInt(selectedMonth) && recordYear === parseInt(selectedYear);
    });

    // Calculate Summary based on times
    const stats = filtered.reduce((acc, curr) => {
      if (curr.status && curr.status.toLowerCase() === 'present') {
        const time = formatTime(curr.clockInTime);
        if (time && time > "09:00:00") acc.late++;
        else acc.present++;
      } else if (curr.status && (curr.status.toLowerCase() === 'absent' || curr.status.toLowerCase() === 'on leave')) {
        acc.leave++;
      }
      return acc;
    }, { present: 0, late: 0, leave: 0 });

    setSummary(stats);

    if (selectedStatus !== "Status") {
      filtered = filtered.filter(record => {
        const status = record.status ? record.status.toLowerCase() : '';
        const time = formatTime(record.clockInTime);
        if (selectedStatus.toLowerCase() === 'late') return time > "09:00:00";
        if (selectedStatus.toLowerCase() === 'present') return status === 'present' && (!time || time <= "09:00:00");
        return status === selectedStatus.toLowerCase();
      });
    }

    const transformedData = filtered.map(record => {
      let hours = 'N/A';
      const inTime = formatTime(record.clockInTime);
      const outTime = formatTime(record.clockOutTime);

      if (inTime && outTime) {
        try {
          const [h1, m1] = inTime.split(':').map(Number);
          const [h2, m2] = outTime.split(':').map(Number);
          const diff = (h2 + m2/60) - (h1 + m1/60);
          hours = diff > 0 ? diff.toFixed(1) + ' hrs' : 'N/A';
        } catch (e) { hours = 'N/A'; }
      }

      const isLate = inTime && inTime > "09:00:00";

      return {
        date: parseDate(record.date).toLocaleDateString(),
        in: inTime || 'N/A',
        out: outTime || 'N/A',
        hours: hours,
        lateness: isLate ? 'Late' : 'On-Time',
        rawStatus: isLate ? 'Late' : (record.status || 'Present')
      };
    });

    setAttendanceData(transformedData);
  }, [allData, selectedMonth, selectedYear, selectedStatus]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const statuses = ["Status", "Present", "Late", "On Leave", "Absent"];

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
        {/* Sidebar Navigation */}
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

        {/* Main Attendance Content */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Attendance</h2>
          {/* Filters: Month/Year and Status */}
          <div className={styles.filterRow}>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>Month/Year</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  className={styles.selectInput} 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((m, index) => (
                    <option key={m} value={index}>{m}</option>
                  ))}
                </select>
                <select 
                  className={styles.selectInput} 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {[2024, 2025, 2026, 2027, 2028].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.filterItem}>
              <select 
                className={styles.selectInput}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Monthly Attendance Summary Card */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div className={styles.redTargetIcon}>
                <div className={styles.innerDot}></div>
              </div>
              <h3>Monthly Attendance Summary:</h3>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>{summary.present} Present (On-Time)</div>
              <div className={styles.statBox}>{summary.late} Late (After 9 AM)</div>
              <div className={styles.statBox}>{summary.leave} Absent/Leave</div>
            </div>
          </div>

          {/* Attendance Data Table */}
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
                {attendanceData.length > 0 ? (
                  attendanceData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.date}</td>
                      <td className={row.rawStatus === 'Late' ? styles.lateText : ''}>{row.in}</td>
                      <td>{row.out}</td>
                      <td>{row.hours}</td>
                      <td>{row.lateness}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5">No attendance records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewAttendance;