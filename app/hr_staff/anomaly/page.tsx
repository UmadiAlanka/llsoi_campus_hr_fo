"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './anomaly.module.css';
import { AlertCircle, CheckCircle2, Loader2, Calendar } from 'lucide-react';

const AnomalyDetection = () => {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // වර්තමාන වර්ෂය සහ මාසය ලබාගෙන Default අගය "YYYY-MM" ආකෘතියට සකසා ගැනීම
  const getCurrentMonthFormat = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthFormat());
  
  // Input එක programmatically open කිරීමට useRef එකක් භාවිතා කරමු
  const monthInputRef = useRef<HTMLInputElement>(null);

  // Icon එක හෝ text එක ක්ලික් කළ විට calendar එක open වීමට
  const handleCalendarClick = () => {
    if (monthInputRef.current) {
      // Browser එකේ native picker එක පෙන්වීම සඳහා (showPicker method එක සහාය දක්වයි නම්)
      if (typeof monthInputRef.current.showPicker === 'function') {
        monthInputRef.current.showPicker();
      } else {
        monthInputRef.current.click();
      }
    }
  };

  const fetchAnomalyStats = async (month: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:2027/api/anomaly/stats?month=${month}`);
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
    if (selectedMonth) {
      fetchAnomalyStats(selectedMonth);
    }
  }, [selectedMonth]);

  const handleDetect = async () => {
    setDetecting(true);
    try {
      const response = await fetch(`http://localhost:2027/api/anomaly/detect?month=${selectedMonth}`, {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        setShowSuccess(true);
        fetchAnomalyStats(selectedMonth);
        
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

  // පෙන්වීමට අවශ්‍ය මාසයේ නම වඩාත් පැහැදිලිව සකසා ගැනීම (உதா: "May 2026")
  const formatDisplayMonth = (yearMonth: string) => {
    if (!yearMonth) return "";
    const [year, month] = yearMonth.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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

      {/* 📅 Clickable Calendar Component එක */}
      <div className={styles.filterContainer}>
        <div className={styles.calendarPickerWrapper} onClick={handleCalendarClick}>
          <Calendar className={styles.calendarIcon} size={22} />
          <span className={styles.selectedMonthText}>
            {formatDisplayMonth(selectedMonth)}
          </span>
          
          {/* නොපෙනෙන සේ සඟවා ඇති (Hidden) Month Input එක */}
          <input 
            type="month" 
            ref={monthInputRef}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className={styles.hiddenMonthInput}
          />
        </div>
      </div>

      <div className={styles.topCards}>
        {/* Total Anomalies */}
        <div 
          className={`${styles.card} ${styles.clickable}`} 
          onClick={() => router.push(`/hr_staff/anomaly/list?month=${selectedMonth}`)}
        >
          <div className={styles.cardHeader}>
            <AlertCircle size={40} className={styles.anomalyIcon} />
            <span className={styles.cardLabel}>Total Anomalies</span>
          </div>
          <div className={styles.cardValue}>{loading ? "..." : stats.total}</div>
        </div>

        {/* Resolved Card */}
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
          <li><span className={styles.checkIcon}>✓</span> RS.10000 Sudden Change Rule</li>
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