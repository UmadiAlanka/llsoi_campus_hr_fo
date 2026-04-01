"use client";

import React, { useState } from "react";
import styles from "./leave.module.css";

interface LeaveRequest {
  id: string;
  employeeId: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

const initialData: LeaveRequest[] = [
  { id: "1", employeeId: "001", name: "S.Perera",   type: "Sick Leave",   startDate: "2025-11-10", endDate: "2025-11-12", reason: "Fever",         status: "Pending"  },
  { id: "2", employeeId: "002", name: "K.Dias",     type: "Annual Leave", startDate: "2025-11-20", endDate: "2025-11-22", reason: "Family event",  status: "Pending"  },
  { id: "3", employeeId: "003", name: "N.Fernando", type: "Casual Leave", startDate: "2025-10-05", endDate: "2025-10-05", reason: "Personal work", status: "Approved" },
];

export default function AdminLeave() {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialData);
  const [filter, setFilter] = useState("All");

  const updateStatus = (id: string, status: "Approved" | "Rejected") => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const filtered = filter === "All" ? requests : requests.filter((r) => r.status === filter);

  return (
    <>
      <h2 className={styles.pageTitle}>Leave Management</h2>

      <div className={styles.statsRow}>
        {[
          { label: "Total Requests", value: requests.length,                                  color: "#720e0e" },
          { label: "Pending",        value: requests.filter(r => r.status === "Pending").length,  color: "#f59e0b" },
          { label: "Approved",       value: requests.filter(r => r.status === "Approved").length, color: "#16a34a" },
          { label: "Rejected",       value: requests.filter(r => r.status === "Rejected").length, color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} className={styles.statCard} style={{ borderTop: `4px solid ${s.color}` }}>
            <p className={styles.statValue} style={{ color: s.color }}>{s.value}</p>
            <p className={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className={styles.filterRow}>
        {["All", "Pending", "Approved", "Rejected"].map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.tableCard}>
        <table className={styles.leaveTable}>
          <thead>
            <tr>
              <th>ID</th><th>Employee</th><th>Type</th>
              <th>Start</th><th>End</th><th>Reason</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req) => (
              <tr key={req.id}>
                <td>{req.employeeId}</td>
                <td>{req.name}</td>
                <td>{req.type}</td>
                <td>{req.startDate}</td>
                <td>{req.endDate}</td>
                <td className={styles.reasonCell}>{req.reason}</td>
                <td>
                  <span className={`${styles.badge} ${styles[`badge${req.status}`]}`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === "Pending" ? (
                    <div className={styles.actionBtns}>
                      <button className={styles.approveBtn} onClick={() => updateStatus(req.id, "Approved")}>Approve</button>
                      <button className={styles.rejectBtn}  onClick={() => updateStatus(req.id, "Rejected")}>Reject</button>
                    </div>
                  ) : (
                    <span className={styles.doneText}>Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}