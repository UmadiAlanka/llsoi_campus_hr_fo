"use client";

import React, { useState, useRef } from "react";
import styles from "./salary.module.css";
import Link from "next/link";

interface SalaryRecord {
  id: string;
  name: string;
  basicSalary: string;
  netSalary: string;
  date: string;
  type: string;
}

export default function AdminSalary() {
  const monthInputRef = useRef<HTMLInputElement>(null);

  const [records] = useState<SalaryRecord[]>([
    {
      id: "001",
      name: "S.Perera",
      basicSalary: "50,000",
      netSalary: "52,000",
      date: "2025-10-10",
      type: "Academic",
    },
  ]);

  const handleMonthClick = () => {
    if (monthInputRef.current) {
      monthInputRef.current.showPicker?.();
    }
  };

  // Correct routes for Admin Dashboard
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
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={styles.menuItem}>
                    <img src={item.icon} alt="" className={styles.menuIconImage} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Salary & Pay Slip</h2>

          <div className={styles.topSection}>
            {/* Filter Bar */}
            <div className={styles.filterBar}>
              <div className={styles.filterBox}>
                <select className={styles.filterSelect}>
                  <option>Filter by Name</option>
                </select>
                <img src="/icons/dropdown.png" alt="arrow" className={styles.filterIcon} />
              </div>

              <div className={styles.filterBox} onClick={handleMonthClick}>
                <input type="month" ref={monthInputRef} className={styles.monthInput} />
                <span className={styles.monthPlaceholder}>Filter by Month</span>
                <img src="/icons/calendar.png" alt="calendar" className={styles.filterIcon} />
              </div>

              <div className={styles.filterBox}>
                <select className={styles.filterSelect}>
                  <option>Filter by Type</option>
                </select>
                <img src="/icons/dropdown.png" alt="arrow" className={styles.filterIcon} />
              </div>
            </div>

            {/* Add Salary Button */}
            <Link href="/admin-dashboard/salary/add-salary">
              <button className={styles.addSalaryBtn}>ADD SALARY</button>
            </Link>
          </div>

          {/* Salary Table */}
          <div className={styles.tableCard}>
            <table className={styles.salaryTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Basic Salary</th>
                  <th>Net Salary</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Download</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.name}</td>
                    <td>{record.basicSalary}</td>
                    <td>{record.netSalary}</td>
                    <td>{record.date}</td>
                    <td>{record.type}</td>
                    <td>
                      <button className={styles.pdfBtn}>
                        <img src="/icons/pdf.png" alt="PDF" />
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/admin-dashboard/salary/edit/${record.id}`}>
                          <button className={styles.editBtn}>Edit</button>
                        </Link>
                        <button className={styles.deleteBtn}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
