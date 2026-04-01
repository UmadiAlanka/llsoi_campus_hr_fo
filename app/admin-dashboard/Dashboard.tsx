"use client";

import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

interface SummaryCardProps {
  imageSrc: string;
  title: string;
  value: string | number;
  accent?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ imageSrc, title, value, accent }) => (
  <div className={styles.card}>
    <div className={styles.cardIconWrapper} style={accent ? { background: accent } : undefined}>
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
      // Ensure port 2027 is used
      const response = await fetch("http://localhost:2027/api/dashboard/admin");
      const result = await response.json();

      console.log("Backend Response:", result); // DEBUG: Check your browser console

      if (result?.success && result?.data) {
        // We destructure based on the EXACT keys in your Java HashMap
        const { 
          totalEmployees, 
          todayAttendance, 
          pendingSalaries 
        } = result.data;
        
        setStats({
          // If totalEmployees is undefined, default to 0
          totalEmployees: totalEmployees || 0,
          
          // Math: Total - Today's Present
          absentToday: (totalEmployees || 0) - (todayAttendance || 0),
          
          // Logic for status text
          presentStatus: todayAttendance > 0 ? "Active Today" : "None",
          
          // Format currency
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
    <>
      <div className={styles.pageTitleRow}>
        <h2 className={styles.pageTitle}>Dashboard</h2>
        <span className={styles.pageSubtitle}>Welcome back, Admin</span>
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
          title="Pending Salaries" 
          value={stats.pendingSalary} 
          accent="rgba(234,179,8,0.15)" 
        />
      </div>
    </>
  );
}