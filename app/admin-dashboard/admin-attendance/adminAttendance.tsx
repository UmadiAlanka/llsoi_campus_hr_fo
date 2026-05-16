"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './adminAttendance.module.css';
import Link from 'next/link';
import MessageBox from "../components/MessageBox"; 

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
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    msg: string;
  }>({
    show: false,
    type: "success",
    msg: "",
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("http://localhost:2027/api/attendance/all");
        const result = await response.json();

        if (result.success && result.data) {
          // SORTING LOGIC: Newest Records at the Top (Descending Order)
          const sorted = [...result.data].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.clockInTime || '00:00:00'}`).getTime();
            const dateB = new Date(`${b.date}T${b.clockInTime || '00:00:00'}`).getTime();
            return dateB - dateA; // B - A gives descending order (newest first)
          });
          setRecords(sorted);
        } else if (!result.success) {
          setModal({ show: true, type: "error", msg: result.message || "Failed to load records." });
        }
      } catch (error) {
        setModal({ show: true, type: "error", msg: "Could not connect to the server." });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Filter records based on selected date (Search Bar functionality)
  const filteredRecords = useMemo(() => {
    if (!selectedDate) return records;
    return records.filter((record) => record.date === selectedDate);
  }, [selectedDate, records]);

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
          {selectedDate && (
            <button 
              onClick={() => setSelectedDate('')}
              style={{ marginLeft: '10px', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              Show All
            </button>
          )}
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
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id}>
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
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.show && (
        <MessageBox 
          type={modal.type} 
          message={modal.msg} 
          onClose={() => setModal({ ...modal, show: false })} 
        />
      )}
    </>
  );
};

export default AdminAttendance;
