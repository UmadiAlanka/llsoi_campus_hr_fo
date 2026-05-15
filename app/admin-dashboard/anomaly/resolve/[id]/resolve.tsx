"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./resolve.module.css";

export default function ResolveAnomaly() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    type: "",
    date: "",
    basicSalary: "",
    netSalary: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:2027/api/anomalies/${id}`);

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const result = await response.json();

        // Handle ApiResponse wrapper: { success, data: { ... } }
        const data = result.success ? result.data : result;

        if (!data) {
          throw new Error("No data returned from server.");
        }

        setFormData({
          name:        data.employee?.name || "N/A",
          employeeId:  data.employee?.id?.toString().padStart(3, "0") ||
                       data.employee?.employeeId?.toString().padStart(3, "0") || "000",
          type:        data.anomalyType || "N/A",
          date:        data.detectedDate || "",
          basicSalary: data.previousAmount?.toString() || "0",
          netSalary:   data.currentAmount?.toString()  || "0",
        });
      } catch (err: any) {
        console.error("Error fetching anomaly details:", err);
        setError(err.message || "Failed to load anomaly data.");
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
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:2027/api/anomalies/${id}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousAmount: parseFloat(formData.basicSalary),
          currentAmount:  parseFloat(formData.netSalary),
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        router.push("/admin-dashboard/anomaly/list");
      } else {
        throw new Error(result.message || "Failed to resolve anomaly.");
      }
    } catch (err: any) {
      console.error("Resolve error:", err);
      setError(err.message || "An error occurred while resolving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.formCard}>
          <p style={{ textAlign: "center", color: "#666" }}>Loading anomaly details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.formCard}>
          <p style={{ textAlign: "center", color: "#dc2626", marginBottom: "16px" }}>
            {error}
          </p>
          <button
            className={styles.ignoreBtn}
            onClick={() => router.push("/admin-dashboard/anomaly/list")}
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Resolve Anomaly</h2>

        <div className={styles.formGrid}>
          {/* Name — full width */}
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              readOnly
              className={styles.readOnlyInput}
            />
          </div>

          {/* Employee ID */}
          <div className={styles.inputGroup}>
            <label>Employee ID</label>
            <input
              type="text"
              value={formData.employeeId}
              readOnly
              className={styles.readOnlyInput}
            />
          </div>

          {/* Anomaly type */}
          <div className={styles.inputGroup}>
            <label>Anomaly Type</label>
            <input
              type="text"
              value={formData.type.replace(/_/g, " ")}
              readOnly
              className={styles.readOnlyInput}
            />
          </div>

          {/* Date — full width */}
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Detected Date</label>
            <input
              type="text"
              value={formData.date}
              readOnly
              className={styles.readOnlyInput}
            />
          </div>

          {/* Editable: Previous salary */}
          <div className={styles.inputGroup}>
            <label>Previous Salary (Editable)</label>
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              className={styles.editableInput}
            />
          </div>

          {/* Editable: Current salary */}
          <div className={styles.inputGroup}>
            <label>Current Salary (Editable)</label>
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
          <button
            className={styles.resolveBtn}
            onClick={handleResolve}
            disabled={saving}
          >
            {saving ? "Saving..." : "MARK AS RESOLVED"}
          </button>
          <button
            className={styles.ignoreBtn}
            onClick={() => router.back()}
            disabled={saving}
          >
            IGNORE
          </button>
        </div>
      </div>
    </div>
  );
}