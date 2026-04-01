"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './adminAttendance.module.css';
import Link from 'next/link';

// Updated interface to match your Spring Boot model structure
interface AttendanceRecord {
  id: number;
  date: string;
  clockInTime: string;
  employee?: {
    id: number;
    name: string;
    department: string;
  };
}

const AdminAttendance: React.FC = () => {
  // Initialize as an empty array to hold real data
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Fetch real data from the backend
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Port 2027 based on your application.properties
        const response = await fetch("http://localhost:2027/api/attendance/all");
        const result = await response.json();

        if (result.success && result.data) {
          setRecords(result.data);
        }
      } catch (error) {
        console.error("Error loading attendance records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const handleIconClick = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        (dateInputRef.current as any).showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <>
      <h2 className={styles.pageTitle}>Attendance</h2>

      <div className={styles.filterSection}>
        <div className={styles.filterGrid}>
          <div className={styles.filterBox} onClick={handleIconClick} style={{ cursor: 'pointer' }}>
            <input
              type="date"
              ref={dateInputRef}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.filterInput}
            />
            <img src="/icons/calendar.png" alt="calendar" className={styles.filterIcon} />
          </div>
          <div className={styles.filterBox}>
            <select className={styles.filterSelect}>
              <option>Filter by Department</option>
              <option>HR</option>
              <option>Management</option>
              <option>Language</option>
              <option>IT</option>
              <option>Behavioral</option>
            </select>
            <img src="/icons/dropdown.png" alt="arrow" className={styles.filterIcon} />
          </div>
          <div className={styles.filterBox}>
            <select className={styles.filterSelect}>
              <option>Select Type</option>
              <option>Academic</option>
              <option>Non-Academic</option>
            </select>
            <img src="/icons/dropdown.png" alt="arrow" className={styles.filterIcon} />
          </div>
        </div>

        <Link href="/admin-dashboard/admin-attendance/mark-attendance">
          <button className={styles.markAttendanceBtn}>+ Mark Attendance</button>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.attendanceTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time Marked</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Loading Attendance Records...</td></tr>
            ) : records.length > 0 ? (
              records.map((record) => (
                <tr key={record.id}>
                  {/* Pulls data from the nested employee object in your Java model */}
                  <td>{record.employee?.id?.toString().padStart(3, '0') || 'N/A'}</td>
                  <td>{record.employee?.name || 'Unknown'}</td>
                  <td>{record.date}</td>
                  <td>{record.clockInTime || 'Not Marked'}</td>
                  <td>{record.employee?.department || 'Staff'}</td>
                  <td>
                    <Link href={`/admin-dashboard/admin-attendance/edit-attendance/${record.id}`}>
                      <button className={styles.editBtn}>EDIT / View</button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No records found in database.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminAttendance;