"use client";

import React, { useState, useEffect } from 'react';
import styles from './attendance.module.css';
import { Search } from 'lucide-react';
import Link from 'next/link';

const AttendancePage = () => {
  // Mock Data
  const initialAttendance = [
    { id: '001', name: 'S.Perera', date: '2025-09-10', time: '8.00AM', dept: 'HR', type: 'Academic' },
    { id: '002', name: 'K.Dias', date: '2025-09-10', time: '8.10AM', dept: 'IT', type: 'Non-Academic' },
    { id: '003', name: 'N.Fernando', date: '2025-09-10', time: '8.00AM', dept: 'Finance', type: 'Academic' },
  ];

  const [payrollList, setPayrollList] = useState([
    { id: '001', name: 'S.Perera', basic: '50,000', net: '52,000', status: 'Approved', type: 'Academic' },
    { id: '002', name: 'K.Dias', basic: '60,000', net: '61,000', status: 'Approve', type: 'Non-Academic' },
  ]);

  // UI States
  const [showPopup, setShowPopup] = useState(false);
  const [attSearch, setAttSearch] = useState('');
  const [attDept, setAttDept] = useState('');
  const [attType, setAttType] = useState('');
  const [attDate, setAttDate] = useState('');
  const [paySearch, setPaySearch] = useState('');
  const [payType, setPayType] = useState('');

  // Handle Approve with Popup
  const handleApprove = (id: string) => {
    setPayrollList(prev => 
      prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item)
    );
    setShowPopup(true);
  };

  // Auto-hide popup after 3 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // Filter Logic
  const filteredAttendance = initialAttendance.filter((item) => {
    return (item.id.includes(attSearch) || item.name.toLowerCase().includes(attSearch.toLowerCase())) &&
           (attDept === '' || item.dept === attDept) &&
           (attType === '' || item.type === attType) &&
           (attDate === '' || item.date === attDate);
  });

  const filteredPayroll = payrollList.filter((item) => {
    return (item.id.includes(paySearch) || item.name.toLowerCase().includes(paySearch.toLowerCase())) &&
           (payType === '' || item.type === payType);
  });

  return (
    <div className={styles.container}>
      {/* Success Popup Message */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Payroll Approved successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.mainTitle}>Attendance and payroll operations</h1>

      {/* Attendance Verifications Section */}
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Attendance Verifications</h2>
        <div className={styles.filters}>
          <input type="date" className={styles.filterInput} onChange={(e) => setAttDate(e.target.value)} />
          <select className={styles.filterSelect} onChange={(e) => setAttDept(e.target.value)}>
            <option value="">Filter by Department</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
          </select>
          <select className={styles.filterSelect} onChange={(e) => setAttType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Academic">Academic</option>
            <option value="Non-Academic">Non-Academic</option>
          </select>
          
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search Employee: Name/ ID" 
              className={styles.searchInput} 
              onChange={(e) => setAttSearch(e.target.value)} 
            />
            <Search className={styles.searchIcon} size={18} />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time Marked</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((item) => (
              <tr key={item.id} className={styles.tableRow}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td>
                  <Link href={`/hr_staff/attendance/edit-attendance/${item.id}`}>
                    <button className={styles.editBtn}>Edit/View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Payroll Details Section */}
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
                placeholder="Search Employee: Name/ ID" 
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