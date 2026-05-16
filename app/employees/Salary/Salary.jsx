"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Salary.module.css';

const Salary = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [salaryData, setSalaryData] = useState([]);
  const [lastPaidDate, setLastPaidDate] = useState("No records");
  const [user, setUser] = useState(null);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchSalary(parsedUser.userId);
    }
  }, []);

  const fetchSalary = async (userId) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";
    try {
      // FIXED: was /api/salary/employee, correct endpoint is /api/payroll/employee
      const response = await fetch(`${API_URL}/payroll/employee/${userId}`);
      const result = await response.json();

      // Handle both ApiResponse wrapper { success, data: [...] } and plain array
      let salaries = [];
      if (result && result.success && Array.isArray(result.data)) {
        salaries = result.data;
      } else if (Array.isArray(result)) {
        salaries = result;
      }

      setSalaryData(salaries);

      // Calculate Last Paid Date from APPROVED records
      const paidSalaries = salaries
        .filter(s => s.status && (s.status.toUpperCase() === 'PAID' || s.status.toUpperCase() === 'APPROVED'))
        .sort((a, b) => {
          const dateA = a.generatedDate ? new Date(a.generatedDate) : new Date(a.year, a.month - 1);
          const dateB = b.generatedDate ? new Date(b.generatedDate) : new Date(b.year, b.month - 1);
          return dateB - dateA;
        });

      if (paidSalaries.length > 0) {
        const last = paidSalaries[0];
        const date = last.generatedDate ? new Date(last.generatedDate) : new Date(last.year, last.month - 1, 28);
        setLastPaidDate(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase());
      }
    } catch (error) {
      console.error("Error fetching salary:", error);
    }
  };

  const getMonthName = (m) => {
    return new Date(2000, m - 1).toLocaleString('en-US', { month: 'long' });
  };

  const currentDisplayData = salaryData.filter(record => {
    const matchYear = record.year.toString() === selectedYear;
    const matchMonth = selectedMonth === "All" || getMonthName(record.month) === selectedMonth;
    return matchYear && matchMonth;
  });

  const handleViewPayslip = (slip) => {
    setSelectedSlip(slip);
    setShowPayslipModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <img src="/logo.png" alt="Logo" className={styles.mainLogo} />
          <h1 className={styles.systemTitle}>LLSOI Campus HR Management System</h1>
        </div>

        <div className={styles.userProfile}>
          <div className={styles.userText}>
            <p>Welcome, <strong>{user ? user.name : 'Employee'}!</strong></p>
            <span>Employee ID: {user ? user.username : ''}</span>
          </div>
          <img src="/icons/user-profile.png" alt="User" className={styles.avatarImg} />
        </div>
      </header>

      <div className={styles.dashboardBody}>
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            <Link href="/employees" className={styles.navLink}>
              <img src="/icons/dashboard.png" className={styles.navIcon} />
              Dashboard
            </Link>


            <Link href="/employees/V-Attendance" className={styles.navLink}>
              <img src="/icons/attendance.png" className={styles.navIcon} />
              View Attendance
            </Link>


            <Link href="/employees/Leave_Request" className={styles.navLink}>
              <img src="/icons/leave.png" className={styles.navIcon} />
              Request Leave
            </Link>


            <Link href="/employees/Salary" className={`${styles.navLink} ${styles.active}`}>
              <img src="/icons/salary.png" className={styles.navIcon} />
              View Salary
            </Link>
            <Link href="/login" className={styles.navLink}>
              <img src="/icons/logout.png" className={styles.navIcon} />
              Log Out
            </Link>
          </nav >
        </aside >

  <main className={styles.mainContent}>
    <h2 className={styles.pageTitle}>Salary & Payslip History</h2>

    <div className={styles.summaryRow}>
      <div className={styles.lastSalaryCard}>
        <p className={styles.cardLabel}>LAST SALARY PAID ON:</p>
        <h3 className={styles.cardDate}>{lastPaidDate}</h3>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Year:</label>
          <select
            className={styles.selectInput}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Month:</label>
          <select
            className={styles.selectInput}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="All">All Months</option>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
    </div>

    {salaryData.length === 0 && (
      <div style={{
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '20px',
        color: '#fff',
        fontSize: '0.9rem',
        border: '1px solid rgba(255,255,255,0.25)'
      }}>
        No salary records found. Salary records will appear here once your admin adds them.
      </div>
    )}

    <div className={styles.glassTableContainer}>
      <table className={styles.payslipTable}>
        <thead>
          <tr>
            <th>Month</th>
            <th>Payment Date</th>
            <th>Gross Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentDisplayData.length > 0 ? (
            currentDisplayData.map((slip, index) => (
              <tr key={index}>
                <td>{getMonthName(slip.month)}</td>
                <td>{slip.generatedDate ? new Date(slip.generatedDate).toLocaleDateString() : `${getMonthName(slip.month)} 28, ${slip.year}`}</td>
                <td>LKR {Number(slip.netSalary || slip.amount || 0).toLocaleString()}</td>
                <td><span className={styles.statusBadge}>{slip.status}</span></td>
                <td><button onClick={() => handleViewPayslip(slip)} className={styles.downloadBtn}>View Payslip</button></td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className={styles.noData}>No salary records found for {selectedMonth === "All" ? "" : selectedMonth} {selectedYear}.</td></tr>
          )}
        </tbody>
      </table>
    </div>

    {/* PAYSLIP MODAL */}
    {showPayslipModal && selectedSlip && (
      <div className={`${styles.modalOverlay} no-print`} onClick={() => setShowPayslipModal(false)}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div id="printable-payslip" className={styles.payslipPrintable}>
            <div className={styles.payslipHeader}>
              <div className={styles.companyInfo}>
                <img src="/logo.png" alt="Logo" className={styles.payslipLogo} />
                <div>
                  <h2 className={styles.companyName}>LLSOI CAMPUS (PVT) LTD.</h2>
                  <p className={styles.payslipTitle}>Employee Pay Sheet - {getMonthName(selectedSlip.month).toUpperCase()} {selectedSlip.year}</p>
                </div>
              </div>
              <div className={styles.slipStatus}>
                <span className={styles.statusTag}>{selectedSlip.status}</span>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.employeeDetails}>
              <div className={styles.detailGroup}>
                <p><strong>Employee Name:</strong> {user?.name}</p>
                <p><strong>Employee ID:</strong> {user?.username}</p>
              </div>
              <div className={styles.detailGroup}>
                <p><strong>Pay Period:</strong> {getMonthName(selectedSlip.month)} {selectedSlip.year}</p>
                <p><strong>Generated Date:</strong> {selectedSlip.generatedDate ? new Date(selectedSlip.generatedDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <div className={styles.salaryGrid}>
              <div className={styles.earningsSection}>
                <h4>EARNINGS</h4>
                <div className={styles.salaryRowItem}><span>Basic Salary</span> <span>{Number(selectedSlip.basicSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className={styles.salaryRowItem}><span>Allowances</span> <span>{Number(selectedSlip.allowances || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className={styles.salaryRowItem}><span>Overtime Pay</span> <span>{Number(selectedSlip.overtimePay || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className={styles.salaryTotalItem}><span>GROSS SALARY</span> <span>LKR {Number(selectedSlip.grossSalary || selectedSlip.basicSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              </div>

              <div className={styles.deductionsSection}>
                <h4>DEDUCTIONS</h4>
                <div className={styles.salaryRowItem}><span>EPF (8%)</span> <span>{Number(selectedSlip.epfDeduction || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className={styles.salaryRowItem}><span>ETF (3%)</span> <span>{Number(selectedSlip.etfDeduction || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className={styles.salaryRowItem}><span>Other Deductions</span> <span>{Number(selectedSlip.otherDeductions || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className={styles.salaryTotalItem}><span>TOTAL DEDUCTIONS</span> <span>LKR {Number((selectedSlip.epfDeduction || 0) + (selectedSlip.etfDeduction || 0) + (selectedSlip.otherDeductions || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              </div>
            </div>

            <div className={styles.netSalarySection}>
              <div className={styles.netSalaryLabel}>NET SALARY (TAKE HOME)</div>
              <div className={styles.netSalaryValue}>LKR {Number(selectedSlip.netSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>

            <div className={styles.payslipFooter}>
              <p>This is a computer-generated document and does not require a signature.</p>
            </div>
          </div>

          <div className={`${styles.modalActions} no-print`}>
            <button className={styles.printBtn} onClick={handlePrint}>Print / Save as PDF</button>
            <button className={styles.closeBtn} onClick={() => setShowPayslipModal(false)}>Close</button>
          </div>
        </div>
      </div>
    )}
  </main>
      </div >
    </div >
  );
};

export default Salary;