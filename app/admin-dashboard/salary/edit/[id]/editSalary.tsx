"use client";

import React, { useState } from "react";
import styles from "../../add-salary/addSalary.module.css";
import { useParams, useRouter } from "next/navigation";

export default function EditSalary() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: params.id as string,
    name: "S.Perera",
    employeeType: "Academic",
    month: "2025-10",
    basicSalary: "50000",
    allowances: "5000",
    deductions: "3000",
    netSalary: "52000",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
    setTimeout(() => router.push("/admin-dashboard/salary"), 1500);
  };

  return (
    <>
      {status === "success" && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Salary updated successfully!</p>
          </div>
        </div>
      )}

      <h2 className={styles.pageTitle}>Edit Salary — Record #{params.id}</h2>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <h3 className={styles.sectionTitle}>Employee Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee ID:</label>
              <input name="employeeId" value={formData.employeeId} className={styles.input} readOnly style={{ background: '#f0f0f0', cursor: 'not-allowed' }} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee Name:</label>
              <input name="name" value={formData.name} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee Type:</label>
              <select name="employeeType" value={formData.employeeType} onChange={handleChange} className={styles.select}>
                <option value="Academic">Academic</option>
                <option value="Non-academic">Non-academic</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Month:</label>
              <input name="month" type="month" value={formData.month} onChange={handleChange} className={styles.input} />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>Salary Details</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Basic Salary (Rs):</label>
              <input name="basicSalary" type="number" value={formData.basicSalary} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Allowances (Rs):</label>
              <input name="allowances" type="number" value={formData.allowances} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Deductions (Rs):</label>
              <input name="deductions" type="number" value={formData.deductions} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Net Salary (Rs):</label>
              <input name="netSalary" type="number" value={formData.netSalary} onChange={handleChange} className={styles.input} />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
            {status === "loading" ? "Updating..." : "UPDATE SALARY RECORD"}
          </button>
        </form>
      </div>
    </>
  );
}