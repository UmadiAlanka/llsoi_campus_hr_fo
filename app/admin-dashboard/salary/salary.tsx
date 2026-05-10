"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./salary.module.css";
import Link from "next/link";

// interface updated to include the nested employeeId
interface SalaryRecord {
  id: number;
  employee: {
    id: number;
    name: string;
    employeeId: string; // This is the custom ID from your Java backend
  };
  basicSalary: number;
  netSalary: number;
  month: number;
  year: number;
  status: string;
}

export default function AdminSalary() {
  const monthInputRef = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        setLoading(true);
        // Using the /api/payroll/all endpoint from your Spring Boot controller
        const response = await fetch("http://localhost:2027/api/payroll/all");
        const result = await response.json();

        // Safely unwrapping the ApiResponse object
        if (result && result.success && Array.isArray(result.data)) {
          setRecords(result.data);
        } else {
          console.error("Data mapping error or empty database:", result);
          setRecords([]);
        }
      } catch (error) {
        console.error("Network connection failed:", error);
        setRecords([]);
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
              <th>Emp ID</th>
              <th>Name</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>
              <th>Period</th>
              <th>Status</th>
              <th>Download</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className={styles.infoCell}>Loading records...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={8} className={styles.infoCell}>No payroll data available.</td></tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  {/* ACCESSING THE CUSTOM EMPLOYEE ID */}
                  <td>{record.employee?.employeeId || record.id}</td>
                  
                  <td>{record.employee?.name || "Unknown"}</td>
                  <td>Rs {record.basicSalary?.toLocaleString()}</td>
                  <td>Rs {record.netSalary?.toLocaleString()}</td>
                  <td>{record.month}/{record.year}</td>
                  <td>
                    <span className={record.status === "APPROVED" ? styles.statusApproved : styles.statusPending}>
                      {record.status || "PENDING"}
                    </span>
                  </td>
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
}