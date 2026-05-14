"use client";

import React, { useState } from "react";
import styles from "./analytics.module.css";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const attendanceData = [85, 90, 78, 92, 88, 95, 82, 91, 87, 93, 89, 94];
const salaryData     = [120, 125, 122, 130, 128, 135, 132, 138, 134, 140, 136, 142];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState<"attendance" | "salary" | "leave">("attendance");

  const maxAttendance = Math.max(...attendanceData);
  const maxSalary     = Math.max(...salaryData);

  return (
    <>
      <h2 className={styles.pageTitle}>Reports &amp; Analytics</h2>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        {[
          { label: "Total Employees", value: "25", icon: "👥" },
          { label: "Avg. Attendance",  value: "89%", icon: "📋" },
          { label: "Leaves This Month", value: "4", icon: "🏖️" },
          { label: "Salary Disbursed",  value: "Rs 1.4M", icon: "💰" },
        ].map((card) => (
          <div key={card.label} className={styles.summaryCard}>
            <span className={styles.cardEmoji}>{card.icon}</span>
            <p className={styles.cardVal}>{card.value}</p>
            <p className={styles.cardLbl}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.tabRow}>
        {(["attendance", "salary", "leave"] as const).map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${activeTab === t ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t === "attendance" ? "Attendance" : t === "salary" ? "Salary" : "Leave"}
          </button>
        ))}
      </div>

      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>
          {activeTab === "attendance" ? "Monthly Attendance Rate (%)"
           : activeTab === "salary"   ? "Monthly Salary Disbursed (Rs '000)"
           :                            "Monthly Leave Requests"}
        </h3>
        <div className={styles.barChart}>
          {MONTHS.map((month, i) => {
            const val  = activeTab === "attendance" ? attendanceData[i]
                       : activeTab === "salary"     ? salaryData[i]
                       : Math.floor(Math.random() * 8) + 1;
            const max  = activeTab === "attendance" ? maxAttendance
                       : activeTab === "salary"     ? maxSalary
                       : 12;
            const pct  = (val / max) * 100;
            return (
              <div key={month} className={styles.barCol}>
                <span className={styles.barLabel}>{val}</span>
                <div className={styles.bar} style={{ height: `${pct}%` }} />
                <span className={styles.barMonth}>{month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}