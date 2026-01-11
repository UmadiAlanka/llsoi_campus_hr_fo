"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Dashboard.module.css";

interface SummaryCardProps {
  imageSrc: string;
  title: string;
  value: string;
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
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/Logo.png" alt="LLSOI Logo" className={styles.headerLogo} />
          <h1 className={styles.brandName}>
            LLSOI Campus HR <span>Management System</span>
          </h1>
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
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`${styles.menuLink} ${isActive ? styles.active : ""}`}
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

        {/* Main Content */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Admin Dashboard</h2>

          <div className={styles.cardGrid}>
            <SummaryCard imageSrc="/icons/employee.png" title="Total Employees" value="25" />
            <SummaryCard imageSrc="/icons/absent.png" title="Absent Today" value="5" />
            <SummaryCard imageSrc="/icons/present.png" title="Present This Week" value="85%" />
            <SummaryCard imageSrc="/icons/paid.png" title="Salary Paid" value="Rs 150,000" />
          </div>
        </main>
      </div>
    </div>
  );
}
