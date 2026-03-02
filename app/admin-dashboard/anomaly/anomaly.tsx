"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./anomaly.module.css";

export default function AnomalyDetection() {
  const pathname = usePathname();
  const [anomalyStats, setAnomalyStats] = useState({ 
    totalAnomalies: 0, 
    resolvedAnomalies: 0 
  });

  // Fetch real data from your backend API
  useEffect(() => {
    const fetchAnomalyData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/anomalies/stats");
        const result = await response.json();
        if (result && result.data) {
          setAnomalyStats({
            totalAnomalies: result.data.totalAnomalies || 0,
            resolvedAnomalies: result.data.resolvedAnomalies || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching anomaly data:", error);
      }
    };
    fetchAnomalyData();
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: "/icons/home.png", href: "/admin-dashboard" },
    { name: "Manage Users", icon: "/icons/user.png", href: "/admin-dashboard/admin-manage-users" },
    { name: "Attendance", icon: "/icons/dattendance.png", href: "/admin-dashboard/admin-attendance" },
    { name: "Salary & Pay Slip", icon: "/icons/dsalary.png", href: "/admin-dashboard/salary" },
    { name: "Anomaly Detections", icon: "/icons/anomaly.png", href: "/admin-dashboard/anomaly" },
    { name: "Report & Analytics", icon: "/icons/report.png", href: "/admin-dashboard/analytics" },
    { name: "Leave Management", icon: "/icons/leave.png", href: "/admin-dashboard/leave" },
    { name: "Logout", icon: "/icons/logout.png", href: "/" },
  ];

  return (
    <div className={styles.container}>
      {/* HEADER - Reusing Dashboard Classes */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/Logo.png" alt="Logo" className={styles.headerLogo} />
          <h2 className={styles.brandName}>
            LLSOI Campus HR <span>Management System</span>
          </h2>
        </div>
        <div className={styles.adminProfile}>
          <img src="/icons/user-profile.png" alt="Admin" className={styles.adminAvatar} />
          <span>Admin</span>
        </div>
      </header>

      <div className={styles.layoutBody}>
        {/* SIDEBAR - Reusing Dashboard Classes */}
        <aside className={styles.sidebar}>
          <nav>
            <ul className={styles.menuList}>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
                    >
                      <img src={item.icon} alt="" className={styles.menuIconImage} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* MAIN CONTENT - Anomaly Detection Specific */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Anomaly Detection</h2>

          {/* Stats Grid - Using Dashboard card styles */}
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIconContainer}>
                <img src="/icons/total-anomaly.png" alt="Total" className={styles.cardIconImage} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Total Anomalies</h3>
                <p className={`${styles.cardValue} ${styles.highlightValue}`}>
                  {anomalyStats.totalAnomalies}
                </p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIconContainer}>
                <img src="/icons/resolved-anomaly.png" alt="Resolved" className={styles.cardIconImage} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Resolved</h3>
                <p className={`${styles.cardValue} ${styles.highlightValue}`}>
                  {anomalyStats.resolvedAnomalies}
                </p>
              </div>
            </div>
          </div>

          {/* Specialized Rule Section */}
          <div className={styles.rulesContainer}>
            <h3 className={styles.rulesHeader}>Currently Rule Being Used</h3>
            <ul className={styles.rulesList}>
              <li>
                <span className={styles.checkIcon}>✔</span> Salary Range Rule
              </li>
              <li>
                <span className={styles.checkIcon}>✔</span> Rs.300 Sudden Change Rule
              </li>
            </ul>
            <div className={styles.actionCenter}>
              <button className={styles.detectButton}>Detect Anomaly</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}