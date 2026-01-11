"use client";

import React, { useRef } from 'react';
import styles from './editAttendance.module.css';
import Link from 'next/link';

const adminMarkAttendance: React.FC = () => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleCalendarClick = () => {
    if (dateInputRef.current && 'showPicker' in HTMLInputElement.prototype) {
      dateInputRef.current.showPicker();
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: '/icons/home.png', active: false, href: '/admin-dashboard/Dashboard' },
    { name: 'Manage Users', icon: '/icons/user.png', active: false, href: '/manage-users' },
    { name: 'Attendence', icon: '/icons/dattendance.png', active: true, href: '/attendance' },
    { name: 'Salary & Pay Slip', icon: '/icons/dsalary.png', active: false, href: '/salary' },
    { name: 'Anomaly Detections', icon: '/icons/anomaly.png', active: false, href: '/anomaly' },
    { name: 'Report & Analytics', icon: '/icons/report.png', active: false, href: '/analytics' },
    { name: 'Leave management', icon: '/icons/leave.png', active: false, href: '/leave' },
    { name: 'Logout', icon: '/icons/logout.png', active: false, href: '/logout' },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/Logo.png" alt="LLSOI Logo" className={styles.headerLogo} />
          <h1 className={styles.brandName}>LLSOI Campus HR <span>Management System</span></h1>
        </div>
        <div className={styles.adminProfile}>
          <img src="/icons/user-profile.png" alt="Admin" className={styles.adminAvatar} />
          <span className={styles.userName}>Admin</span>
        </div>
      </header>

      <div className={styles.layoutBody}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav>
            <ul className={styles.menuList}>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={`${styles.menuItem} ${item.active ? styles.activeItem : ''}`}>
                    <img src={item.icon} alt="" className={styles.menuIconImage} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Form Content */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Edit Attendance</h2>
          
          <div className={styles.formCard}>
            <form className={styles.attendanceForm}>
              {/* Name Row */}
              <div className={styles.fullWidth}>
                <label className={styles.label}>Name:</label>
                <input type="text" className={styles.input} />
              </div>

              {/* ID and Type Row */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Employee ID:</label>
                  <input type="text" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Select Type:</label>
                  <div className={styles.selectWrapper}>
                    <select className={styles.select}>
                      <option value=""></option>
                      <option value="academic">Academic</option>
                      <option value="non-academic">Non-academic</option>
                    </select>
                    <img src="/icons/dropdown.png" alt="arrow" className={styles.selectIcon} />
                  </div>
                </div>
              </div>

              {/* Course and Department Row */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Select Course:</label>
                  <div className={styles.selectWrapper}>
                    <select className={styles.select}>
                      <option value=""></option>
                    </select>
                    <img src="/icons/dropdown.png" alt="arrow" className={styles.selectIcon} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Select Department:</label>
                  <div className={styles.selectWrapper}>
                    <select className={styles.select}>
                      <option value=""></option>
                      <option>HR</option>
                      <option>Management</option>
                      <option>Language</option>
                      <option>IT</option>
                      <option>Behavioral</option>
                    </select>
                    <img src="/icons/dropdown.png" alt="arrow" className={styles.selectIcon} />
                  </div>
                </div>
              </div>

              {/* Time Row */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Time in:</label>
                  <input type="text" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Time out:</label>
                  <input type="text" className={styles.input} />
                </div>
              </div>

              {/* Date Row */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date:</label>
                  <div className={styles.dateWrapper} onClick={handleCalendarClick}>
                    <input type="date" ref={dateInputRef} className={styles.dateInput} />
                    <img src="/icons/calendar.png" alt="calendar" className={styles.calendarIcon} />
                  </div>
                </div>
                <div className={styles.emptyGroup}></div>
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.updateBtn}>UPDATE</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default adminMarkAttendance;