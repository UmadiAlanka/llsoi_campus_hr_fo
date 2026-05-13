"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './resolve.module.css';

const ResolveAnomaly = () => {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:2027/api/anomaly/${id}`);
        const result = await response.json();
        if (result.success) setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    setStatus('loading');
    try {
      const response = await fetch(`http://localhost:2027/api/anomaly/review/${id}?status=${newStatus}&notes=Verified&reviewedBy=HRStaff`, {
        method: 'PUT'
      });
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setTimeout(() => {
          router.push('/hr_staff/anomaly/list');
        }, 2000);
      }
    } catch (error) {
      alert("Update failed!");
      setStatus('idle');
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      {status === 'success' && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Anomaly Resolved Successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.title}>Anomaly Management</h1>
      <h2 className={styles.subtitle}>Resolve Detected Anomaly</h2>

      <div className={styles.formCard}>
        <div className={styles.formGrid}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Employee Information</h3>
            
            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Name:</label>
              <input type="text" value={data?.employee?.name || ""} className={styles.whiteInput} readOnly />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Employee ID:</label>
              <input type="text" value={data?.employee?.id || ""} className={styles.whiteInput} readOnly />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Anomaly Type:</label>
              <input type="text" value={data?.anomalyType || ""} className={styles.whiteInput} readOnly />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Financial Details</h3>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Detected Date:</label>
              <input type="text" value={data?.detectedDate || ""} className={styles.whiteInput} readOnly />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Basic Salary (Rs):</label>
              <input type="text" value={data?.salary?.basicSalary || "0"} className={styles.whiteInput} readOnly />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Current Amount (Rs):</label>
              <input type="text" value={data?.currentAmount || "0"} className={styles.whiteInput} readOnly />
            </div>
          </div>
        </div>

        <div className={styles.actionWrapper}>
          <button 
            className={styles.resolvedBtn} 
            onClick={() => handleUpdateStatus('RESOLVED')}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Processing...' : 'RESOLVE ANOMALY'}
          </button>
          <button 
            className={styles.ignoreBtn} 
            onClick={() => handleUpdateStatus('IGNORED')}
            disabled={status === 'loading'}
          >
            IGNORE
          </button>
        </div>
      </div>

      <button className={styles.backBtn} onClick={() => router.push('/hr_staff/anomaly/list')}>
        Back
      </button>
    </div>
  );
};

export default ResolveAnomaly;