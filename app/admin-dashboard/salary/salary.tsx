"use client";

import React, { useState, useRef } from "react";
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
  const [records] = useState<SalaryRecord[]>([
    { id: "001", name: "S.Perera", basicSalary: "50,000", netSalary: "52,000", date: "2025-10-10", type: "Academic" },
    { id: "002", name: "K.Dias",   basicSalary: "60,000", netSalary: "61,000", date: "2025-10-10", type: "Non-Academic" },
  ]);

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
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.name}</td>
                <td>Rs {record.basicSalary}</td>
                <td>Rs {record.netSalary}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}