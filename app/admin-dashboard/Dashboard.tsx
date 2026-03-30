"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar"; // Adjusted to match your folder structure
import Topbar from "./components/Topbar";   // Adjusted to match your folder structure
import styles from "./Dashboard.module.css";

const SummaryCard = ({ imageSrc, title, value, loading }: any) => (
  <div className={styles.card}>
    <div className={styles.cardIconContainer}>
      <img src={imageSrc} alt={title} className={styles.cardIconImage} />
    </div>
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.cardValue}>
        {loading ? <div className={styles.spinner}></div> : value}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    absentToday: 0,
    presentThisWeek: "None",
    salaryPaid: "Rs 0"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/dashboard/admin");
        const result = await response.json();
        if (result && result.data) {
          setStats({
            totalEmployees: result.data.totalEmployees || 0,
            absentToday: (result.data.totalEmployees || 0) - (result.data.todayAttendance || 0),
            presentThisWeek: result.data.todayAttendance > 0 ? "Active" : "None",
            salaryPaid: `Rs ${result.data.pendingSalaries || 0}`,
          });
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={styles.container}>
      {/* 1. Use the new Global Topbar component */}
      <Topbar role="Admin" /> 

      <div className={styles.layoutBody}>
        {/* 2. Use the new Global Sidebar component */}
        <Sidebar />

        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Admin Dashboard</h2>
          <div className={styles.cardGrid}>
            <SummaryCard loading={loading} imageSrc="/icons/employee.png" title="Total Employees" value={stats.totalEmployees} />
            <SummaryCard loading={loading} imageSrc="/icons/absent.png" title="Absent Today" value={stats.absentToday} />
            <SummaryCard loading={loading} imageSrc="/icons/present.png" title="Present Status" value={stats.presentThisWeek} />
            <SummaryCard loading={loading} imageSrc="/icons/paid.png" title="Salary Status" value={stats.salaryPaid} />
          </div>
        </main>
      </div>
    </div>
  );
}