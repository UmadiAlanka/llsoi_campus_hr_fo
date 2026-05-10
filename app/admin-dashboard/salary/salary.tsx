"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./salary.module.css";
import Link from "next/link";

interface SalaryRecord {
  id: string;
  name: string;
  basicSalary: string;
  netSalary: string;
  date: string;
  type: string;
}

export default function AdminSalary() {
  const monthInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize as an empty array to prevent .map() errors on first render
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        // Adjust the port/URL to match your Spring Boot configuration
        const response = await fetch("http://localhost:2027/api/salary/all");
        const result = await response.json();

        /* 
           CRITICAL FIX: Check if result is the array itself or a wrapper object.
           If your Java backend returns List<Salary>, it's result.
           If it returns an ApiResponse object, it's likely result.data.
        */
        if (Array.isArray(result)) {
          setRecords(result);
        } else if (result && result.data && Array.isArray(result.data)) {
          setRecords(result.data);
        } else {
          console.error("Data received is not an array:", result);
          setRecords([]); 
        }
      } catch (error) {
        console.error("Failed to fetch salary data:", error);
        setRecords([]); // Fallback to empty array on network error
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, []);

  const handleMonthClick = () => {
    if (monthInputRef.current) {
      (monthInputRef.current as any).showPicker?.();
    }
  };

  return (
    <>
      <h2 className={styles.pageTitle}>Salary &amp; Pay Slip</h2>

      <div className={styles.topSection}>
        <div className={styles.filterBar}>
          <div className={styles.filterBox}>
            <select className={styles.filterSelect}><option>Filter by Name</option></select>
            <img src="/icons/dropdown.png" alt="" className={styles.filterIcon} />
          </div>
          <div className={styles.filterBox} onClick={handleMonthClick} style={{ cursor: 'pointer' }}>
            <input type="month" ref={monthInputRef} className={styles.monthInput} />
            <span className={styles.monthPlaceholder}>Filter by Month</span>
            <img src="/icons/calendar.png" alt="" className={styles.filterIcon} />
          </div>
          <div className={styles.filterBox}>
            <select className={styles.filterSelect}><option>Filter by Type</option></select>
            <img src="/icons/dropdown.png" alt="" className={styles.filterIcon} />
          </div>
        </div>

        <Link href="/admin-dashboard/salary/add-salary">
          <button className={styles.addSalaryBtn}>+ ADD SALARY</button>
        </Link>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.salaryTable}>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Basic Salary</th><th>Net Salary</th>
              <th>Date</th><th>Type</th><th>Download</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{textAlign: 'center', padding: '20px'}}>Loading Data...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={8} style={{textAlign: 'center', padding: '20px'}}>No records found.</td></tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.name}</td>
                  {/* Formatting strings to numbers for currency view */}
                  <td>Rs {Number(record.basicSalary).toLocaleString()}</td>
                  <td>Rs {Number(record.netSalary).toLocaleString()}</td>
                  <td>{record.date}</td>
                  <td>{record.type}</td>
                  <td>
                    <button className={styles.pdfBtn}>
                      <img src="/icons/pdf.png" alt="PDF" style={{ width: 24 }} />
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin-dashboard/salary/edit/${record.id}`}>
                        <button className={styles.editBtn}>Edit</button>
                      </Link>
                      <button className={styles.deleteBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}const fetchSalaries = async () => {
  try {
    const response = await fetch("http://localhost:2027/api/salary/all");
    const result = await response.json();

    // Check if result is an array or if it's an object with a 'data' array
    if (Array.isArray(result)) {
      setRecords(result);
    } else if (result && Array.isArray(result.data)) {
      setRecords(result.data);
    } else {
      // If we get {}, we treat it as an empty list to avoid crashing
      setRecords([]); 
      if (Object.keys(result).length > 0) {
        console.error("Data received is not an array:", result);
      }
    }
  } catch (error) {
    console.error("Network Error:", error);
    setRecords([]); 
  } finally {
    setLoading(false);
  }
};