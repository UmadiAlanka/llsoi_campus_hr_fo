"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./salary.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MessageBox from "../components/MessageBox"; 
import { Search, FileText } from "lucide-react"; 

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
  const pathname = usePathname();
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // MessageBox State for Success, Error, and Confirmations
  const [msgConfig, setMsgConfig] = useState<{ 
    message: string; 
    type: 'success' | 'error' | 'confirm'; 
    onConfirm?: () => void 
  } | null>(null);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:2027/api/payroll/all");
      const result = await response.json();
      if (result?.success) setRecords(result.data);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [pathname]);

  // Combined Search and Month Filtering Logic
  const filteredRecords = records.filter((record) => {
    const matchesSearch = 
      record.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employee?.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const recordMonthStr = `${record.year}-${String(record.month).padStart(2, '0')}`;
    const matchesMonth = selectedMonth ? recordMonthStr === selectedMonth : true;

    return matchesSearch && matchesMonth;
  });

  // --- DOWNLOAD LOGIC ---
  const handleDownload = async (id: number, empId: string) => {
    try {
      const response = await fetch(`http://localhost:2027/api/payroll/download/${id}`);
      
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `PaySlip_${empId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setMsgConfig({ message: "Payslip downloaded successfully!", type: "success" });
    } catch (error) {
      setMsgConfig({ message: "Could not download PDF. Check server connection.", type: "error" });
    }
  };

  // --- DELETE LOGIC ---
  const handleDeleteClick = (id: number) => {
    setMsgConfig({
      type: 'confirm',
      message: "Are you sure you want to delete this record? This will also remove any linked anomalies.",
      onConfirm: () => executeDelete(id)
    });
  };

  const executeDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:2027/api/payroll/delete/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        setMsgConfig({ message: "Salary record deleted successfully!", type: "success" });
      } else {
        setMsgConfig({ 
          message: result.message || "Failed to delete record.", 
          type: "error" 
        });
      }
    } catch (error) {
      setMsgConfig({ message: "Server connection failed.", type: "error" });
    }
  };

  return (
    <div className={styles.container}>
      {msgConfig && (
        <MessageBox 
          type={msgConfig.type}
          message={msgConfig.message} 
          onClose={() => setMsgConfig(null)} 
          onConfirm={msgConfig.onConfirm}
        />
      )}

      <h2 className={styles.pageTitle}>Salary &amp; Pay Slip</h2>

      <div className={styles.topSection}>
        <div className={styles.filterBar}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search by Name or ID..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterBox} onClick={() => monthInputRef.current?.showPicker?.()}>
            <input 
              type="month" 
              ref={monthInputRef} 
              className={styles.monthInput} 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            {!selectedMonth && <span className={styles.monthPlaceholder}>Filter by Month</span>}
          </div>
        </div>

        <div className={styles.addBtnWrapper}>
          <Link href="/admin-dashboard/salary/add-salary" className={styles.addSalaryLink}>
            <button className={styles.addSalaryBtn}>+ ADD SALARY</button>
          </Link>
        </div>
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
            ) : filteredRecords.length === 0 ? (
              <tr><td colSpan={8} className={styles.infoCell}>No records found.</td></tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.employee?.employeeId}</td>
                  <td>{record.employee?.name}</td>
                  <td>Rs {record.basicSalary?.toLocaleString()}</td>
                  <td>Rs {record.netSalary?.toLocaleString()}</td>
                  <td>{record.month}/{record.year}</td>
                  <td>
                    <span className={record.status === "APPROVED" ? styles.statusApproved : styles.statusPending}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.downloadBtn} 
                      onClick={() => handleDownload(record.id, record.employee?.employeeId)}
                    >
                      <FileText size={22} color="#720e0e" />
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin-dashboard/salary/edit/${record.id}`}>
                        <button className={styles.editBtn}>Edit</button>
                      </Link>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteClick(record.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}