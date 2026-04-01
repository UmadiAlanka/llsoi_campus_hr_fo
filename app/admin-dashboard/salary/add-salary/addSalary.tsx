"use client";

import React, { useState } from "react";
import styles from "./addSalary.module.css";
import { useRouter } from "next/navigation";

export default function AddSalary() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: "", name: "", employeeType: "", month: "",
    basicSalary: "", allowances: "", deductions: "", netSalary: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("http://localhost:2027/api/salaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setStatus("success");
      setTimeout(() => router.push("/admin-dashboard/salary"), 1500);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <>
      {status === "success" && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Salary record added successfully!</p>
          </div>
        </div>
      )}

      <h2 className={styles.pageTitle}>Add Salary</h2>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <h3 className={styles.sectionTitle}>Employee Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee ID:</label>
              <input name="employeeId" value={formData.employeeId} onChange={handleChange} className={styles.input} placeholder="EMP-001" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee Name:</label>
              <input name="name" value={formData.name} onChange={handleChange} className={styles.input} placeholder="Full Name" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee Type:</label>
              <select name="employeeType" value={formData.employeeType} onChange={handleChange} className={styles.select} required>
                <option value="">-- Select --</option>
                <option value="Academic">Academic</option>
                <option value="Non-academic">Non-academic</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Month:</label>
              <input name="month" type="month" value={formData.month} onChange={handleChange} className={styles.input} required />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>Salary Details</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Basic Salary (Rs):</label>
              <input name="basicSalary" type="number" value={formData.basicSalary} onChange={handleChange} className={styles.input} placeholder="50000" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Allowances (Rs):</label>
              <input name="allowances" type="number" value={formData.allowances} onChange={handleChange} className={styles.input} placeholder="5000" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Deductions (Rs):</label>
              <input name="deductions" type="number" value={formData.deductions} onChange={handleChange} className={styles.input} placeholder="2000" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Net Salary (Rs):</label>
              <input name="netSalary" type="number" value={formData.netSalary} onChange={handleChange} className={styles.input} placeholder="53000" required />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
            {status === "loading" ? "Saving..." : "ADD SALARY RECORD"}
          </button>
        </form>
      </div>
    </>
  );
}