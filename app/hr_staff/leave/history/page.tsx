"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './history.module.css';

/**
 * Leave History Component
 * Based on prototype p-HRstaff14_2.JPG with glassmorphic table and back button.
 */
const LeaveHistory = () => {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all processed leave records (Approved/Rejected)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:2027/api/leaves/history');
        const result = await response.json();
        if (result.success) {
          setHistory(result.data);
        }
      } catch (error) {
        console.error("Error fetching leave history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Leave History</h1>

      {/* Glassmorphism Card Container as seen in p-HRstaff14_2.JPG */}
      <section className={styles.glassCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                {/* 👈 Changed from "ID" to "Employee ID" for consistency across operations */}
                <th>Employee ID</th>
                <th>Name</th>
                <th>Leave Dates</th>
                <th>Type</th>
                <th>Status</th>
                <th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className={styles.statusCell}>Loading history...</td></tr>
              ) : history.length > 0 ? (
                history.map((item: any) => (
                  <tr key={item.id} className={styles.tableRow}>
                    {/* 👈 Displays the real database employeeId directly */}
                    <td>{item.employee?.employeeId || 'N/A'}</td>
                    <td>{item.employee?.name || 'N/A'}</td>
                    <td>{item.startDate} to {item.endDate}</td>
                    <td>{item.leaveType || 'Academic'}</td>
                    <td className={styles.statusText}>{item.status}</td>
                    <td>{item.approvedBy || 'Admin'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className={styles.statusCell}>No history records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Green Back Button matching the prototype */}
        <div className={styles.buttonContainer}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            Back
          </button>
        </div>
      </section>
    </div>
  );
};

export default LeaveHistory;