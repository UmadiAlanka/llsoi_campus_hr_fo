"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./salary.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MessageBox from "../components/MessageBox";
import { Search } from "lucide-react";

interface SalaryRecord {
  id: number;
  employee: {
    id: number;
    name: string;
    employeeId: string;
    jobType?: string;
    department?: string;
  };
  basicSalary: number;
  allowances: number;
  overtimePay: number;
  epfDeduction: number;
  etfDeduction: number;
  otherDeductions: number;
  grossSalary: number;
  netSalary: number;
  month: number;
  year: number;
  status: string;
  generatedDate?: string;
}

export default function AdminSalary() {
  const monthInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Payslip modal state
  const [selectedSlip, setSelectedSlip] = useState<SalaryRecord | null>(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  const [msgConfig, setMsgConfig] = useState<{
    message: string;
    type: "success" | "error" | "confirm";
    onConfirm?: () => void;
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

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employee?.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());

    const recordMonthStr = `${record.year}-${String(record.month).padStart(2, "0")}`;
    const matchesMonth = selectedMonth ? recordMonthStr === selectedMonth : true;

    return matchesSearch && matchesMonth;
  });

  const getMonthName = (m: number) =>
    new Date(2000, m - 1).toLocaleString("en-US", { month: "long" });

  const handleViewPayslip = (record: SalaryRecord) => {
    setSelectedSlip(record);
    setShowPayslipModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- DELETE LOGIC ---
  const handleDeleteClick = (id: number) => {
    setMsgConfig({
      type: "confirm",
      message:
        "Are you sure you want to delete this record? This will also remove any linked anomalies.",
      onConfirm: () => executeDelete(id),
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
          type: "error",
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

          <div
            className={styles.filterBox}
            onClick={() => monthInputRef.current?.showPicker?.()}
          >
            <input
              type="month"
              ref={monthInputRef}
              className={styles.monthInput}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            {!selectedMonth && (
              <span className={styles.monthPlaceholder}>Filter by Month</span>
            )}
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
              <th>Pay Slip</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                  Loading records...
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                  No records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.employee?.employeeId}</td>
                  <td>{record.employee?.name}</td>
                  <td>Rs {record.basicSalary?.toLocaleString()}</td>
                  <td>Rs {record.netSalary?.toLocaleString()}</td>
                  <td>
                    {record.month}/{record.year}
                  </td>
                  <td>
                    <span
                      className={
                        record.status === "APPROVED"
                          ? styles.statusApproved
                          : styles.statusPending
                      }
                    >
                      {record.status}
                    </span>
                  </td>
                  <td>
                    {/* View payslip modal — same as employee section */}
                    <button
                      onClick={() => handleViewPayslip(record)}
                      style={{
                        background: "#720e0e",
                        color: "#FFD814",
                        border: "none",
                        padding: "5px 14px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "0.78rem",
                        fontFamily: "Kanit, sans-serif",
                      }}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin-dashboard/salary/edit/${record.id}`}>
                        <button className={styles.editBtn}>Edit</button>
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteClick(record.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── PAYSLIP MODAL (identical layout to employee section) ── */}
      {showPayslipModal && selectedSlip && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            overflowY: "auto",
            padding: "20px",
          }}
          onClick={() => setShowPayslipModal(false)}
        >
          <div
            style={{
              background: "white",
              width: "100%",
              maxWidth: "800px",
              borderRadius: "8px",
              padding: "40px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Printable content */}
            <div id="admin-printable-payslip" style={{ color: "#333", fontFamily: "Inter, sans-serif" }}>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <img src="/logo.png" alt="Logo" style={{ width: "80px", height: "80px", objectFit: "contain" }} />
                  <div>
                    <h2 style={{ margin: 0, color: "#7a1212", fontSize: "1.5rem" }}>
                      LLSOI CAMPUS (PVT) LTD.
                    </h2>
                    <p style={{ margin: "5px 0 0", color: "#666", fontWeight: 600 }}>
                      Employee Pay Sheet —{" "}
                      {getMonthName(selectedSlip.month).toUpperCase()} {selectedSlip.year}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    background: "#7a1212",
                    color: "white",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {selectedSlip.status}
                </span>
              </div>

              <hr style={{ border: "0", borderTop: "2px solid #7a1212", margin: "20px 0" }} />

              {/* Employee details */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "30px",
                }}
              >
                <div>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Employee Name:</strong> {selectedSlip.employee?.name}
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Employee ID:</strong> {selectedSlip.employee?.employeeId}
                  </p>
                  {selectedSlip.employee?.department && (
                    <p style={{ margin: "5px 0" }}>
                      <strong>Department:</strong> {selectedSlip.employee.department}
                    </p>
                  )}
                </div>
                <div>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Pay Period:</strong> {getMonthName(selectedSlip.month)}{" "}
                    {selectedSlip.year}
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Generated Date:</strong>{" "}
                    {selectedSlip.generatedDate
                      ? new Date(selectedSlip.generatedDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {selectedSlip.employee?.jobType && (
                    <p style={{ margin: "5px 0" }}>
                      <strong>Employee Type:</strong> {selectedSlip.employee.jobType}
                    </p>
                  )}
                </div>
              </div>

              {/* Earnings & Deductions grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" }}>
                {/* Earnings */}
                <div>
                  <h4
                    style={{
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "10px",
                      color: "#7a1212",
                      marginTop: 0,
                    }}
                  >
                    EARNINGS
                  </h4>
                  {[
                    ["Basic Salary", selectedSlip.basicSalary],
                    ["Allowances", selectedSlip.allowances],
                    ["Overtime Pay", selectedSlip.overtimePay],
                  ].map(([label, val]) => (
                    <div
                      key={label as string}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px dashed #eee",
                      }}
                    >
                      <span>{label}</span>
                      <span>
                        {Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      fontWeight: "bold",
                      borderTop: "1px solid #333",
                      marginTop: "10px",
                    }}
                  >
                    <span>GROSS SALARY</span>
                    <span>
                      LKR{" "}
                      {Number(
                        selectedSlip.grossSalary || selectedSlip.basicSalary || 0
                      ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4
                    style={{
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "10px",
                      color: "#7a1212",
                      marginTop: 0,
                    }}
                  >
                    DEDUCTIONS
                  </h4>
                  {[
                    ["EPF (8%)", selectedSlip.epfDeduction],
                    ["ETF (3%)", selectedSlip.etfDeduction],
                    ["Other Deductions", selectedSlip.otherDeductions],
                  ].map(([label, val]) => (
                    <div
                      key={label as string}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px dashed #eee",
                      }}
                    >
                      <span>{label}</span>
                      <span>
                        {Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      fontWeight: "bold",
                      borderTop: "1px solid #333",
                      marginTop: "10px",
                    }}
                  >
                    <span>TOTAL DEDUCTIONS</span>
                    <span>
                      LKR{" "}
                      {Number(
                        (selectedSlip.epfDeduction || 0) +
                          (selectedSlip.etfDeduction || 0) +
                          (selectedSlip.otherDeductions || 0)
                      ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net salary */}
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "20px",
                  border: "2px solid #7a1212",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "4px",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#7a1212" }}>
                  NET SALARY (TAKE HOME)
                </span>
                <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#7a1212" }}>
                  LKR{" "}
                  {Number(selectedSlip.netSalary || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div
                style={{
                  marginTop: "50px",
                  textAlign: "center",
                  fontSize: "0.8rem",
                  color: "#888",
                }}
              >
                <p>This is a computer-generated document and does not require a signature.</p>
              </div>
            </div>

            {/* Modal action buttons */}
            <div
              className="no-print"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "15px",
                marginTop: "30px",
              }}
            >
              <button
                onClick={handlePrint}
                style={{
                  background: "#7a1212",
                  color: "white",
                  border: "none",
                  padding: "10px 25px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Print / Save as PDF
              </button>
              <button
                onClick={() => setShowPayslipModal(false)}
                style={{
                  background: "#666",
                  color: "white",
                  border: "none",
                  padding: "10px 25px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}