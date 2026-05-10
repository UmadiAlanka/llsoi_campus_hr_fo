"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './payroll-summary.module.css';
import Link from 'next/link';

const PayrollSummaryPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [showPopup, setShowPopup] = useState(false); // New state to control popup visibility
  const [selectedMonth, setSelectedMonth] = useState('');

  const summaryData = {
    typeOfEmployees: "Academic & Non-Academic",
    noOfEmployees: "25",
    totalSalaryPayout: "LKR 1,450,000.00"
  };

  const handleApprove = async () => {
    setStatus('loading');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus('success');
    setShowPopup(true); // Show the popup
    
    // Auto-close popup after 2 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      {/* Popup now depends on showPopup state and has no button */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Payroll Approved Successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.title}>Attendance and payroll operations</h1>
      
      <div className={styles.subHeader}>
        <h2 className={styles.subtitle}>Payroll Summary</h2>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.datePickerContainer}>
          <label className={styles.dateLabel}>Select Month</label>
          <div className={styles.dateInputWrapper}>
            <input 
              type="month" 
              className={styles.dateInput}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.infoRow}>
            <span>Type of Employees</span>
            <span className={styles.dots}>-</span>
            <span className={styles.value}>{summaryData.typeOfEmployees}</span>
          </div>
          <div className={styles.infoRow}>
            <span>No.Of Employees</span>
            <span className={styles.dots}>-</span>
            <span className={styles.value}>{summaryData.noOfEmployees}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Total Salary Payout</span>
            <span className={styles.dots}>-</span>
            <span className={styles.value}>{summaryData.totalSalaryPayout}</span>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button 
            className={status === 'success' ? styles.approvedBtn : styles.approveBtn} 
            onClick={status === 'idle' ? handleApprove : undefined}
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' && 'Approving...'}
            {status === 'idle' && 'Approve Payroll Release'}
            {status === 'success' && 'Approved'}
          </button>
        </div>

        <Link href="/hr_staff/attendance">
          <button className={styles.backBtn}>Back To Payroll Details</button>
        </Link>
      </div>
    </div>
  );
};

export default PayrollSummaryPage;