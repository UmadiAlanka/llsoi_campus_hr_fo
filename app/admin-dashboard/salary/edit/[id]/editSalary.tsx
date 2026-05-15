"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./editSalary.module.css";
import MessageBox from "@/app/admin-dashboard/components/MessageBox";

export default function EditSalaryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [msgConfig, setMsgConfig] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

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
          basicSalary: parseFloat(formData.basicSalary),
          netSalary: parseFloat(formData.netSalary),
        }),
      });

      if (response.ok) {
        setMsgConfig({ show: true, type: "success", message: "Salary record updated successfully!" });
        setTimeout(() => {
          router.push("/admin-dashboard/salary");
          router.refresh();
        }, 1500);
      } else {
        throw new Error();
      }
    } catch (error) {
      setMsgConfig({ show: true, type: "error", message: "Update failed." });
      setTimeout(() => setMsgConfig({ ...msgConfig, show: false }), 2500);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {msgConfig.show && (
        <MessageBox 
          type={msgConfig.type} 
          message={msgConfig.message} 
          onClose={() => setMsgConfig({ ...msgConfig, show: false })} 
        />
      )}

      <div className={styles.glassCard}>
        <h2 className={styles.formHeader}>Edit Salary</h2>
        
        <form onSubmit={handleUpdate} className={styles.editForm}>
          <div className={styles.fullRow}>
            <label>Name:</label>
            <input type="text" value={formData.name} readOnly className={styles.readOnlyInput} />
          </div>

          <div className={styles.splitRow}>
            <div className={styles.inputField}>
              <label>Employee ID:</label>
              <input type="text" value={formData.employeeId} readOnly className={styles.readOnlyInput} />
            </div>
            <div className={styles.inputField}>
              <label>Select Type:</label>
              <select value={formData.type} disabled className={styles.readOnlyInput}>
                <option>{formData.type}</option>
              </select>
            </div>
          </div>

          <div className={styles.fullRow}>
            <label>Date:</label>
            <input type="month" value={formData.date} readOnly className={styles.readOnlyInput} />
          </div>

          <div className={styles.fullRow}>
            <label>Basic Salary:</label>
            <input 
              type="number" 
              value={formData.basicSalary} 
              onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
              className={styles.editableInput}
              required 
            />
          </div>

          <div className={styles.fullRow}>
            <label>Net Salary:</label>
            <input 
              type="number" 
              value={formData.netSalary} 
              onChange={(e) => setFormData({...formData, netSalary: e.target.value})}
              className={styles.editableInput}
              required 
            />
          </div>

          <button type="submit" className={styles.greenUpdateBtn}>UPDATE</button>
        </form>
      </div>
    </div>
  );
}