"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./leave.module.css";
import MessageBox from "../components/MessageBox";

interface Employee {
  id: number;
  name: string;
  employeeId: string;
}

interface LeaveRequest {
  id: number;
  employee: Employee;
  startDate: string;
  endDate: string;
  leave_type: string;
  reason: string;
  status: string;
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

export default function AdminLeave() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error" | "confirm";
    msg: string;
    confirmLabel?: string;
    onConfirm?: () => void;
  }>({ show: false, type: "success", msg: "" });

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/leaves/all`, { cache: "no-store" });
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setRequests(result.data);
      } else {
        setModal({ show: true, type: "error", msg: "Failed to load leave requests." });
      }
    } catch {
      setModal({ show: true, type: "error", msg: "Could not connect to server on port 2027." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const confirmAction = (id: number, action: "approve" | "reject") => {
    setModal({
      show: true,
      type: "confirm",
      msg: `Are you sure you want to ${action} this leave request?`,
      confirmLabel: action === "approve" ? "Yes, Approve" : "Yes, Reject",
      onConfirm: () => executeAction(id, action),
    });
  };

  const executeAction = async (id: number, action: "approve" | "reject") => {
    try {
      const res = await fetch(`${BASE}/leaves/${id}/${action}`, { method: "PUT" });
      const result = await res.json();

      if (result.success) {
        const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        setModal({
          show: true,
          type: "success",
          msg: `Leave ${action === "approve" ? "approved" : "rejected"} successfully!`,
        });
      } else {
        setModal({ show: true, type: "error", msg: result.message || "Operation failed." });
      }
    } catch {
      setModal({ show: true, type: "error", msg: "Server connection error." });
    }
  };

  return (
    <div className={styles.leaveContainer}>
      {modal.show && (
        <MessageBox
          type={modal.type}
          message={modal.msg}
          confirmLabel={modal.confirmLabel}
          onClose={() => setModal({ ...modal, show: false })}
          onConfirm={modal.onConfirm}
        />
      )}

      <div className={styles.contentWrapper}>
        <h1 className={styles.pageTitle}>Leave Management</h1>

        {/* Leave History Card */}
        <Link href="/admin-dashboard/leave/history" className={styles.historyCard}>
          <div className={styles.historyIcon}>📄</div>
          <h3>View Leave History</h3>
        </Link>

        {/* Table Section */}
        <div className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>Leave Requests</h2>

          <div className={styles.tableCard}>
            <table className={styles.leaveTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Leave Dates</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                      Loading…
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                      No leave requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => {
                    const status = req.status?.toUpperCase();
                    return (
                      <tr key={req.id}>
                        <td>{req.employee?.employeeId || req.employee?.id || "—"}</td>
                        <td>{req.employee?.name || "—"}</td>
                        <td>
                          {formatDate(req.startDate)} to {formatDate(req.endDate)}
                        </td>
                        <td>{req.leave_type || "—"}</td>
                        <td>{req.reason || "—"}</td>
                        <td>
                          {status === "PENDING" ? (
                            <div className={styles.actionBtns}>
                              <button
                                className={styles.approveBtn}
                                onClick={() => confirmAction(req.id, "approve")}
                              >
                                Approve
                              </button>
                              <button
                                className={styles.rejectBtn}
                                onClick={() => confirmAction(req.id, "reject")}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span
                              className={
                                status === "APPROVED"
                                  ? styles.approvedText
                                  : styles.rejectedText
                              }
                            >
                              {status === "APPROVED" ? "Approved" : "Rejected"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}