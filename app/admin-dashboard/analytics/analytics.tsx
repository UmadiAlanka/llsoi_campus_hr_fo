"use client";

import React from "react";
import styles from "./analytics.module.css";

const reports = [
  "Employee Report",
  "Salary Report",
  "Leave Report",
  "Attendance Report",
];

export default function Analytics() {

  const handlePDF = (report: string) => {
    alert(`${report} PDF Download`);
  };

  const handleExcel = (report: string) => {
    alert(`${report} Excel Download`);
  };

  return (
    <div className={styles.analyticsContainer}>

      <div className={styles.overlay}></div>

      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Report & Analytics</h1>

        <div className={styles.reportCard}>

          {reports.map((report) => (
            <div key={report} className={styles.reportRow}>

              <div className={styles.reportName}>
                {report}
              </div>

              <button
                className={styles.pdfButton}
                onClick={() => handlePDF(report)}
              >
                PDF
              </button>

              <button
                className={styles.excelButton}
                onClick={() => handleExcel(report)}
              >
                Excel
              </button>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}