"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './anomaly_list.module.css';

interface Anomaly {
  id: number; // Anomaly Record ID 
  employee: {
    id: string; // 
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
          
          // 1. Pending ඒවා table එකේ උඩටම එන විදිහට දත්ත Sort කර ගැනීම
          const sortedData = result.data.sort((a: Anomaly, b: Anomaly) => {
            if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
            if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
            return 0;
          });

          setAnomalies(sortedData);
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
              <th>Employee ID</th> 
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
                  
                  <td>{item.employee.id || "N/A"}</td>
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
                    {item.status === 'RESOLVED' && (
                      <span className={styles.statusText}>Resolved</span>
                    )}
                    {item.status === 'IGNORED' && (
                      <span className={styles.ignoredText}>Ignored</span>
                    )}
                    {item.status === 'PENDING' && (
                      <span className={styles.pendingText}>Pending</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <div className={styles.backButtonContainer}>
        <button 
          type="button" 
          className={styles.backBtn} 
          onClick={() => router.push('/hr_staff/anomaly')}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AnomalyList;