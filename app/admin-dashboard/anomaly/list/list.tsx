"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./list.module.css";

export default function AnomalyList() {
  const router = useRouter();
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const res = await fetch("http://localhost:2027/api/anomalies/all");

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        // Handle both wrapped { success, data: [...] } and raw [...] responses
        if (Array.isArray(data)) {
          setAnomalies(data);
        } else if (data.success && Array.isArray(data.data)) {
          setAnomalies(data.data);
        } else if (!data.success) {
          setError(data.message || "Failed to load anomalies.");
          setAnomalies([]);
        } else {
          setAnomalies([]);
        }
      } catch (err: any) {
        console.error("Fetch failed", err);
        setError("Could not connect to the server. Make sure the backend is running on port 2027.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalies();
  }, []);

  const getNetSalary = (item: any): string => {
    const val = item.netSalary ?? item.currentAmount ?? item.salary?.netSalary;
    return val != null ? Number(val).toLocaleString() : "N/A";
  };

  const getEmployeeId = (item: any): string => {
    return (
      item.employee?.id?.toString().padStart(3, "0") ||
      item.employee?.employeeId?.toString().padStart(3, "0") ||
      "N/A"
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.tableTitle}>Anomaly List</h2>

      {error && (
        <div style={{
          background: "rgba(220,38,38,0.15)",
          border: "1px solid rgba(220,38,38,0.4)",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "0.9rem"
        }}>
          {error}
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Type</th>
              <th>Issue</th>
              <th>Severity</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                  Loading anomalies...
                </td>
              </tr>
            ) : anomalies.length > 0 ? (
              anomalies.map((item: any) => (
                <tr key={item.id}>
                  <td>{getEmployeeId(item)}</td>
                  <td>{item.employee?.name || "N/A"}</td>
                  <td>Rs. {getNetSalary(item)}</td>
                  <td>{item.anomalyType || item.type || "N/A"}</td>
                  <td className={styles.issueText}>
                    {item.anomalyReason || item.description || item.issue || "—"}
                  </td>
                  <td>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      background:
                        item.severity === "CRITICAL" ? "#fee2e2" :
                        item.severity === "HIGH"     ? "#fef3c7" :
                        item.severity === "MEDIUM"   ? "#fff3e0" :
                                                       "#e8f5e9",
                      color:
                        item.severity === "CRITICAL" ? "#b91c1c" :
                        item.severity === "HIGH"     ? "#92400e" :
                        item.severity === "MEDIUM"   ? "#c2410c" :
                                                       "#166534",
                    }}>
                      {item.severity || "LOW"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() =>
                        router.push(`/admin-dashboard/anomaly/resolve/${item.id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                  <td>
                    {item.status === "RESOLVED" ? (
                      <span className={styles.resolvedBadge}>RESOLVED</span>
                    ) : (
                      <span className={styles.statusBadge}>PENDING</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                  No anomalies found. Click &quot;Run Detection&quot; to scan for anomalies.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className={styles.backBtn} onClick={() => router.back()}>
        Back
      </button>
    </div>
  );
}