"use client";

import React, { useState, useEffect, useCallback } from 'react';
import styles from './attendance.module.css';
import { Search } from 'lucide-react';
import Link from 'next/link';

/**
 * AttendancePage Component
 * Manages real-time Attendance and Payroll data with integrated filtering.
 */
const AttendancePage = () => {
  // --- States for Data ---
  const [attendanceList, setAttendanceList] = useState([]);
  const [payrollList, setPayrollList] = useState([]);

  // --- UI & Loading States ---
  const [showPopup, setShowPopup] = useState(false);
  const [loadingAtt, setLoadingAtt] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  
  // Attendance Filter States
  const [attSearch, setAttSearch] = useState('');
  const [attDept, setAttDept] = useState('');
  const [attType, setAttType] = useState('');
  const [attDate, setAttDate] = useState('');
  
  // Payroll Filter States
  const [paySearch, setPaySearch] = useState('');
  const [payType, setPayType] = useState('');

  // Set current month as default (e.g., "2026-05") so data loads immediately
  const [payMonth, setPayMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  /**
   * Fetch Attendance data with Filters
   */
  const fetchAttendanceData = useCallback(async () => {
    setLoadingAtt(true);
    try {
      let url = new URL('http://localhost:2027/api/attendance/filter');
      
      if (attDate) url.searchParams.append('date', attDate);
      if (attDept) url.searchParams.append('dept', attDept);
      if (attType) url.searchParams.append('type', attType);

      const response = await fetch(url.toString());
      const result = await response.json();
      
      if (result.success) {
        setAttendanceList(result.data);
      } else {
        setAttendanceList([]);
      }
    } catch (error) {
      console.error("Attendance Network Error:", error);
      setAttendanceList([]);
    } finally {
      setLoadingAtt(false);
    }
  }, [attDate, attDept, attType]);

  /**
   * Fetch Payroll data with Month, Year, and JobType filters
   */
  const fetchPayrollData = useCallback(async () => {
    if (!payMonth) {
        setPayrollList([]);
        return;
    }

    setLoadingPay(true);
    try {
      const [year, monthStr] = payMonth.split('-');
      const monthInt = parseInt(monthStr);

      let url = new URL('http://localhost:2027/api/payroll/filter'); 
      url.searchParams.append('month', monthInt.toString());
      url.searchParams.append('year', year);
      if (payType) url.searchParams.append('type', payType);

      const response = await fetch(url.toString());
      const result = await response.json();

      if (result.success) {
        setPayrollList(result.data);
      } else {
        setPayrollList([]);
      }
    } catch (error) {
      console.error("Payroll Network Error:", error);
      setPayrollList([]);
    } finally {
      setLoadingPay(false);
    }
  }, [payMonth, payType]);

  // Separate concerns in useEffect to prevent infinite loops and lag
  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  useEffect(() => {
    fetchPayrollData();
  }, [fetchPayrollData]);

  /**
   * Handle Individual Payroll Approval
   */
  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:2027/api/payroll/approve/${id}`, {
        method: 'PUT'
      });
      const result = await response.json();
      
      if (result.success) {
        setShowPopup(true);
        fetchPayrollData(); 
      }
    } catch (error) {
      console.error("Approval Error:", error);
    }
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // --- Client-side Search Filtering ---
  const filteredAttendance = attendanceList.filter((item: any) => {
    const searchLower = attSearch.toLowerCase();
    return (
      item.employeeId?.toString().includes(searchLower) || 
      item.employeeName?.toLowerCase().includes(searchLower)
    );
  });

  const filteredPayroll = payrollList.filter((item: any) => {
    const searchLower = paySearch.toLowerCase();
    // Support both snake_case from DB schema and object nesting if mapped via Hibernate
    const empId = item.employee_id || item.employee?.emp_id || item.employee?.employeeId;
    const empName = item.employee?.name || item.employeeName || '';
    
    return (
      empId?.toString().includes(searchLower) || 
      empName?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={styles.container}>
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Payroll Approved successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.mainTitle}>Attendance and Payroll Operations</h1>

      {/* --- Attendance Section --- */}
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Attendance Verifications</h2>
        
        <div className={styles.filters}>
          <input type="date" className={styles.filterInput} onChange={(e) => setAttDate(e.target.value)} />
          <select className={styles.filterSelect} onChange={(e) => setAttDept(e.target.value)}>
            <option value="">Filter by Department</option>
            <option value="HR">Management</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
          </select>
          <select className={styles.filterSelect} onChange={(e) => setAttType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Academic">Academic</option>
            <option value="Non-Academic">Non-Academic</option>
          </select>
          <div className={styles.searchContainer}>
            <input type="text" placeholder="Search Name/ID..." className={styles.searchInput} onChange={(e) => setAttSearch(e.target.value)} />
            <Search className={styles.searchIcon} size={18} />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Department</th><th>Type</th><th>Date</th><th>Clock In</th><th>Clock Out</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loadingAtt ? (
              <tr><td colSpan={8} className={styles.loadingCell}>Loading data...</td></tr>
            ) : filteredAttendance.length > 0 ? (
              filteredAttendance.map((item: any) => (
                <tr key={item.id} className={styles.tableRow}>
                  <td>{item.employeeId}</td>
                  <td>{item.employeeName}</td>
                  <td><span className={styles.deptBadge}>{item.department}</span></td>
                  <td>{item.jobType}</td>
                  <td>{item.date}</td>
                  <td>{item.clockInTime || '--:--'}</td>
                  <td>{item.clockOutTime || '--:--'}</td>
                  <td>
                    <Link href={`/hr_staff/attendance/edit-attendance/${item.employeeId}`}>
                      <button className={styles.editBtn}>Edit/View</button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={8} className={styles.noDataCell}>No attendance records found</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* --- Payroll Section --- */}
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Payroll Details</h2>
        <div className={styles.payrollFilters}>
          <input type="month" className={styles.filterInput} value={payMonth} onChange={(e) => setPayMonth(e.target.value)} />
          <select className={styles.filterSelect} value={payType} onChange={(e) => setPayType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Academic">Academic</option>
            <option value="Non-Academic">Non-Academic</option>
          </select>
          <div className={styles.searchWrapper}>
            <div className={styles.searchContainer}>
              <input type="text" placeholder="Search Employee..." className={styles.searchInput} onChange={(e) => setPaySearch(e.target.value)} />
              <Search className={styles.searchIcon} size={18} />
            </div>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Type</th><th>Basic Salary</th><th>Net Salary</th><th>Action</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loadingPay ? (
              <tr><td colSpan={7} className={styles.loadingCell}>Loading payroll...</td></tr>
            ) : filteredPayroll.length > 0 ? (
              filteredPayroll.map((item: any) => {
                // Determine accurate mapping properties safely
                const currentEmpId = item.employee_id || item.employee?.emp_id || item.employee?.employeeId || 'N/A';
                const currentEmpName = item.employee?.name || item.employeeName || 'N/A';
                const currentJobType = item.employee?.jobType || item.jobType || 'N/A';
                const currentBasic = item.basic_salary !== undefined ? item.basic_salary : item.basicSalary;
                const currentNet = item.net_salary !== undefined ? item.net_salary : item.netSalary;

                return (
                  <tr key={item.id} className={styles.tableRow}>
                    <td>{currentEmpId}</td>
                    <td>{currentEmpName}</td>
                    <td>{currentJobType}</td>
                    <td>{currentBasic}</td>
                    <td>{currentNet}</td>
                    <td>
                      <Link href={`/hr_staff/attendance/edit-salary/${currentEmpId}`}>
                        <button className={styles.editBtn}>Edit/View</button>
                      </Link>
                    </td>
                    <td>
                      {item.status === 'APPROVED' ? (
                        <span className={styles.statusText}>Approved</span>
                      ) : (
                        <button className={styles.approveBtn} onClick={() => handleApprove(item.id)}>Approve</button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className={styles.noDataCell}>
                  {payMonth ? "No payroll records found for this selection" : "Please select a Month to view Payroll"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <Link href="/hr_staff/attendance/payroll-summary">
          <button className={styles.summaryBtn}>Go To Payroll Summary</button>
        </Link>
      </section>
    </div>
  );
};

export default AttendancePage;