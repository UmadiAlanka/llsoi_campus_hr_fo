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

    // 1. Filter by Month/Year
    let filtered = allData.filter(record => {
      const dateObj = parseDate(record.date);
      return dateObj.getMonth() === parseInt(selectedMonth) && dateObj.getFullYear() === parseInt(selectedYear);
    });

    const newStats = { present: 0, late: 0, leave: 0 };
    const transformed = [];

    // 2. Process everything in ONE loop to ensure summary matches table
    filtered.forEach(record => {
      const inTime = formatTime(record.clockInTime);
      const outTime = formatTime(record.clockOutTime);
      
      let hrs = record.workingHours;
      if (hrs === null && inTime && outTime) {
        try {
          const [h1, m1] = inTime.split(':').map(Number);
          const [h2, m2] = outTime.split(':').map(Number);
          const diff = (h2 + m2/60) - (h1 + m1/60);
          hrs = diff > 0 ? diff : 0;
        } catch (e) { hrs = 0; }
      }

      let stat = (record.status || 'PRESENT').toUpperCase();
      
      // APPLY THE RULE: Less than 4 hours is always ABSENT
      if (hrs !== null && hrs > 0 && hrs < 4) {
        stat = 'ABSENT';
      }

      // Update Summary Counters
      if (stat === 'PRESENT') newStats.present++;
      else if (stat === 'LATE') newStats.late++;
      else newStats.leave++; // Absent, Half-Day, On Leave, etc.

      // Map labels for display
      let label = 'On-Time';
      if (stat === 'LATE') label = 'Late';
      else if (stat === 'ABSENT') label = 'Absent';
      else if (stat === 'HALF_DAY') label = 'Half-Day';
      else if (stat === 'ON LEAVE' || stat === 'LEAVE') label = 'Leave';

      // 3. Apply Status Filter to the display list (but summary keeps all)
      let matchesFilter = true;
      if (selectedStatus !== "Status") {
        const sel = selectedStatus.toUpperCase();
        if (sel === 'LATE') matchesFilter = (stat === 'LATE');
        else if (sel === 'PRESENT') matchesFilter = (stat === 'PRESENT');
        else if (sel === 'ABSENT') matchesFilter = (stat === 'ABSENT');
        else if (sel === 'ON LEAVE') matchesFilter = (stat === 'ON LEAVE' || stat === 'LEAVE' || stat === 'HALF_DAY');
      }

      if (matchesFilter) {
        transformed.push({
          date: parseDate(record.date).toLocaleDateString(),
          in: inTime || 'N/A',
          out: outTime || 'N/A',
          hours: (hrs !== null && hrs !== undefined) ? Number(hrs).toFixed(1) + ' hrs' : 'N/A',
          lateness: label,
          status: stat
        });
      }
    });

    setSummary(newStats);
    setAttendanceData(transformed);
  }, [allData, selectedMonth, selectedYear, selectedStatus]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const statuses = ["Status", "Present", "Late", "On Leave", "Absent"];

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
          </div>
          <img src="/icons/user-profile.png" alt="User" className={styles.avatarImg} />
        </div>
      </header>

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
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div className={styles.redTargetIcon}><div className={styles.innerDot}></div></div>
              <h3>Monthly Attendance Summary:</h3>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>{summary.present} Present (On-Time)</div>
              <div className={styles.statBox}>{summary.late} Late (After 9 AM)</div>
              <div className={styles.statBox}>{summary.leave} Total Leaves</div>

            </div>
          </div>

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
                      <td className={row.status === 'LATE' ? styles.lateText : ''}>{row.in}</td>
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