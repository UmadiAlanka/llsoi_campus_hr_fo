"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./editSalary.module.css"; // Create this CSS file for styling

interface SalaryData {
  id: number;
  employee: {
    name: string;
    employeeId: string;
    jobType: string;
  };
  basicSalary: number;
  netSalary: number;
  month: number;
  year: number;
}

export default function EditSalaryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [formData, setFormData] = useState<any>({
    name: "",
    employeeId: "",
    type: "",
    date: "",
    basicSalary: "",
    netSalary: "",
  });

  useEffect(() => {
    const fetchSalaryDetails = async () => {
      try {
        const response = await fetch(`http://localhost:2027/api/payroll/${id}`);
        const result = await response.json();
        if (result.success) {
          const data = result.data;
          setFormData({
            name: data.employee.name,
            employeeId: data.employee.employeeId,
            type: data.employee.jobType || "Full-Time",
            date: `${data.year}-${String(data.month).padStart(2, '0')}`,
            basicSalary: data.basicSalary,
            netSalary: data.netSalary,
          });
        }
      } catch (error) {
        console.error("Error fetching salary:", error);
      }
    };
    if (id) fetchSalaryDetails();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:2027/api/payroll/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basicSalary: formData.basicSalary,
          netSalary: formData.netSalary,
        }),
      });

      if (response.ok) {
        alert("Salary updated successfully!");
        router.push("/admin-dashboard/salary");
      }
    } catch (error) {
      alert("Update failed.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Edit Salary</h2>
        <form onSubmit={handleUpdate}>
          <div className={styles.inputGroup}>
            <label>Name:</label>
            <input type="text" value={formData.name} readOnly className={styles.readOnly} />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Employee ID:</label>
              <input type="text" value={formData.employeeId} readOnly className={styles.readOnly} />
            </div>
            <div className={styles.inputGroup}>
              <label>Select Type:</label>
              <select value={formData.type} disabled className={styles.readOnly}>
                <option>{formData.type}</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Date:</label>
            <input type="month" value={formData.date} readOnly className={styles.readOnly} />
          </div>

          <div className={styles.inputGroup}>
            <label>Basic Salary:</label>
            <input 
              type="number" 
              value={formData.basicSalary} 
              onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Net Salary:</label>
            <input 
              type="number" 
              value={formData.netSalary} 
              onChange={(e) => setFormData({...formData, netSalary: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className={styles.updateBtn}>UPDATE</button>
        </form>
      </div>
    </div>
  );
}