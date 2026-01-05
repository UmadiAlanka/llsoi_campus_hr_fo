'use client'; 
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link for navigation
import styles from './dashboard.module.css';
import { Users, UserCheck, CalendarClock, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [pendingLeave, setPendingLeave] = useState(0);
  const [anomalies, setAnomalies] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating a short delay like a real database fetch
        await new Promise(resolve => setTimeout(resolve, 500));

        const dbData = {
          total: 25,
          present: 24,
          leave: 2,
          anomalies: 0
        };

        setTotalEmployees(dbData.total);
        setPresentToday(dbData.present);
        setPendingLeave(dbData.leave);
        setAnomalies(dbData.anomalies);
        setIsLoading(false);
      } catch (err) {
        console.error("Database fetch failed", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const attendanceRate = totalEmployees > 0 
    ? Math.round((presentToday / totalEmployees) * 100) 
    : 0;

  const stats = [
    { label: 'Total Employees', value: totalEmployees, icon: <Users strokeWidth={2.5} /> },
    { label: 'Employees present Today', value: presentToday, icon: <UserCheck strokeWidth={2.5} /> },
    { label: 'Pending leave Requests', value: pendingLeave, icon: <CalendarClock strokeWidth={2.5} /> },
    { label: 'Anomalies Detected', value: anomalies, icon: <AlertCircle strokeWidth={2.5} /> },
  ];

  // While data is "fetching", we can show a simple loading message
  if (isLoading) return <div className={styles.loading}>Loading Dashboard...</div>;

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
        {/* Changed from <button> to <Link> */}
        <Link href="/hr_staff/employees/add" className={styles.actionBtn}>
          Add new Employee
        </Link>
        <Link href="/hr_staff/attendance" className={styles.actionBtn}>
          Update Attendance
        </Link>
        <Link href="/hr_staff/payroll/generate" className={styles.actionBtn}>
          Generate Monthly payroll
        </Link>
        <Link href="/hr_staff/anomalies/review" className={styles.actionBtn}>
          Review Anomalies
        </Link>
      </div>

      <div className={styles.chartSection}>
        <h3>Attendance Overview</h3>
        <div className={styles.chartPlaceholder}>
          <div 
            className={styles.pieChart} 
            style={{ '--percentage': `${attendanceRate}%` } as React.CSSProperties}
          ></div>
          <div className={styles.chartText}>
            <p>Today : {attendanceRate}%</p>
            <p className={styles.subText}>Attendance</p>
          </div>
        </div>
      </div>
    </div>
  );
}