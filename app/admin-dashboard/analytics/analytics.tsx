"use client";

import React, { useState, useEffect } from "react";
import styles from "./analytics.module.css";
import MessageBox from "../components/MessageBox";

// ── Types ────────────────────────────────────────────────────────────────────
interface MessageConfig {
  show: boolean;
  type: "success" | "error";
  message: string;
}

// ── PDF helpers (pure JS, no extra deps) ──────────────────────────────────────
function buildTableRows(headers: string[], rows: string[][]): string {
  const head = `<tr>${headers.map((h) => `<th style="background:#720e0e;color:#fff;padding:8px 12px;text-align:left;font-size:12px;">${h}</th>`).join("")}</tr>`;
  const body = rows
    .map(
      (r, i) =>
        `<tr style="background:${i % 2 === 0 ? "#fff" : "#fdf2f2"};">${r.map((c) => `<td style="padding:7px 12px;border-bottom:1px solid #f0e0e0;font-size:11px;color:#333;">${c ?? "—"}</td>`).join("")}</tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;">${head}${body}</table>`;
}

function buildPDF(title: string, tableHTML: string, generatedAt: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>
  @media print { body { margin:0; } .no-print { display:none; } }
  body { font-family: 'Segoe UI', Arial, sans-serif; color:#222; margin:0; padding:0; }
  .header { background:#720e0e; color:#fff; padding:24px 32px; display:flex; align-items:center; gap:18px; }
  .header h1 { margin:0; font-size:22px; font-weight:900; }
  .header p { margin:4px 0 0; font-size:12px; opacity:.75; }
  .badge { background:#FFD814; color:#720e0e; font-weight:900; font-size:11px; padding:3px 10px; border-radius:20px; display:inline-block; }
  .content { padding:28px 32px; }
  .meta { display:flex; justify-content:space-between; margin-bottom:20px; font-size:12px; color:#888; }
  .print-btn { position:fixed; bottom:24px; right:24px; background:#720e0e; color:#FFD814; border:none; padding:12px 24px; border-radius:8px; font-weight:900; font-size:14px; cursor:pointer; }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="badge">LLSOI Campus HR</div>
    <h1>${title}</h1>
    <p>HR Management System — Confidential</p>
  </div>
</div>
<div class="content">
  <div class="meta"><span>Generated: ${generatedAt}</span><span>LLSOI Campus HR Management System</span></div>
  ${tableHTML}
</div>
<button class="print-btn no-print" onclick="window.print()">🖨 Print / Save PDF</button>
</body>
</html>`;
}

function openPDF(html: string, filename: string) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Component ─────────────────────────────────────────────────────────────────
const BASE = "http://localhost:2027/api";

const reports = [
  { key: "employee",   label: "Employee Report" },
  { key: "salary",     label: "Salary Report" },
  { key: "leave",      label: "Leave Report"},
  { key: "attendance", label: "Attendance Report" },
];

export default function Analytics() {
  const [loading, setLoading] = useState<string | null>(null);
  const [msgConfig, setMsgConfig] = useState<MessageConfig>({ show: false, type: "success", message: "" });

  const now = () =>
    new Date().toLocaleString("en-LK", { dateStyle: "medium", timeStyle: "short" });

  // ── Fetch & Build ────────────────────────────────────────────────────────
  async function handlePDF(key: string, label: string) {
    setLoading(key);
    try {
      let html = "";

      if (key === "employee") {
        const res = await fetch(`${BASE}/employees`);
        const result = await res.json();
        if (!result.success) throw new Error(result.message);
        const rows: string[][] = (result.data || []).map((e: any) => [
          e.employeeId ?? "—",
          e.name ?? "—",
          e.email ?? "—",
          e.role ?? "—",
          e.job ?? "—",
          e.jobType ?? "—",
          e.department ?? "—",
          e.contactNumber ?? "—",
          e.dateJoined ?? "—",
        ]);
        const table = buildTableRows(
          ["ID", "Name", "Email", "Role", "Job Title", "Job Type", "Department", "Contact", "Date Joined"],
          rows
        );
        html = buildPDF(`${label} — ${now()}`, table, now());
        openPDF(html, `Employee_Report_${Date.now()}.html`);
      }

      else if (key === "salary") {
        const res = await fetch(`${BASE}/payroll/all`);
        const result = await res.json();
        if (!result.success) throw new Error(result.message);
        const rows: string[][] = (result.data || []).map((s: any) => [
          s.employee?.employeeId ?? "—",
          s.employee?.name ?? "—",
          `${s.month ?? "?"}/${s.year ?? "?"}`,
          `Rs ${Number(s.basicSalary || 0).toLocaleString()}`,
          `Rs ${Number(s.allowances || 0).toLocaleString()}`,
          `Rs ${Number(s.otherDeductions || 0).toLocaleString()}`,
          `Rs ${Number(s.netSalary || 0).toLocaleString()}`,
          s.status ?? "—",
        ]);
        const table = buildTableRows(
          ["Emp ID", "Name", "Period", "Basic Salary", "Allowances", "Deductions", "Net Salary", "Status"],
          rows
        );
        html = buildPDF(`${label} — ${now()}`, table, now());
        openPDF(html, `Salary_Report_${Date.now()}.html`);
      }

      else if (key === "leave") {
        const res = await fetch(`${BASE}/leaves`);
        const result = await res.json();
        if (!result.success) throw new Error(result.message);
        const rows: string[][] = (result.data || []).map((l: any) => [
          l.employee?.employeeId ?? "—",
          l.employee?.name ?? "—",
          l.leave_type ?? l.leaveType ?? "—",
          l.startDate ?? "—",
          l.endDate ?? "—",
          l.reason ?? "—",
          l.status ?? "—",
        ]);
        const table = buildTableRows(
          ["Emp ID", "Name", "Leave Type", "Start Date", "End Date", "Reason", "Status"],
          rows
        );
        html = buildPDF(`${label} — ${now()}`, table, now());
        openPDF(html, `Leave_Report_${Date.now()}.html`);
      }

      else if (key === "attendance") {
        const res = await fetch(`${BASE}/attendance/all`);
        const result = await res.json();
        if (!result.success) throw new Error(result.message);
        const rows: string[][] = (result.data || []).map((a: any) => [
          a.employee?.id?.toString().padStart(3, "0") ?? "—",
          a.employee?.name ?? "—",
          a.employee?.department ?? "—",
          a.date ?? "—",
          a.clockInTime ?? "—",
          a.clockOutTime ?? "—",
          a.workingHours != null ? `${a.workingHours} hrs` : "—",
          a.status ?? "—",
        ]);
        const table = buildTableRows(
          ["Emp ID", "Name", "Department", "Date", "Clock In", "Clock Out", "Hours", "Status"],
          rows
        );
        html = buildPDF(`${label} — ${now()}`, table, now());
        openPDF(html, `Attendance_Report_${Date.now()}.html`);
      }

      setMsgConfig({
        show: true,
        type: "success",
        message: `${label} downloaded successfully! Open the file in your browser and use "Print → Save as PDF" to get a PDF copy.`,
      });
    } catch (err: any) {
      console.error(err);
      setMsgConfig({
        show: true,
        type: "error",
        message: `Failed to generate ${label}: ${err.message || "Check your backend connection on port 2027."}`,
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className={styles.analyticsContainer}>
      {msgConfig.show && (
        <MessageBox
          type={msgConfig.type}
          message={msgConfig.message}
          onClose={() => setMsgConfig({ ...msgConfig, show: false })}
        />
      )}

      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Report &amp; Analytics</h1>

        <div className={styles.reportGrid}>
          {reports.map(({ key, label}) => (
            <div key={key} className={styles.reportRow}>
              <div className={styles.reportName}>
                <span style={{ marginRight: 10, fontSize: "1.1rem" }}></span>
                {label}
              </div>

              <button
                className={styles.pdfButton}
                onClick={() => handlePDF(key, label)}
                disabled={loading === key}
                style={{ opacity: loading === key ? 0.65 : 1, cursor: loading === key ? "not-allowed" : "pointer" }}
              >
                {loading === key ? "..." : "PDF"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}