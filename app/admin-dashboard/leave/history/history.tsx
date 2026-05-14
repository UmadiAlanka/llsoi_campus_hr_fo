"use client";

import React from "react";
import Link from "next/link";
import styles from "./history.module.css";

const historyData = [
  {
    id: "001",
    name: "S.Perera",
    leaveDates: "2025-10-15 to 2025-10-20",
    type: "Academic",
    status: "APPROVED",
    approvedBy: "Admin",
  },
];

export default function LeaveHistory() {

  return (

    <div className={styles.historyContainer}>

      <div className={styles.overlay}></div>

      <div className={styles.contentWrapper}>

        <h1 className={styles.pageTitle}>
          Leave History
        </h1>

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

              {historyData.map((item) => (

                <tr key={item.id}>

                  <td>{item.id}</td>

                  <td>{item.name}</td>

                  <td>{item.leaveDates}</td>

                  <td>{item.type}</td>

                  <td>{item.status}</td>

                  <td>{item.approvedBy}</td>

                </tr>

              ))}

            </tbody>

          </table>

          <Link
            href="/admin-dashboard/leave"
            className={styles.backBtn}
          >
            Back
          </Link>

        </div>

      </div>

    </div>
  );
}