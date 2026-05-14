"use client";

import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import styles from "./anomaly.module.css";

export default function AnomalyDetection() {
  const [anomalyStats, setAnomalyStats] = useState({ totalAnomalies: 0, resolvedAnomalies: 0 });
=======
import { useRouter } from "next/navigation";
import styles from "./anomaly.module.css";
import MessageBox from "@/app/admin-dashboard/components/MessageBox";

export default function AnomalyDetection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [anomalyStats, setAnomalyStats] = useState({ totalAnomalies: 0, resolvedAnomalies: 0 });
  
  // MessageBox State
  const [msgConfig, setMsgConfig] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9

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

<<<<<<< HEAD
  return (
    <>
      <h2 className={styles.pageTitle}>Anomaly Detection</h2>

      <div className={styles.cardGrid}>
        <div className={styles.card}>
=======
  // 1. Logic to Run Detection and Navigate
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

        // Small delay so they can see the success message
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
        message: "Failed to run detection. Please check backend.",
      });
      setLoading(false);
    }
  };

  const handleViewAnomalies = () => {
    router.push("/admin-dashboard/anomaly/list");
  };

  return (
    <div className={styles.container}>
      {/* MessageBox for Feedback */}
      {msgConfig.show && (
        <MessageBox 
          type={msgConfig.type} 
          message={msgConfig.message} 
          onClose={() => setMsgConfig({ ...msgConfig, show: false })} 
        />
      )}

      <h2 className={styles.pageTitle}>Anomaly Detection</h2>

      <div className={styles.cardGrid}>
        <div 
          className={`${styles.card} ${styles.clickableCard}`} 
          onClick={handleViewAnomalies}
          title="Click to view all anomalies"
        >
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
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
<<<<<<< HEAD
        <button className={styles.detectButton}>Detect Anomaly</button>
      </div>
    </>
=======
        
        {/* Updated Button with Loading State */}
        <button 
          className={styles.detectButton} 
          onClick={handleDetectClick}
          disabled={loading}
        >
          {loading ? "Scanning Records..." : "Detect Anomaly"}
        </button>
      </div>
    </div>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
  );
}