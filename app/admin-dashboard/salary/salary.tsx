"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./salary.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 1. Import usePathname

interface SalaryRecord {
  id: number;
  employee: {
    id: number;
    name: string;
    employeeId: string;
  };
  basicSalary: number;
  netSalary: number;
  month: number;
  year: number;
  status: string;
}

export default function AdminSalary() {
  const monthInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname(); // 2. Initialize pathname tracking
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Updated useEffect to depend on pathname
  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:2027/api/payroll/all");
        const result = await response.json();

        if (result && result.success && Array.isArray(result.data)) {
          setRecords(result.data);
        } else {
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
  }, [pathname]); // Triggers fetch whenever the user navigates back to this route

  const downloadPdf = async (id: number, empId: string) => {
    try {
      const response = await fetch(`http://localhost:2027/api/payroll/download/${id}`);
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `PaySlip_${empId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Could not download the pay slip.");
    }
  };

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
                    <button 
                      className={styles.pdfBtn}
                      onClick={() => downloadPdf(record.id, record.employee?.employeeId || record.id.toString())}
                    >
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