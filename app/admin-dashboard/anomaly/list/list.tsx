"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./list.module.css";

// Interface to define the structure of your data and remove red lines
interface Anomaly {
  id: number;
  employee: {
    name: string;
  };
  currentAmount: number;
  anomalyType: string;
  description: string;
  status: string;
}

export default function AnomalyList() {
  const router = useRouter();
  // Initialize as an empty array to prevent .map() from failing on first render
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const response = await fetch("http://localhost:2027/api/anomalies/all");
        const result = await response.json();
        
        // Safety check: Spring Boot often returns a list directly, 
        // but if you have a wrapper, result.data will be used.
        if (Array.isArray(result)) {
          setAnomalies(result);
        } else if (result && Array.isArray(result.data)) {
          setAnomalies(result.data);
        } else {
          console.error("Data received is not an array:", result);
          setAnomalies([]); 
        }
      } catch (error) {
        console.error("Error fetching anomalies:", error);
        setAnomalies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnomalies();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.tableCard}>
        <div className={styles.header}>
          <h2>Anomaly List</h2>
        </div>
        
        <table className={styles.anomalyTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Salary (Rs.)</th>
              <th>Type</th>
              <th>Issue</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && anomalies.length > 0 ? (
              anomalies.map((anomaly) => (
                <tr key={anomaly.id}>
                  <td>{String(anomaly.id).padStart(3, '0')}</td>
                  <td>{anomaly.employee?.name || "Unknown"}</td>
                  <td>{anomaly.currentAmount?.toLocaleString()}</td>
                  <td>{anomaly.anomalyType}</td>
                  <td className={styles.issueText}>{anomaly.description}</td>
                  <td>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => router.push(`/admin-dashboard/anomaly/view/${anomaly.id}`)}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <span className={styles[anomaly.status?.toLowerCase() as keyof typeof styles] || ""}>
                      {anomaly.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                  {loading ? "Loading anomalies..." : "No anomalies found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.footer}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}