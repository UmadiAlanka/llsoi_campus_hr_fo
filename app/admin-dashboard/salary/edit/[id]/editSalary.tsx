"use client";

<<<<<<< HEAD
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
=======
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
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
  );
}