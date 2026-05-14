"use client";

import React, { useState, useEffect } from "react";
import styles from "./adminEditUser.module.css";
import { useParams, useRouter } from "next/navigation";

export default function AdminEditUser() {
  const params   = useParams();
  const router   = useRouter();
  const employeeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "", employeeId: "", address: "", contactNumber: "",
    role: "Employee", job: "", jobType: "Academic",
    username: "", email: "", password: "", confirmPassword: "",
  });

  useEffect(() => {
    if (!employeeId) { setLoading(false); return; }
    (async () => {
      try {
        const res = await fetch(`http://localhost:2027/api/employees/${employeeId}`);
        const result = await res.json();
        if (result.success && result.data) {
          const e = result.data;
          setFormData({
            name: e.name || "", employeeId: e.employeeId || "", address: e.address || "",
            contactNumber: e.contactNumber || "", role: e.role || "Employee",
            job: e.job || "", jobType: e.jobType || "Academic",
            username: e.username || "", email: e.email || "",
            password: "", confirmPassword: "",
          });
        }
      } catch { console.error("Fetch error"); }
      finally { setLoading(false); }
    })();
  }, [employeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) { alert("Passwords don't match"); return; }
    const payload: any = { name: formData.name, address: formData.address, contactNumber: formData.contactNumber, role: formData.role, job: formData.job, jobType: formData.jobType, username: formData.username, email: formData.email };
    if (formData.password) payload.password = formData.password;
    try {
      const res = await fetch(`http://localhost:2027/api/employees/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) { alert("Updated!"); router.push("/admin-dashboard/admin-manage-users"); }
      else alert("Update failed");
    } catch { alert("Error updating"); }
  };

  if (loading) return <p style={{ color: '#fff' }}>Loading...</p>;

  return (
    <>
      <h2 className={styles.pageTitle}>Edit User — {formData.name}</h2>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <h3 className={styles.sectionTitle}>User Details</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input name="name" value={formData.name} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee ID</label>
              <input value={formData.employeeId} readOnly className={styles.input} style={{ background: '#f0f0f0', cursor: 'not-allowed' }} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Address</label>
              <input name="address" value={formData.address} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Number</label>
              <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Title</label>
              <input name="job" value={formData.job} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className={styles.select}>
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} className={styles.select}>
                <option value="Academic">Academic</option>
                <option value="Non-academic">Non-academic</option>
              </select>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>Login Credentials</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Username</label>
              <input name="username" value={formData.username} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} className={styles.input} />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>Change Password <span style={{ fontWeight: 400, fontSize: '0.85rem' }}>(leave blank to keep)</span></h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>New Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={styles.input} />
            </div>
          </div>

          <button type="submit" className={styles.updateBtn}>UPDATE USER</button>
        </form>
      </div>
    </>
  );
}