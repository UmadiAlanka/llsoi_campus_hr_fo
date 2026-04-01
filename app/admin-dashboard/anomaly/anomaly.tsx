"use client";

import React, { useEffect, useState } from "react";
import styles from "./anomaly.module.css";

export default function AnomalyDetection() {
  const [anomalyStats, setAnomalyStats] = useState({ totalAnomalies: 0, resolvedAnomalies: 0 });

  useEffect(() => {
    const fetchAnomalyData = async () => {
      try {
        const response = await fetch("http://localhost:2027/api/anomalies/stats");
        const result = await response.json();
        if (result?.data) {
          setAnomalyStats({
            totalAnomalies: result.data.totalAnomalies || 0,
            resolvedAnomalies: result.data.resolvedAnomalies || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching anomaly data:", error);
      }
    };
    fetchAnomalyData();
  }, []);

  return (
    <>
      <h2 className={styles.pageTitle}>Anomaly Detection</h2>

      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconContainer}>
              <img src="/icons/total-anomaly.png" alt="Total" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h3 className={styles.cardTitle}>Total Anomalies</h3>
          </div>
          <p className={styles.cardValue}>{anomalyStats.totalAnomalies}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconContainer}>
              <img src="/icons/resolved-anomaly.png" alt="Resolved" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h3 className={styles.cardTitle}>Resolved</h3>
          </div>
          <p className={styles.cardValue}>{anomalyStats.resolvedAnomalies}</p>
        </div>
      </div>

      <div className={styles.rulesContainer}>
        <h3 className={styles.rulesHeader}>Currently Rules Being Used</h3>
        <ul className={styles.rulesList}>
          <li><span className={styles.checkIcon}>✔</span> Salary Range Rule</li>
          <li><span className={styles.checkIcon}>✔</span> Rs.300 Sudden Change Rule</li>
          <li><span className={styles.checkIcon}>✔</span> Missing Attendance Rule</li>
        </ul>
        <button className={styles.detectButton}>Detect Anomaly</button>
      </div>
    </>
  );
}