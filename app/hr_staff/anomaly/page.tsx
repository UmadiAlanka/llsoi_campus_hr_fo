"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './anomaly.module.css';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const AnomalyDetection = () => {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchAnomalyStats = async () => {
    try {
      const response = await fetch('http://localhost:2027/api/anomaly/stats');
      const result = await response.json();
      if (result.success) {
        setStats({
          total: result.data.totalAnomalies,
          resolved: result.data.resolvedAnomalies
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalyStats();
  }, []);

  const handleDetect = async () => {
    setDetecting(true);
    try {
      const response = await fetch('http://localhost:2027/api/anomaly/detect', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        setShowSuccess(true);
        fetchAnomalyStats();
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        alert("Detection failed: " + result.message);
      }
    } catch (error) {
      console.error("Detection Error:", error);
      alert("Backend connection failed.");
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Success Popup Message */}
      {showSuccess && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Anomaly detection completed successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.title}>Anomaly Detection</h1>

      <div className={styles.topCards}>
        {/* Total Anomalies - මෙය ලැයිස්තුවට යයි */}
        <div 
          className={`${styles.card} ${styles.clickable}`} 
          onClick={() => router.push('/hr_staff/anomaly/list')}
        >
          <div className={styles.cardHeader}>
            <AlertCircle size={40} className={styles.anomalyIcon} />
            <span className={styles.cardLabel}>Total Anomalies</span>
          </div>
          <div className={styles.cardValue}>{loading ? "..." : stats.total}</div>
        </div>

        {/* Resolved Card - මෙය දැන් Clickable නොවේ, අගය පමණක් පෙන්වයි */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <CheckCircle2 size={40} className={styles.resolvedIcon} />
            <span className={styles.cardLabel}>Resolved</span>
          </div>
          <div className={styles.cardValue}>{loading ? "..." : stats.resolved}</div>
        </div>
      </div>

      <div className={styles.ruleSection}>
        <h2 className={styles.ruleTitle}>Currently Rule Being Used</h2>
        <ul className={styles.ruleList}>
          <li><span className={styles.checkIcon}>✓</span> Salary Range Rule</li>
          <li><span className={styles.checkIcon}>✓</span> Rs.300 Sudden Change Rule</li>
        </ul>
        
        <button 
          className={styles.detectButton} 
          onClick={handleDetect}
          disabled={detecting}
        >
          {detecting ? (
            <><Loader2 className={styles.spinner} size={20} /> Processing...</>
          ) : (
            "Detect Anomaly"
          )}
        </button>
      </div>
    </div>
  );
};

export default AnomalyDetection;