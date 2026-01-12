import React from 'react';
import styles from './Leave.module.css';

const LeaveRequest = () => {
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
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            <div className={styles.navLink}><img src="/icons/dashboard.png" className={styles.navIcon} /> Dashboard</div>
            <div className={styles.navLink}><img src="/icons/attendance.png" className={styles.navIcon} /> View Attendance</div>
            <div className={`${styles.navLink} ${styles.active}`}><img src="/icons/leave.png" className={styles.navIcon} /> Request Leave</div>
            <div className={styles.navLink}><img src="/icons/salary.png" className={styles.navIcon} /> View Salary</div>
            <div className={styles.navLink}><img src="/icons/logout.png" className={styles.navIcon} /> Log Out</div>
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
                <p className={styles.balanceDays}><strong>12</strong> /15 Days Left</p>
              </div>
            </div>

            <form className={styles.leaveForm}>
             <div className={styles.formRow}>
                 <div className={styles.formGroup}>
                    <label>Name:</label>
                    <input type="text" placeholder="Enter Name" />
                    </div>

                  <div className={styles.formGroup}>
                    <label>ID:</label>
                    <input type="text" placeholder="Enter Your ID" />
                    </div>

                 <div className={styles.formGroup}>
                    <label>Start Date:</label>
                    <div className={styles.inputWrapper}> 
                        <input type="date" className={styles.dateInput} />
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
                        <input type="date" className={styles.dateInput} />
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
                <select>
                  <option>Select Type Of Leave</option>
                  <option>Sick Leave</option>
                  <option>Annual Leave</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Reason For Leave</label>
                <textarea rows={3}></textarea>
              </div>

              <div className={styles.uploadSection}>
                <label htmlFor="file-upload" className={styles.uploadLabel}>
                    <img src="/icons/upload.png" alt="Upload" className={styles.uploadIcon} />
                    <span className={styles.uploadText}>Optional : Upload Supporting Documents</span>
                </label>
              </div>

              <div className={styles.buttonRow}>
                <button type="submit" className={styles.submitBtn}>SUBMIT REQUEST</button>
                <button type="button" className={styles.cancelBtn}>Cancel/Request</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaveRequest;