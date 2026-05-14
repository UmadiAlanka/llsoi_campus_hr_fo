"use client";

import React, { useState } from "react";
import styles from "./addSalary.module.css";
import { useRouter } from "next/navigation";

export default function AddSalary() {
  const router = useRouter();
  const [formData, setFormData] = useState({
<<<<<<< HEAD
    employeeId: "", name: "", employeeType: "", month: "",
    basicSalary: "", allowances: "", deductions: "", netSalary: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
=======
    employeeId: "", 
    name: "",
    employeeType: "",
    month: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    netSalary: "",
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [isFetching, setIsFetching] = useState(false);

  // --- AUTO-FETCH EMPLOYEE DETAILS ---
  const fetchEmployeeDetails = async (id: string) => {
    if (!id) return;
    
    setIsFetching(true);
    try {
      // Calls your EmployeeController @GetMapping("/{employeeId}")
      const response = await fetch(`http://localhost:2027/api/employees/${id}`);
      const result = await response.json();

      if (result.success) {
        const emp = result.data;
        setFormData((prev) => ({
          ...prev,
          name: emp.name,
          // Maps 'jobType' from your Java DTO to 'employeeType'
          employeeType: emp.jobType || "", 
        }));
      } else {
        alert("Employee ID not found in database!");
        setFormData((prev) => ({ ...prev, name: "", employeeType: "" }));
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    } finally {
      setIsFetching(false);
    }
  };
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
<<<<<<< HEAD
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
=======

    const [yearNum, monthNum] = formData.month.split("-").map(Number);

    const payload = {
      employee: { id: parseInt(formData.employeeId) },
      basicSalary: parseFloat(formData.basicSalary),
      netSalary: parseFloat(formData.netSalary),
      // Adding common fields usually required by your Salary model
      allowances: parseFloat(formData.allowances || "0"),
      otherDeductions: parseFloat(formData.deductions || "0"),
      month: monthNum,
      year: yearNum,
      status: "PENDING"
    };

    try {
      const response = await fetch("http://localhost:2027/api/payroll/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setTimeout(() => {
          router.push("/admin-dashboard/salary");
          router.refresh();
        }, 1500);
      } else {
        alert("Backend Error: " + result.message);
        setStatus("idle");
      }
    } catch (error) {
      console.error("Connection failed", error);
      setStatus("idle");
      alert("Could not connect to the backend server.");
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
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
<<<<<<< HEAD
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
=======
              <label className={styles.label}>Database ID:</label>
              <input 
                name="employeeId" 
                value={formData.employeeId} 
                onChange={handleChange} 
                onBlur={(e) => fetchEmployeeDetails(e.target.value)} 
                className={styles.input} 
                placeholder="e.g. 29" 
                required 
              />
              {isFetching && <span className={styles.loadingText}>🔍 Fetching...</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee Name:</label>
              <input 
                name="name" 
                value={formData.name} 
                className={styles.inputReadOnly} 
                placeholder="Auto-filled" 
                readOnly 
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Employee Type:</label>
              <input 
                name="employeeType" 
                value={formData.employeeType} 
                className={styles.inputReadOnly} 
                placeholder="Auto-filled" 
                readOnly 
                required 
              />
            </div>

>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
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

<<<<<<< HEAD
          <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
=======
          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={status === "loading" || isFetching}
          >
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
            {status === "loading" ? "Saving..." : "ADD SALARY RECORD"}
          </button>
        </form>
      </div>
    </>
  );
}