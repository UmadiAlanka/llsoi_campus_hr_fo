"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  {
    id: "1",
    employeeId: "001",
    name: "S.Perera",
    type: "Academic",
    startDate: "2025-10-15",
    endDate: "2025-10-20",
    reason: "Fever",
    status: "Pending",
  },
];

export default function AdminLeave() {

  const [requests, setRequests] = useState(initialData);

  const updateStatus = (
    id: string,
    status: "Approved" | "Rejected"
  ) => {

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status } : r
      )
    );
  };

  return (

    <div className={styles.leaveContainer}>

      <div className={styles.overlay}></div>

      <div className={styles.contentWrapper}>

        <h1 className={styles.pageTitle}>
          Leave Management
        </h1>

        {/* Leave History Card */}
        <Link
          href="/admin-dashboard/leave/history"
          className={styles.historyCard}
        >

          <div className={styles.historyIcon}>
            📄
          </div>

          <h3>
            View Leave History
          </h3>

        </Link>

        {/* Table Section */}
        <div className={styles.tableSection}>

          <h2 className={styles.sectionTitle}>
            Leave Requests
          </h2>

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

                {requests.map((req) => (

                  <tr key={req.id}>

                    <td>{req.employeeId}</td>

                    <td>{req.name}</td>

                    <td>
                      {req.startDate} to {req.endDate}
                    </td>

                    <td>{req.type}</td>

                    <td>{req.reason}</td>

                    <td>

                      {req.status === "Pending" ? (

                        <div className={styles.actionBtns}>

                          <button
                            className={styles.approveBtn}
                            onClick={() =>
                              updateStatus(req.id, "Approved")
                            }
                          >
                            Approve
                          </button>

                          <button
                            className={styles.rejectBtn}
                            onClick={() =>
                              updateStatus(req.id, "Rejected")
                            }
                          >
                            Reject
                          </button>

                        </div>

                      ) : (

                        <span
                          className={
                            req.status === "Approved"
                              ? styles.approvedText
                              : styles.rejectedText
                          }
                        >
                          {req.status}
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}