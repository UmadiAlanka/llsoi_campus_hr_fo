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
        // Automatically determine the current real-time month and year from the client clock
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensures 2 digits (e.g., "05")
        const currentMonthStr = `${year}-${month}`; // Constructing format like "2026-05"

        // Calling Spring Boot API (Port: 2027) with the active month query parameter
        const response = await fetch(`http://localhost:2027/api/dashboard/hr-staff?month=${currentMonthStr}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.success) {
          // Mapping Backend DTO fields to Frontend state variables
          setTotalEmployees(result.data.totalEmployees);
          setPresentToday(result.data.presentToday);
          setPendingLeave(result.data.pendingLeaveRequests);
          setAnomalies(result.data.anomaliesDetected); // Receives month-filtered values now
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Database fetch failed", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate the live attendance rate percentage dynamically
  const attendanceRate = totalEmployees > 0 
    ? Math.round((presentToday / totalEmployees) * 100) 
    : 0;

  // Configuration for dashboard summary cards
  const stats = [
    { label: 'Total Employees', value: totalEmployees, icon: <Users strokeWidth={2.5} /> },
    { label: 'Employees present Today', value: presentToday, icon: <UserCheck strokeWidth={2.5} /> },
    { label: 'Pending leave Requests', value: pendingLeave, icon: <CalendarClock strokeWidth={2.5} /> },
    { label: 'Anomalies Detected', value: anomalies, icon: <AlertCircle strokeWidth={2.5} /> },
  ];

  // While data is fetching, display a clean loading message state
  if (isLoading) return <div className={styles.loading}>Loading Dashboard...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>HR Staff Dashboard</h2>
      
      {/* Metrics Summary Grid Section */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Administration Routing Actions */}
      <h3 className={styles.sectionTitle}>Quick Actions</h3>
      <div className={styles.actionGrid}>
        <Link href="/hr_staff/employees/add" className={styles.actionBtn}>
          Add new Employee
        </Link>
        <Link href="/hr_staff/attendance" className={styles.actionBtn}>
          Update Attendance
        </Link>
        <Link href="/hr_staff/attendance/payroll-summary" className={styles.actionBtn}>
          Generate Monthly payroll
        </Link>
        <Link href="/hr_staff/anomaly" className={styles.actionBtn}>
          Review Anomalies
        </Link>
      </div>

      {/* Graphical Attendance Progression Ring Context */}
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