import React from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.appContainer}>
      {/* FULL WIDTH RED HEADER */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <img src="/logo.png" alt="LLSOI Logo" className={styles.mainLogo} />
          <h1 className={styles.systemTitle}>LLSOI Campus HR Management System</h1>
        </div>

        <div className={styles.userProfile}>
          <div className={styles.userText}>
            <p>welcome, <strong>Employee Name!</strong></p>
            <span>Employee ID</span>
          </div>
          <div className={styles.profileAvatar}>
            {/* Removed the circular container for a normal look */}
            <img src="/icons/user-profile.png" alt="User" className={styles.avatarImg} />
          </div>
        </div>
      </header>

      <div className={styles.dashboardBody}>
        {/* SIDEBAR (Logo removed from here) */}
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            {/* Link to Dashboard */}
            <Link href="/dashboard" className={`${styles.navLink} ${styles.active}`}>
              <img src="/icons/dashboard.png" alt="" className={styles.navIcon} /> Dashboard
            </Link>

            {/* Link to Attendance */}
            <Link href="/attendance" className={styles.navLink}>
              <img src="/icons/attendance.png" alt="" className={styles.navIcon} /> View Attendance
            </Link>

            {/* Link to Leave Request */}
            <Link href="/leave" className={styles.navLink}>
              <img src="/icons/leave.png" alt="" className={styles.navIcon} /> Request Leave
            </Link>

            {/* Link to Salary */}
            <Link href="/salary" className={styles.navLink}>
              <img src="/icons/salary.png" alt="" className={styles.navIcon} /> View Salary
            </Link>

            {/* Link to Logout/Login */}
            <Link href="/login" className={styles.navLink}>
              <img src="/icons/logout.png" alt="" className={styles.navIcon} /> Log Out
            </Link>
          </nav>
        </aside>
        
        {/* MAIN CONTENT */}
        <main className={styles.mainContent}>
          <section className={styles.pageBody}>
            <h2 className={styles.sectionHeading}>Dashboard</h2>

            <div className={styles.attendanceHero}>
              <h3 className={styles.attendanceDate}>Attendance for December 6, 2025</h3>
              <button className={styles.markAttendanceBtn}>
                <img src="/icons/check-circle3.png" alt="" className={styles.btnIcon} /> Mark Attendance
              </button>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.whiteCard}>
                <img src="/icons/leave-balance.png" alt="" className={styles.cardIcon} />
                <p className={styles.cardLabel}>Leave Balance</p>
                <div className={styles.statValue}>12</div>
                <p className={styles.statSubtext}>/15 Days left</p>
              </div>

              <div className={styles.whiteCard}>
                <img src="/icons/upcoming.png" alt="" className={styles.cardIcon} />
                <p className={styles.cardLabel}>Upcoming Leave</p>
                <div className={styles.dateValue}>Dec 25th Christmas</div>
              </div>

              <div className={styles.whiteCard}>
                <img src="/icons/monthly-attendance.png" alt="" className={styles.cardIcon} />
                <p className={styles.cardLabel}>Monthly Attendance</p>
                <div className={styles.attendanceDetail}>
                  <p>15 Days Present,</p>
                  <p>2 Days Late</p>
                </div>
              </div>
            </div>

            <h2 className={styles.sectionHeading}>Quick Action</h2>
            <div className={styles.actionsGrid}>
              <button className={styles.actionButton}>
                <img src="/icons/request-btn.png" alt="" className={styles.smallBtnIcon} /> Request Leave
              </button>
              <button className={styles.actionButton}>
                <img src="/icons/payslip-btn.png" alt="" className={styles.smallBtnIcon} /> View Payslip
              </button>
              <button className={styles.actionButton}>
                <img src="/icons/history-btn.png" alt="" className={styles.smallBtnIcon} /> View Leave History
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;