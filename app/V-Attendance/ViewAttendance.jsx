import React from 'react';
import Link from 'next/link';
import styles from './ViewAttendance.module.css';

const ViewAttendance = () => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const statuses = ["Status", "Present", "Late", "On Leave", "Absent"];

  const attendanceData = [
    { date: '12/06/2025', in: '09:00AM', out: '05:30PM', hours: '08:30hrs', lateness: 'On-Time' },
    { date: '12/07/2025', in: '09:00AM', out: '05:30PM', hours: '08:30hrs', lateness: 'On-Time' },
    { date: '12/08/2025', in: '09:15AM Late', out: '05:30PM', hours: '08:15hrs', lateness: '15 mins late' },
    { date: '12/09/2025', in: 'Leave', out: 'Leave', hours: 'N/A', lateness: 'N/A' },
  ];

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
              Welcome, <strong>Employee Name!</strong>
            </p>
            <span>Employee ID</span>
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
            <Link href="/dashboard" className={styles.navLink}>
              <img src="/icons/dashboard.png" className={styles.navIcon} alt="" /> Dashboard
            </Link>
            <Link href="/V-Attendance" className={`${styles.navLink} ${styles.active}`}>
              <img src="/icons/attendance.png" className={styles.navIcon} alt="" /> View Attendance
            </Link>
            <Link href="/leave" className={styles.navLink}>
              <img src="/icons/leave.png" className={styles.navIcon} alt="" /> Request Leave
            </Link>
            <Link href="/salary" className={styles.navLink}>
              <img src="/icons/salary.png" className={styles.navIcon} alt="" /> View Salary
            </Link>
            <Link href="/logout" className={styles.navLink}>
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
              <select className={styles.selectInput} defaultValue="December">
                {months.map((m) => (
                  <option key={m} value={m}>{m} 2025</option>
                ))}
              </select>
            </div>
            <div className={styles.filterItem}>
              <select className={styles.selectInput}>
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
              <div className={styles.statBox}>18 Days Present</div>
              <div className={styles.statBox}>2 Days Late</div>
              <div className={styles.statBox}>0 days On Leave</div>
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
                {attendanceData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td className={row.in.includes('Late') ? styles.lateText : ''}>{row.in}</td>
                    <td>{row.out}</td>
                    <td>{row.hours}</td>
                    <td>{row.lateness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewAttendance;