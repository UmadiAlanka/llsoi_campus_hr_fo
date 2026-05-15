"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./resolve.module.css";

export default function ResolveAnomaly() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    type: "",
    date: "",
    basicSalary: "", // This will be editable
    netSalary: ""    // This will be editable
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:2027/api/anomalies/${id}`);
        if (!response.ok) throw new Error("Data not found");
        const data = await response.json();

        if (data) {
          setFormData({
            name: data.employee?.name || "N/A",
            employeeId: data.employee?.id?.toString().padStart(3, '0') || "000",
            type: data.anomalyType || "N/A",
            date: data.detectedDate || "",
            basicSalary: data.previousAmount?.toString() || "0",
            netSalary: data.currentAmount?.toString() || "0"
          });
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResolve = async () => {
    try {
      const res = await fetch(`http://localhost:2027/api/anomalies/${id}/resolve`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousAmount: parseFloat(formData.basicSalary),
          currentAmount: parseFloat(formData.netSalary)
        })
      });
      if (res.ok) {
        router.push("/admin-dashboard/anomaly/list");
      }
    } catch (err) {
      console.error("Resolve error:", err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Resolve Anomaly</h2>
        <div className={styles.formGrid}>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Name</label>
            <input type="text" value={formData.name} readOnly className={styles.readOnlyInput} />
          </div>
          <div className={styles.inputGroup}>
            <label>Employee ID</label>
            <input type="text" value={formData.employeeId} readOnly className={styles.readOnlyInput} />
          </div>
          <div className={styles.inputGroup}>
            <label>Select Type</label>
            <input type="text" value={formData.type.replace("_", " ")} readOnly className={styles.readOnlyInput} />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Date</label>
            <input type="text" value={formData.date} readOnly className={styles.readOnlyInput} />
          </div>

          {/* EDITABLE FIELDS */}
          <div className={styles.inputGroup}>
            <label>Basic Salary (Editable)</label>
            <input 
              type="number" 
              name="basicSalary"
              value={formData.basicSalary} 
              onChange={handleChange} 
              className={styles.editableInput} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Net Salary (Editable)</label>
            <input 
              type="number" 
              name="netSalary"
              value={formData.netSalary} 
              onChange={handleChange} 
              className={styles.editableInput} 
            />
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.resolveBtn} onClick={handleResolve}>RESOLVED</button>
          <button className={styles.ignoreBtn} onClick={() => router.back()}>IGNORE</button>
        </div>
      </div>
    </div>
  );
}