import React from 'react';
import Link from 'next/link';
import styles from './Attendance.module.css';

const AttendancePage = () => {
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
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            <Link href="/Dashboard" className={styles.navLink}>
              <img src="/icons/dashboard.png" className={styles.navIcon} />
              Dashboard
            </Link>

            <Link href="/attendance" className={styles.navLink}>
              <img src="/icons/attendance.png" className={styles.navIcon} />
              View Attendance
            </Link>

            <Link href="/leave" className={styles.navLink}>
              <img src="/icons/leave.png" className={styles.navIcon} />
              Request Leave
            </Link>

            <Link href="/salary" className={styles.navLink}>
              <img src="/icons/salary.png" className={styles.navIcon} />
              View Salary
            </Link>

            <Link href="/login" className={styles.navLink}>
              <img src="/icons/logout.png" className={styles.navIcon} />
              Log Out
            </Link>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Mark Attendance</h2>

          <div className={styles.formContainer}>
            <form className={styles.attendanceForm}>
              <div className={styles.fullWidth}>
                <label>Name</label>
                <input type="text" placeholder="Enter your name" />
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label>Employee ID</label>
                  <input type="text" />
                </div>

                <div>
                  <label>Select Type</label>
                  <select>
                    <option>Select Type</option>
                    <option>In</option>
                    <option>Out</option>
                  </select>
                </div>

                <div>
                  <label>Time In</label>
                  <input type="time" />
                </div>

                <div>
                  <label>Department</label>
                  <select>
                    <option>Select Department</option>
                    <option>HR</option>
                    <option>IT</option>
                  </select>
                </div>

                <div>
                  <label>Time Out</label>
                  <input type="time" />
                </div>

                <div>
                  <label>Date</label>
                  <div className={styles.inputWrapper}>
                    <input type="date" className={styles.dateInput} />
                    <img
                      src="/icons/calendar.png"
                      alt="Calendar"
                      className={styles.innerCalendarIcon}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                SUBMIT
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendancePage;
