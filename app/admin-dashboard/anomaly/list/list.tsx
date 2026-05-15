"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnomalyList() {
  const router = useRouter();
  // CRITICAL: Initialize as an empty array [] to prevent .map() errors
  const [anomalies, setAnomalies] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const res = await fetch("http://localhost:2027/api/anomalies/all");
        if (res.ok) {
          const data = await res.json();
          // Ensure we only set the state if data is an array
          setAnomalies(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchAnomalies();
  }, []);

  return (
    <table>
      <thead>{/* Headers here */}</thead>
      <tbody>
        {anomalies.length > 0 ? (
          anomalies.map((item) => (
            <tr key={item.id}>
              <td>{item.employee?.id?.toString().padStart(3, '0')}</td>
              <td>{item.employee?.name}</td>
              <td>{item.anomalyType}</td>
              <td>
                <button onClick={() => router.push(`/admin-dashboard/anomaly/resolve/${item.id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan={5}>No anomalies found.</td></tr>
        )}
      </tbody>
    </table>
  );
}