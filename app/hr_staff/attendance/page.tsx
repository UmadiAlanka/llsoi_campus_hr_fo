"use client";

import React, { useState, useEffect, useCallback } from 'react';
import styles from './attendance.module.css';
import { Search } from 'lucide-react';
import Link from 'next/link';

const AttendancePage = () => {
  // --- States for Data ---
  const [attendanceList, setAttendanceList] = useState([]);
  const [payrollList, setPayrollList] = useState([
    { id: '001', name: 'S.Perera', basic: '50,000', net: '52,000', status: 'Approved', type: 'Academic' },
    { id: '002', name: 'K.Dias', basic: '60,000', net: '61,000', status: 'Approve', type: 'Non-Academic' },
  ]);

  // --- UI & Filter States ---
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attSearch, setAttSearch] = useState('');
  const [attDept, setAttDept] = useState('');
  const [attType, setAttType] = useState('');
  const [attDate, setAttDate] = useState('');
  
  const [paySearch, setPaySearch] = useState('');
  const [payType, setPayType] = useState('');

  /**
   * Fetch Attendance data from the Spring Boot Backend.
   * This function constructs the URL with query parameters for filtering.
   */
  const fetchAttendanceData = useCallback(async () => {
    setLoading(true);
    try {
      // Constructing the backend URL with filters
      // Example: http://localhost:2027/api/attendance/filter?date=2026-04-05&dept=IT
      let url = new URL('http://localhost:2027/api/attendance/filter');
      
      if (attDate) url.searchParams.append('date', attDate);
      if (attDept) url.searchParams.append('dept', attDept);
      if (attType) url.searchParams.append('type', attType);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setAttendanceList(result.data);
      } else {
        console.error("Backend Error:", result.message);
        setAttendanceList([]);
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  }, [attDate, attDept, attType]);

  /**
   * Re-run the fetch function whenever a filter (Date, Dept, or Type) changes.
   */
  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  // --- Handle Payroll Approval ---
  const handleApprove = (id: string) => {
    setPayrollList(prev => 
      prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item)
    );
    setShowPopup(true);
  };

  // Auto-hide success popup
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // Client-side search filtering (for searching by Name or ID within the loaded list)
  const filteredAttendance = attendanceList.filter((item: any) => {
    const matchesSearch = 
      item.employeeId.toString().includes(attSearch) || 
      item.employeeName.toLowerCase().includes(attSearch.toLowerCase());
    return matchesSearch;
  });

  const filteredPayroll = payrollList.filter((item) => {
    const matchesSearch = item.id.includes(paySearch) || item.name.toLowerCase().includes(paySearch.toLowerCase());
    const matchesType = payType === '' || item.type === payType;
    return matchesSearch && matchesType;
  });

  return (
    <div className={styles.container}>
      {/* Success Notification Popup */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Payroll Approved successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.mainTitle}>Attendance and Payroll Operations</h1>

      {/* --- Attendance Verifications Section --- */}
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Attendance Verifications</h2>
        
        {/* Filters Grid */}
        <div className={styles.filters}>
          <input 
            type="date" 
            className={styles.filterInput} 
            onChange={(e) => setAttDate(e.target.value)} 
          />
          
          <select className={styles.filterSelect} onChange={(e) => setAttDept(e.target.value)}>
            <option value="">Filter by Department</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
          </select>
          
          <select className={styles.filterSelect} onChange={(e) => setAttType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Academic">Academic</option>
            <option value="Non-Academic">Non-Academic</option>
          </select>
          
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search Name/ID..." 
              className={styles.searchInput} 
              onChange={(e) => setAttSearch(e.target.value)} 
            />
            <Search className={styles.searchIcon} size={18} />
          </div>
        </div>

        {/* Attendance Data Table */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Type</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>Loading data...</td></tr>
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
                    <Link href={`/hr_staff/attendance/edit-attendance/${item.id}`}>
                      <button className={styles.editBtn}>Edit/View</button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>No records found</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* --- Payroll Details Section --- */}
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Payroll Details</h2>
        <div className={styles.payrollFilters}>
          <input type="month" className={styles.filterInput} />
          <select className={styles.filterSelect} onChange={(e) => setPayType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Academic">Academic</option>
            <option value="Non-Academic">Non-Academic</option>
          </select>
          
          <div className={styles.searchWrapper}>
            <div className={styles.searchContainer}>
              <input 
                type="text" 
                placeholder="Search Employee..." 
                className={styles.searchInput} 
                onChange={(e) => setPaySearch(e.target.value)}
              />
              <Search className={styles.searchIcon} size={18} />
            </div>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayroll.map((item) => (
              <tr key={item.id} className={styles.tableRow}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.basic}</td>
                <td>{item.net}</td>
                <td>
                  <Link href={`/hr_staff/attendance/edit-salary/${item.id}`}>
                    <button className={styles.editBtn}>Edit/View</button>
                  </Link>
                </td>
                <td>
                  {item.status === 'Approved' ? (
                    <span className={styles.statusText}>Approved</span>
                  ) : (
                    <button className={styles.approveBtn} onClick={() => handleApprove(item.id)}>
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
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