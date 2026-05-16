"use client";

import React, { useState, useEffect, useCallback } from 'react';
import styles from './leave.module.css'; // Using the specific leave style file
import { Search } from 'lucide-react';
import Link from 'next/link';

/**
 * Leave Management Component
 * Designed to match the Attendance and Payroll operations layout.
 */
const LeaveManagement = () => {
  // --- States for Data ---
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Fetch Pending Leave data from the Backend API
   */
  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      // Backend port 2027 used as per previous discussions
      const response = await fetch('http://localhost:2027/api/leaves/pending');
      const result = await response.json();
      
      if (result.success) {
        setLeaveRequests(result.data);
      }
    } catch (error) {
      console.error("Leave Data Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Data Load
  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  /**
   * Handle Approve or Reject Actions
   * Updates the status and removes the row from the pending list
   */
  const handleAction = async (id: number, status: string) => {
    try {
      const action = status === 'APPROVED' ? 'approve' : 'reject';
      const response = await fetch(`http://localhost:2027/api/leaves/${id}/${action}`, {
        method: 'PUT'
      });
      const result = await response.json();

      if (result.success) {
        // Remove processed record from UI using the unique leave record ID
        setLeaveRequests(prev => prev.filter((item: any) => item.id !== id));
      }
    } catch (error) {
      console.error("Action Error:", error);
    }
  };

  // --- Client-side Search Filtering ---
  const filteredLeaves = leaveRequests.filter((item: any) => {
    const searchLower = searchTerm.toLowerCase();
    const empName = item.employee?.name?.toLowerCase() || "";
    const empId = item.employee?.employeeId?.toString() || "";
    return empName.includes(searchLower) || empId.includes(searchLower);
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Leave Management Operations</h1>

      {/* --- Leave Verifications Section --- */}
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Leave Verifications</h2>
        
        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <div className={styles.searchContainer}>
              <input 
                type="text" 
                placeholder="Search Name or Employee ID..." 
                className={styles.searchInput} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              <Search className={styles.searchIcon} size={18} />
            </div>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              {/* 👈 Changed from "ID" to "Employee ID" for better visual clarity */}
              <th>Employee ID</th>
              <th>Name</th>
              <th>Reason</th>
              <th>Duration (Date Range)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className={styles.loadingCell}>Loading leave data...</td></tr>
            ) : filteredLeaves.length > 0 ? (
              filteredLeaves.map((item: any) => (
                <tr key={item.id} className={styles.tableRow}>
                  {/* Displaying actual Database Employee ID matching Attendance style */}
                  <td>{item.employee?.employeeId || 'N/A'}</td>
                  <td>{item.employee?.name || 'N/A'}</td>
                  <td>{item.reason}</td>
                  {/* Using Badge style for Date Range */}
                  <td>
                    <span className={styles.deptBadge}>
                      {item.startDate} to {item.endDate}
                    </span>
                  </td>
                  <td>
                    <span className={styles.statusLabel}>
                      {item.status}
                    </span>
                  </td>
                  <td className={styles.actionCells}>
                    <button 
                      className={styles.approveBtn} 
                      onClick={() => handleAction(item.id, 'APPROVED')}
                    >
                      Approve
                    </button>
                    <button 
                      className={styles.rejectBtn} 
                      onClick={() => handleAction(item.id, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className={styles.noDataCell}>No pending leave records found</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Navigation to History Page */}
      <Link href="/hr_staff/leave/history">
        <button className={styles.summaryBtn}>View Leave History</button>
      </Link>
    </div>
  );
};

export default LeaveManagement;