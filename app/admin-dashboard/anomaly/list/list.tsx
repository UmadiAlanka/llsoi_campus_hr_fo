"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./list.module.css";

// Interface to match your Spring Boot Backend
interface Anomaly {
  id: number;
  employee?: { name: string };
  currentAmount: number;
  anomalyType: string;
  description: string;
  status: string;
}

export default function AnomalyList() {
  const router = useRouter();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const response = await fetch("http://localhost:2027/api/anomalies/all");
        const data = await response.json();
        // Handle both direct arrays and wrapped responses
        const dataArray = Array.isArray(data) ? data : data.data || [];
        setAnomalies(dataArray);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnomalies();
  }, []);

  return (
    <div className={styles.contentWrapper}>
      <h2 className={styles.pageTitle}>Anomaly Detection</h2>
      
      <div className={styles.tableContainer}>
        <table className={styles.anomalyTable}>
          <thead>
            <tr>
              <th style={{ width: "8%" }}>ID</th>
              <th style={{ width: "18%" }}>NAME</th>
              <th style={{ width: "14%" }}>SALARY</th>
              <th style={{ width: "15%" }}>TYPE</th>
              <th style={{ width: "23%" }}>ISSUE</th>
              <th style={{ width: "12%" }}>ACTION</th>
              <th style={{ width: "10%" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {!loading && anomalies.length > 0 ? (
              anomalies.map((item) => (
                <tr key={item.id}>
                  <td>{String(item.id).padStart(3, '0')}</td>
                  <td>{item.employee?.name || "N/A"}</td>
                  <td>{item.currentAmount?.toLocaleString()}</td>
                  <td>{item.anomalyType}</td>
                  <td className={styles.issueCell}>{item.description}</td>
                  <td>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => router.push(`/admin-dashboard/anomaly/view/${item.id}`)}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <span className={styles.statusText}>{item.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  {loading ? "Loading..." : "No anomalies detected."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          BACK
        </button>
      </div>
    </div>
  );
}