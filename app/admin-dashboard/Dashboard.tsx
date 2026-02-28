"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Dashboard.module.css";

interface SummaryCardProps {
  imageSrc: string;
  title: string;
  value: string | number; 
}

const SummaryCard: React.FC<SummaryCardProps> = ({ imageSrc, title, value }) => (
  <div className={styles.card}>
    <div className={styles.cardIconContainer}>
      <img src={imageSrc} alt={title} className={styles.cardIconImage} />
    </div>
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardValue}>{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const pathname = usePathname();

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
        
        // Safety: check for empty response before parsing JSON
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

        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Admin Dashboard</h2>

          <div className={styles.cardGrid}>
            <SummaryCard imageSrc="/icons/employee.png" title="Total Employees" value={stats.totalEmployees} />
            <SummaryCard imageSrc="/icons/absent.png" title="Absent Today" value={stats.absentToday} />
            <SummaryCard imageSrc="/icons/present.png" title="Present Status" value={stats.presentThisWeek} />
            <SummaryCard imageSrc="/icons/paid.png" title="Salary Status" value={stats.salaryPaid} />
          </div>
        </main>
      </div>
    </div>
  );
}