"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './document.module.css';

const DocumentManagement = () => {
  const router = useRouter();

  
  const reports = [
    { id: 1, name: "Employee Report", type: "employee" },
    { id: 2, name: "Salary Report", type: "salary" },
    { id: 3, name: "Leave Report", type: "leave" },
    { id: 4, name: "Attendance Report", type: "attendance" },
  ];

  
  const handleDownload = (reportType: string, format: string) => {

    const backendUrl = `http://localhost:2027/api/reports/${reportType}/${format}`;
    
   
    window.open(backendUrl, "_blank");
    
    console.log(`Requesting ${reportType} report in ${format} format...`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Document Management</h1>
      <h2 className={styles.subtitle}>Generate and Download Reports</h2>

      <div className={styles.formCard}>
        <div className={styles.reportList}>
          {reports.map((report) => (
            <div key={report.id} className={styles.reportRow}>
              
              <div className={styles.reportNameContainer}>
                <span className={styles.reportName}>{report.name}</span>
              </div>
              
              
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.pdfBtn} 
                  onClick={() => handleDownload(report.type, 'pdf')}
                >
                  PDF
                </button>
                <button 
                  className={styles.excelBtn} 
                  onClick={() => handleDownload(report.type, 'excel')}
                >
                  Excel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      
    </div>
  );
};

export default DocumentManagement;