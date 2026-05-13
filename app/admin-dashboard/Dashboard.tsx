"use client";

import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

// Keeping your SummaryCard component helper
const SummaryCard = ({ imageSrc, title, value, accent }) => (
  <div className={styles.card}>
    <div className={styles.cardIconWrapper} style={{ background: accent }}>
      <img src={imageSrc} alt={title} className={styles.cardIconImage} />
    </div>
    <div className={styles.cardContent}>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardValue}>{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    absentToday: 0,
    presentStatus: "None",
    pendingSalary: "Rs 0",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:2027/api/dashboard/admin");
        const result = await response.json();
        if (result?.success && result?.data) {
          const { totalEmployees, todayAttendance, pendingSalaries } = result.data;
          setStats({
            totalEmployees: totalEmployees || 0,
            absentToday: (totalEmployees || 0) - (todayAttendance || 0),
            presentStatus: todayAttendance > 0 ? `${todayAttendance} Present` : "None",
            pendingSalary: `Rs ${new Intl.NumberFormat('en-IN').format(pendingSalaries || 0)}`,
          });
        }
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    /* REMOVED <Topbar /> and <Sidebar /> from here */
    <main className={styles.mainContent}>
      <div className={styles.pageTitleRow}>
        <h2 className={styles.pageTitle}>Admin Dashboard</h2>
        <span className={styles.pageSubtitle}>System Overview</span>
      </div>
      
      <div className={styles.cardGrid}>
        <SummaryCard 
          imageSrc="/icons/employee.png" 
          title="Total Employees" 
          value={stats.totalEmployees} 
          accent="rgba(114,14,14,0.12)" 
        />
        <SummaryCard 
          imageSrc="/icons/absent.png" 
          title="Absent Today" 
          value={stats.absentToday} 
          accent="rgba(220,38,38,0.12)" 
        />
        <SummaryCard 
          imageSrc="/icons/present.png" 
          title="Attendance Status" 
          value={stats.presentStatus} 
          accent="rgba(22,163,74,0.12)" 
        />
        <SummaryCard 
          imageSrc="/icons/paid.png" 
          title="Salary Status" 
          value={stats.pendingSalary} 
          accent="rgba(234,179,8,0.15)" 
        />
      </div>
    </main>
  );
}