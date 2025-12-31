import React from 'react';
import styles from './dashboard.module.css';
import { Users, UserCheck, CalendarClock, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Employees', value: 25, icon: <Users />, color: '#800000' },
    { label: 'Employees present Today', value: 24, icon: <UserCheck />, color: '#800000' },
    { label: 'Pending leave Requests', value: 2, icon: <CalendarClock />, color: '#800000' },
    { label: 'Anomalies Detected', value: 0, icon: <AlertCircle />, color: '#800000' },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>HR Staff Dashboard</h2>
      
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>Quick Actions</h3>
      <div className={styles.actionGrid}>
        <button className={styles.actionBtn}>Add new Employee</button>
        <button className={styles.actionBtn}>Update Attendance</button>
        <button className={styles.actionBtn}>Generate Monthly payroll</button>
        <button className={styles.actionBtn}>Review Anomalies</button>
      </div>

      <div className={styles.chartSection}>
        <h3>Attendance Overview</h3>
        <div className={styles.chartPlaceholder}>
          {/* Simple CSS representation of the pie chart */}
          <div className={styles.pieChart}></div>
          <div className={styles.chartText}>
            <p>Today : 90%</p>
            <p>Attendance</p>
          </div>
        </div>
      </div>
    </div>
  );
}