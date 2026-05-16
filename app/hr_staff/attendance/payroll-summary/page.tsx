"use client";

import React, { useState, useEffect } from 'react';
import styles from './payroll-summary.module.css';
import Link from 'next/link';

/**
 * PayrollSummaryPage Component
 * This page fetches payroll data from the backend and calculates totals
 * based on the month and year selected by the user.
 */
const PayrollSummaryPage = () => {
  // State for handling the UI status (loading, success, or error)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // State to control the visibility of the success popup
  const [showPopup, setShowPopup] = useState(false);
  
  // State for the date picker value (Format: "YYYY-MM")
  const [selectedMonth, setSelectedMonth] = useState(''); 
  
  // State to store the calculated summary data
  const [summary, setSummary] = useState({
    typeOfEmployees: "Academic & Non-Academic",
    noOfEmployees: 0,
    totalSalaryPayout: 0
  });

  /**
   * Effect Hook: Runs whenever 'selectedMonth' changes.
   * It calls the backend filtering endpoint to get records for the specific month/year.
   */
  useEffect(() => {
    // If no month is selected, reset summary and exit
    if (!selectedMonth) {
      setSummary(prev => ({ ...prev, noOfEmployees: 0, totalSalaryPayout: 0 }));
      setStatus('idle'); // Reset status when month changes
      return;
    }

    // Split the selectedMonth string (e.g., "2026-05") into Year and Month
    const [year, monthStr] = selectedMonth.split('-');
    const monthInt = parseInt(monthStr); // Convert "05" string to integer 5

    const fetchSummaryData = async () => {
      try {
        // Calling the specialized summary endpoint in Spring Boot
        const response = await fetch(`http://localhost:2027/api/payroll/summary?month=${monthInt}&year=${year}`);
        const result = await response.json();
        
        if (result.success) {
          const data = result.data;
          
          // Calculate the total payout by summing the netSalary of all filtered employees
          const total = data.reduce((sum: number, item: any) => sum + (Number(item.netSalary) || 0), 0);
          
          // Update the summary state with real data from the database
          setSummary(prev => ({
            ...prev,
            noOfEmployees: data.length,
            totalSalaryPayout: total
          }));
          
          // Check if all records in this month are already approved to persist the button status
          const allApproved = data.length > 0 && data.every((item: any) => item.status === 'APPROVED');
          setStatus(allApproved ? 'success' : 'idle');
        } else {
          // Reset summary if no data is found or if the backend returns success: false
          setSummary(prev => ({ ...prev, noOfEmployees: 0, totalSalaryPayout: 0 }));
          setStatus('idle');
        }
      } catch (error) {
        console.error("Connection error to API:", error);
        setStatus('error');
      }
    };

    fetchSummaryData();
  }, [selectedMonth]);

  /**
   * Function to handle the "Approve Payroll Release" button click.
   */
  const handleApprove = async () => {
    // Do not proceed if there are no records to approve
    if (summary.noOfEmployees === 0) return;

    setStatus('loading');
    try {
      // Simulate an API call delay for the approval process
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      setStatus('success');
      setShowPopup(true);
      
      // Auto-hide the success popup after 2 seconds but KEEP status as 'success'
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className={styles.container}>
      {/* Success Notification Popup Overlay */}
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
        {/* Date Picker Section */}
        <div className={styles.datePickerContainer}>
          <label className={styles.dateLabel}>Select Month/Year</label>
          <div className={styles.dateInputWrapper}>
            <input 
              type="month" 
              className={styles.dateInput}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>

        {/* Informational Display Box */}
        <div className={styles.infoBox}>
          <div className={styles.infoRow}>
            <span>Type of Employees</span>
            <span className={styles.dots}>-</span>
            <span className={styles.value}>{summary.typeOfEmployees}</span>
          </div>
          <div className={styles.infoRow}>
            <span>No. Of Employees</span>
            <span className={styles.dots}>-</span>
            <span className={styles.value}>{summary.noOfEmployees}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Total Salary Payout</span>
            <span className={styles.dots}>-</span>
            <span className={styles.value}>
                LKR {summary.totalSalaryPayout.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <button 
            className={status === 'success' ? styles.approvedBtn : styles.approveBtn} 
            onClick={status === 'idle' ? handleApprove : undefined}
            disabled={status === 'loading' || status === 'success' || summary.noOfEmployees === 0}
          >
            {status === 'loading' && 'Approving...'}
            {status === 'idle' && 'Approve Payroll Release'}
            {status === 'success' && 'Approved'}
          </button>
        </div>

        {/* Navigation back to main attendance/payroll page */}
        <Link href="/hr_staff/attendance">
          <button className={styles.backBtn}>Back To Payroll Details</button>
        </Link>
      </div>

      {/* Error Message Display */}
      {status === 'error' && (
        <p className={styles.errorMessage}>Error: Could not connect to the payroll server.</p>
      )}
    </div>
  );
};

export default PayrollSummaryPage;