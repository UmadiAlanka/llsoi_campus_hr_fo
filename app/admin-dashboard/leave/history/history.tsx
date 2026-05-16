"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./history.module.css";
import MessageBox from "../../components/MessageBox";

interface LeaveRecord {
  id: number;
  employee: {
    id: number;
    name: string;
    employeeId: string;
  };
  startDate: string;
  endDate: string;
  leave_type: string;
  reason: string;
  status: string;
  approvedBy?: string;
}

const BASE = "http://localhost:2027/api";

const formatDate = (dateVal: any): string => {
  if (!dateVal) return "N/A";
  if (Array.isArray(dateVal)) {
    const [y, m, d] = dateVal;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  return String(dateVal);
};

export default function LeaveHistory() {
  const [history, setHistory] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    msg: string;
  }>({ show: false, type: "success", msg: "" });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE}/leaves`, { cache: "no-store" });
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          // Show only resolved records (approved or rejected) in history
          const resolved = result.data.filter(
            (r: LeaveRecord) =>
              r.status?.toUpperCase() === "APPROVED" ||
              r.status?.toUpperCase() === "REJECTED"
          );
          setHistory(resolved);
        } else {
          setModal({
            show: true,
            type: "error",
            msg: "Failed to load leave history.",
          });
        }
      } catch {
        setModal({
          show: true,
          type: "error",
          msg: "Could not connect to server on port 2027.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className={styles.historyContainer}>
      {modal.show && (
        <MessageBox
          type={modal.type}
          message={modal.msg}
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}

      <div className={styles.overlay}></div>

      <div className={styles.contentWrapper}>
        <h1 className={styles.pageTitle}>Leave History</h1>

        <div className={styles.tableCard}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Leave Dates</th>
                <th>Type</th>
                <th>Status</th>
                <th>Approved By</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                    Loading history...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                    No approved or rejected leave records found.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.employee?.employeeId ||
                        item.employee?.id?.toString().padStart(3, "0") ||
                        "—"}
                    </td>
                    <td>{item.employee?.name || "—"}</td>
                    <td>
                      {formatDate(item.startDate)} to {formatDate(item.endDate)}
                    </td>
                    <td>{item.leave_type || "—"}</td>
                    <td
                      style={{
                        color:
                          item.status?.toUpperCase() === "APPROVED"
                            ? "#16a34a"
                            : "#dc2626",
                        fontWeight: 800,
                      }}
                    >
                      {item.status?.toUpperCase()}
                    </td>
                    <td>{item.approvedBy || "Admin"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Link href="/admin-dashboard/leave" className={styles.backBtn}>
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}