"use client"; 
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Salary.module.css';

const Salary = () => {
  const [selectedYear, setSelectedYear] = useState("2025");

  // 1. The Short Method: Generate 12 months automatically
  const generateMonthlyData = (year) => {
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    
    // Set a base salary (you can change this based on the year)
    const baseSalary = year === "2025" ? "60,000" : "55,000";

    return months.map((month) => ({
      month: `${month} ${year}`,
      date: `${month.substring(0, 3)} 30, ${year}`, // Simple date generator
      amount: baseSalary
    }));
  };

  // 2. Get the 12 months for the selected year instantly
  const currentDisplayData = generateMonthlyData(selectedYear);

  return (
    <div className={styles.appContainer}>
      {/* ... Header and Sidebar stay exactly the same ... */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <img src="/logo.png" alt="Logo" className={styles.mainLogo} />
          <h1 className={styles.systemTitle}>LLSOI Campus HR Management System</h1>
        </div>
      </header>

      <div className={styles.dashboardBody}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            <Link href="/Dashboard" className={styles.navLink}>
              <img src="/icons/dashboard.png" className={styles.navIcon} />
              Dashboard
            </Link>

            <Link href="/attendance" className={styles.navLink}>
              <img src="/icons/attendance.png" className={styles.navIcon} />
              View Attendance
            </Link>

            <Link href="/leave" className={styles.navLink}>
              <img src="/icons/leave.png" className={styles.navIcon} />
              Request Leave
            </Link>

            <Link href="/salary" className={`${styles.navLink} ${styles.active}`}>
              <img src="/icons/salary.png" className={styles.navIcon} />
              View Salary
            </Link>

            <Link href="/login" className={styles.navLink}>
              <img src="/icons/logout.png" className={styles.navIcon} />
              Log Out
            </Link>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Salary & Payslip History</h2>

          <div className={styles.summaryRow}>
            <div className={styles.lastSalaryCard}>
              <p className={styles.cardLabel}>LAST SALARY PAID ON:</p>
              <h3 className={styles.cardDate}>DEC 31, {selectedYear}</h3>
            </div>

            <div className={styles.filterRow}>
              <div className={styles.filterItem}>
                <label className={styles.filterLabel}>Select Year:</label>
                <select 
                  className={styles.selectInput}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.glassTableContainer}>
            <table className={styles.payslipTable}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Payment Date</th>
                  <th>Gross Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentDisplayData.map((slip, index) => (
                  <tr key={index}>
                    <td>{slip.month}</td>
                    <td>{slip.date}</td>
                    <td>{slip.amount}</td>
                    <td><button className={styles.downloadBtn}>Download PDF</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Salary;