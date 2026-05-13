"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './anomaly_list.module.css';

interface Anomaly {
  id: number;
  employee: {
    name: string;
    jobType: string;
  };
  currentAmount: number;
  anomalyType: string;
  description: string;
  status: string;
}

const AnomalyList = () => {
  const router = useRouter();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const response = await fetch('http://localhost:2027/api/anomaly/list');
        const result = await response.json();
        if (result.success) {
          setAnomalies(result.data);
        }
      } catch (error) {
        console.error("Error fetching anomaly list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalies();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Anomaly List</h1>

      <section className={styles.sectionCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Salary (Rs)</th>
              <th>Type</th>
              <th>Issue</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className={styles.loadingCell}>Loading data...</td></tr>
            ) : anomalies.length === 0 ? (
              <tr><td colSpan={7} className={styles.noDataCell}>No anomalies detected yet.</td></tr>
            ) : (
              anomalies.map((item) => (
                <tr key={item.id} className={styles.tableRow}>
                  <td>{String(item.id).padStart(3, '0')}</td>
                  <td>{item.employee.name}</td>
                  <td>{item.currentAmount.toLocaleString()}</td>
                  <td>{item.employee.jobType}</td>
                  <td className={styles.issueText}>{item.description}</td>
                  <td>
                    <button 
                      className={styles.editBtn}
                      onClick={() => router.push(`/hr_staff/anomaly/resolve/${item.id}`)}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    {item.status === 'RESOLVED' ? (
                      <span className={styles.statusText}>Resolved</span>
                    ) : (
                      <span className={styles.pendingText}>Pending</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <button className={styles.backBtn} onClick={() => router.back()}>
        Back
      </button>
    </div>
  );
};

export default AnomalyList;