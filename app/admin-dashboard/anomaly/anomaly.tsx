"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./anomaly.module.css";
import MessageBox from "@/app/admin-dashboard/components/MessageBox";

interface MessageConfig {
  show: boolean;
  type: "success" | "error";
  message: string;
}

export default function AnomalyDetection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [anomalyStats, setAnomalyStats] = useState({ totalAnomalies: 0, resolvedAnomalies: 0 });

  const [msgConfig, setMsgConfig] = useState<MessageConfig>({ 
    show: false, 
    type: "success", 
    message: "" 
  });

  const fetchAnomalyData = async () => {
    try {
      const response = await fetch("http://localhost:2027/api/anomalies/stats");
      if (!response.ok) return;
      const data = await response.json();

      // Spring Boot returns a Map or Object, mapping it here
      setAnomalyStats({
        totalAnomalies: data.total || 0,
        resolvedAnomalies: data.resolved || 0,
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchAnomalyData();
  }, []);

  const handleDetectClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:2027/api/anomalies/detect", { method: "POST" });
      if (response.ok) {
        setMsgConfig({ 
          show: true, 
          type: "success", 
          message: "Scan complete! Updating counts..." 
        });
        await fetchAnomalyData();
        // Redirecting to the list so user can see the new anomalies
        setTimeout(() => router.push("/admin-dashboard/anomaly/list"), 1500);
      } else {
        throw new Error();
      }
    } catch (error) {
      setMsgConfig({ 
        show: true, 
        type: "error", 
        message: "Detection failed. Check server connection." 
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

      <h2 className={styles.pageTitle}>Anomaly Detection Dashboard</h2>

      <div className={styles.cardGrid}>
        <div 
          className={`${styles.card} ${styles.clickableCard}`} 
          onClick={() => router.push("/admin-dashboard/anomaly/list")}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardIconContainer}>
              <img src="/icons/total-anomaly.png" alt="Total" style={{ width: '100%' }} />
            </div>
            <h3 className={styles.cardTitle}>Total Anomalies</h3>
          </div>
          <p className={styles.cardValue}>{anomalyStats.totalAnomalies}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconContainer}>
              <img src="/icons/resolved-anomaly.png" alt="Resolved" style={{ width: '100%' }} />
            </div>
            <h3 className={styles.cardTitle}>Resolved</h3>
          </div>
          <p className={styles.cardValue}>{anomalyStats.resolvedAnomalies}</p>
        </div>
      </div>

      <div className={styles.rulesContainer}>
        <h3 className={styles.rulesHeader}>Rules Engine</h3>
        <p>Trigger a manual scan of the current month's payroll against historical data.</p>
        <button className={styles.detectButton} onClick={handleDetectClick} disabled={loading}>
          {loading ? "Scanning Database..." : "Run Detection"}
        </button>
      </div>
    </div>
  );
}