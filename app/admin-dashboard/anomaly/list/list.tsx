"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./list.module.css";

export default function AnomalyList() {
  const router = useRouter();
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const res = await fetch("http://localhost:2027/api/anomalies/all");
        if (res.ok) {
          const data = await res.json();
          setAnomalies(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnomalies();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.tableTitle}>Anomaly List</h2>

      <div className={styles.tableContainer}>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Type</th>
              <th>Issue</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className={styles.emptyRow}>
                <td colSpan={7}>Loading...</td>
              </tr>
            ) : anomalies.length > 0 ? (
              anomalies.map((item: any) => (
                <tr key={item.id}>
                  <td>
                    {item.employee?.id?.toString().padStart(3, "0") ||
                      item.employee?.employeeId?.toString().padStart(3, "0") ||
                      "N/A"}
                  </td>
                  <td>{item.employee?.name || "N/A"}</td>
                  <td>
                    {item.netSalary != null
                      ? Number(item.netSalary).toLocaleString()
                      : item.currentAmount != null
                      ? Number(item.currentAmount).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{item.anomalyType || item.type || "N/A"}</td>
                  <td className={styles.issueText}>
                    {item.anomalyReason || item.issue || "—"}
                  </td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() =>
                        router.push(
                          `/admin-dashboard/anomaly/resolve/${item.id}`
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                  <td>
                    {item.status === "RESOLVED" ? (
                      <span className={styles.resolvedBadge}>RESOLVED</span>
                    ) : (
                      <span className={styles.pendingBadge}>PENDING</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className={styles.emptyRow}>
                <td colSpan={7}>No anomalies found.</td>
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