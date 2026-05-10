"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import styles from './Payslip.module.css';

const Payslip = () => {
  const router = useRouter();

  // Database Tip: You will eventually fetch this based on a User ID or Month ID
  const sampleData = {
    employeeName: "Mr. Kasun",
    employeeId: "1100",
    designation: "Marketing executive",
    department: "Marketing",
    payPeriod: "November 2025",
    basicSalary: "60,000",
    totalEarnings: "60,000",
    netPay: "60,000"
  };

  const handleDownload = () => {
    const element = document.getElementById('payslip-card');
    if (typeof window !== 'undefined' && window.html2pdf) {
      const opt = {
        margin:       0.2,
        filename:     `Payslip_${sampleData.employeeName.replace(' ', '_')}.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 3, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      window.html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  };

  return (
    <div className={styles.appContainer}>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="lazyOnload" />
      {/* Header */}
      <header className={`${styles.topHeader} no-print`}>
        <div className={styles.headerLeft}>
          <img src="/logo.png" alt="Logo" className={styles.mainLogo} />
          <h1 className={styles.systemTitle}>LLSOI Campus HR Management System</h1>
        </div>
        <div className={styles.userProfile}>
          <p>welcome, <strong>{sampleData.employeeName}!</strong></p>
          <span>{sampleData.employeeId}</span>
          <img src="/icons/user-profile.png" alt="User" className={styles.avatarImg} />
        </div>
      </header>

      <div className={styles.dashboardBody}>
        {/* SIDEBAR (Logo removed from here) */}
        <aside className={`${styles.sidebar} no-print`}>
          <nav className={styles.navMenu}>
            {/* Link to Dashboard */}
            <Link href="/employees" className={styles.navLink}>
              <img src="/icons/dashboard.png" alt="" className={styles.navIcon} /> Dashboard
            </Link>

            {/* Link to Attendance */}
            <Link href="/employees/V-Attendance" className={styles.navLink}>
              <img src="/icons/attendance.png" alt="" className={styles.navIcon} /> View Attendance
            </Link>

            {/* Link to Leave Request */}
            <Link href="/employees/Leave_Request" className={styles.navLink}>
              <img src="/icons/leave.png" alt="" className={styles.navIcon} /> Request Leave
            </Link>

            {/* Link to Salary */}
            <Link href="/employees/Salary" className={styles.navLink}>
              <img src="/icons/salary.png" alt="" className={styles.navIcon} /> View Salary
            </Link>

            {/* Link to Logout/Login */}
            <Link href="/login" className={styles.navLink}>
              <img src="/icons/logout.png" alt="" className={styles.navIcon} /> Log Out
            </Link>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          {/* Payslip Glass Card */}
          <div id="payslip-card" className={styles.payslipCard}>
            <button className={`${styles.backBtn} no-print`} onClick={() => router.push('/employees/Salary')} // Forces navigation to Salary
            >←</button>

            <div className={styles.payslipHeader}>
              <h2 className={styles.payslipTitle}>Payslip</h2>
              <img src="/logo.png" alt="LLSOI" className={styles.centerLogo} />
              <h3 className={styles.campusName}>LLSOI Campus</h3>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}><strong>Employee Name:</strong> {sampleData.employeeName}</div>
              <div className={styles.infoItem}><strong>Designation:</strong> {sampleData.designation}</div>
              <div className={styles.infoItem}><strong>Employee ID:</strong> {sampleData.employeeId}</div>
              <div className={styles.infoItem}><strong>Department:</strong> {sampleData.department}</div>
              <div className={styles.infoItem}><strong>Pay Period:</strong> {sampleData.payPeriod}</div>
            </div>

            <div className={styles.earningsSection}>
              <h4 className={styles.sectionTitle}>Earnings</h4>
              <div className={styles.dataRow}>
                <span>Basic Salary (LKR) :</span>
                <span>{sampleData.basicSalary}</span>
              </div>
              <hr className={styles.divider} />
              <div className={styles.dataRow}>
                <strong>Total Earnings (LKR) :</strong>
                <strong>{sampleData.totalEarnings}</strong>
              </div>
              <hr className={styles.divider} />
              <div className={`${styles.dataRow} ${styles.netPayRow}`}>
                <strong>Net Pay (LKR) :</strong>
                <strong>{sampleData.netPay}</strong>
              </div>
            </div>

            <button className={`${styles.downloadBtn} no-print`} onClick={handleDownload}>Download PDF</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payslip;