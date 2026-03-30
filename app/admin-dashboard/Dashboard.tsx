"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";
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
    presentThisWeek: "None",
    salaryPaid: "Rs 0",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/dashboard/admin");
        const text = await response.text();
        if (!text) return;
        const result = JSON.parse(text);
        if (result && result.data) {
          const { totalEmployees, todayAttendance, pendingSalaries } = result.data;
          setStats({
            totalEmployees: totalEmployees || 0,
            absentToday: (totalEmployees || 0) - (todayAttendance || 0),
            presentThisWeek: todayAttendance > 0 ? "Active" : "None",
            salaryPaid: `Rs ${pendingSalaries || 0}`,
          });
        }
      } catch (error) {
        console.error("Database connection failed:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={styles.container}>
      <AdminHeader />
      <div className={styles.layoutBody}>
        <AdminSidebar />
        <main className={styles.mainContent}>
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
              title="Present Status"
              value={stats.presentThisWeek}
              accent="rgba(22,163,74,0.12)"
            />
            <SummaryCard
              imageSrc="/icons/paid.png"
              title="Salary Status"
              value={stats.salaryPaid}
              accent="rgba(234,179,8,0.15)"
            />
          </div>
        </main>
      </div>
    </div>
  );
}