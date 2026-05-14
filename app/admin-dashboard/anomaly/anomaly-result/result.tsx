"use client";

import React, { useEffect, useState } from "react";
import styles from "./result.module.css";
import { useRouter } from "next/navigation";

export default function AnomalyResults() {
  const [anomalies, setAnomalies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch records where status is 'FLAGGED' or 'ANOMALY'
    fetch("http://localhost:2027/api/anomalies/list")
      .then(res => res.json())
      .then(data => setAnomalies(data.data || []));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Anomaly Detection Results</h2>
        <button onClick={() => router.back()} className={styles.backBtn}>Back</button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.resultTable}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Issue Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.map((item: any) => (
              <tr key={item.id}>
                <td>{item.employee.employeeId}</td>
                <td>{item.employee.name}</td>
                <td className={styles.issueText}>{item.anomalyReason}</td>
                <td>Rs. {item.netSalary}</td>
                <td><span className={styles.flag}>FLAGGED</span></td>
                <td>
                  <button className={styles.viewBtn}>Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}