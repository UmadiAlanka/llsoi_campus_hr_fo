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
  
  // State to hold the dynamic success message for the popup notification
  const [popupMessage, setPopupMessage] = useState<string>('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Matches your @GetMapping("/{id}") inside SalaryAnomalyController
        const response = await fetch(`http://localhost:2027/api/anomalies/${id}`);
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
    
    // Dynamically choose the accurate endpoint according to your Spring Boot Controller mappings
    const endpoint = newStatus === 'RESOLVED' ? 'resolve' : 'ignore';
    
    try {
      const response = await fetch(`http://localhost:2027/api/anomalies/${id}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // Maps directly to @RequestBody Map<String, Object> payload in backend
        // Basic Salary maps to previousAmount, Current Amount maps to currentAmount
        body: JSON.stringify({
          previousAmount: parseFloat(data?.salary?.basicSalary || 0),
          currentAmount: parseFloat(data?.currentAmount || 0)
        })
      });
      
      const result = await response.json();
      if (result.success) {
        if (newStatus === 'RESOLVED') {
          setPopupMessage('Anomaly Resolved Successfully!');
        } else if (newStatus === 'IGNORED') {
          setPopupMessage('Anomaly Ignored Successfully!');
        }

        setStatus('success');
        setData((prev: any) => ({ ...prev, status: 'RESOLVED' }));

        // Redirect back to the tracking board after 2 seconds
        setTimeout(() => {
          router.push('/hr_staff/anomaly/list');
        }, 2000);
      }
    } catch (error) {
      alert("Update failed!");
      setStatus('idle');
    }
  };

  const isActionDisabled = 
    status === 'loading' || 
    data?.status === 'RESOLVED' || 
    data?.status === 'IGNORED';

  //  Fixed syntax typo error completely here
  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      {/* Dynamic Success Notification Popup Overlay */}
      {status === 'success' && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>{popupMessage}</p>
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

            {/* Editable Basic Salary Field (Tied to salary.basicSalary structure) */}
            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Basic Salary (Rs):</label>
              <input 
                type="number" 
                value={data?.salary?.basicSalary ?? "0"} 
                className={styles.whiteInput} 
                onChange={(e) => setData((prev: any) => ({
                  ...prev,
                  salary: { ...prev.salary, basicSalary: e.target.value }
                }))}
                disabled={data?.status === 'RESOLVED' || data?.status === 'IGNORED'} 
              />
            </div>

            {/* Editable Current Amount Field (Tied to currentAmount structure) */}
            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Current Amount (Rs):</label>
              <input 
                type="number" 
                value={data?.currentAmount ?? "0"} 
                className={styles.whiteInput} 
                onChange={(e) => setData((prev: any) => ({ ...prev, currentAmount: e.target.value }))}
                disabled={data?.status === 'RESOLVED' || data?.status === 'IGNORED'} 
              />
            </div>
          </div>
        </div>

        {/* Display informational banner if the anomaly has already been processed */}
        {(data?.status === 'RESOLVED' || data?.status === 'IGNORED') && (
          <div style={{ textAlign: 'center', marginBottom: '15px', fontWeight: 'bold', color: '#2e7d32' }}>
            This anomaly has already been resolved.
          </div>
        )}

        <div className={styles.actionWrapper}>
          <button 
            className={styles.resolvedBtn} 
            onClick={() => handleUpdateStatus('RESOLVED')}
            disabled={isActionDisabled}
          >
            {status === 'loading' ? 'Processing...' : 'RESOLVE ANOMALY'}
          </button>
          <button 
            className={styles.ignoreBtn} 
            onClick={() => handleUpdateStatus('IGNORED')}
            disabled={isActionDisabled}
          >
            IGNORE
          </button>
        </div>
      </div>

      <div className={styles.backButtonContainer}>
        <button 
          type="button" 
          className={styles.backBtn} 
          onClick={() => router.push('/hr_staff/anomaly/list')}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ResolveAnomaly;