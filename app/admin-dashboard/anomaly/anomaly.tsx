"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./anomaly.module.css";
import MessageBox from "@/app/admin-dashboard/components/MessageBox";

export default function AnomalyDetection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Stats state initialized to 0
  const [anomalyStats, setAnomalyStats] = useState({ 
    totalAnomalies: 0, 
    resolvedAnomalies: 0 
  });
  
  const [msgConfig, setMsgConfig] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  // 1. Fetch Actual Counts from Database
  useEffect(() => {
    const fetchAnomalyData = async () => {
      try {
        const response = await fetch("http://localhost:2027/api/anomalies/stats");
        
        if (!response.ok) {
          console.error(`Backend returned status: ${response.status}`);
          return;
        }

        const result = await response.json();
        
        // Drilling into the 'data' object of your ApiResponse
        if (result && result.data) {
          setAnomalyStats({
            totalAnomalies: result.data.totalAnomalies ?? 0,
            resolvedAnomalies: result.data.resolvedAnomalies ?? 0,
          });
        } else {
          // Fallback if structure is flat
          setAnomalyStats({
            totalAnomalies: result.totalAnomalies ?? 0,
            resolvedAnomalies: result.resolvedAnomalies ?? 0,
          });
        }
      } catch (error) {
        console.error("Network error fetching stats:", error);
      }
    };
    fetchAnomalyData();
  }, []);

  // 2. Logic to Run Detection
  const handleDetectClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:2027/api/anomalies/detect", { 
        method: "POST" 
      });
      
      if (response.ok) {
        setMsgConfig({
          show: true,
          type: "success",
          message: "Scan complete! Redirecting to flagged records...",
        });

        // Delay to allow message to be seen
        setTimeout(() => {
          router.push("/admin-dashboard/anomaly/list");
        }, 1500);
      } else {
        throw new Error("Detection failed");
      }
    } catch (error) {
      setMsgConfig({
        show: true,
        type: "error",
        message: "Failed to run detection. Check backend logs.",
      });
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {msgConfig.show && (
        <MessageBox 
          type={msgConfig.type} 
          message={msgConfig.message} 
          onClose={() => setMsgConfig({ ...msgConfig, show: false })} 
        />
      )}

      <h2 className={styles.pageTitle}>Anomaly Detection</h2>

      <div className={styles.cardGrid}>
        {/* Total Anomalies Card */}
        <div 
          className={`${styles.card} ${styles.clickableCard}`} 
          onClick={() => router.push("/admin-dashboard/anomaly/list")}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardIconContainer}>
              <img src="/icons/total-anomaly.png" alt="Total" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h3 className={styles.cardTitle}>Total Anomalies</h3>
          </div>
          <p className={styles.cardValue}>{anomalyStats.totalAnomalies}</p>
        </div>

        {/* Resolved Card */}
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
        
        <button 
          className={styles.detectButton} 
          onClick={handleDetectClick}
          disabled={loading}
        >
          {loading ? "Scanning Records..." : "Detect Anomaly"}
        </button>
      </div>
    </div>
  );
}