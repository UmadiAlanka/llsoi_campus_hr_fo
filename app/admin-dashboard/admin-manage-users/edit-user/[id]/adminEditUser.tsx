"use client";

import React, { useState, useEffect } from "react";
import styles from "./adminEditUser.module.css";
import { useParams, useRouter } from "next/navigation";
import MessageBox from "../../../components/MessageBox";

export default function AdminEditUser() {
  const params   = useParams();
  const router   = useRouter();
  const employeeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    nic: "",
    dob: "",
    gender: "",
    address: "",
    contactNumber: "",
    role: "EMPLOYEE",
    job: "",
    jobType: "Academic",
    department: "",
    dateJoined: "",
    username: "",
    email: "",
  });

  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    msg: string;
  }>({
    show: false,
    type: "success",
    msg: "",
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
            name: e.name || "",
            employeeId: e.employeeId || "",
            nic: e.nic || "",
            dob: e.dob || "",
            gender: e.gender || "",
            address: e.address || "",
            contactNumber: e.contactNumber || "",
            role: e.role || "EMPLOYEE",
            job: e.job || "",
            jobType: e.jobType || "Academic",
            department: e.department || "",
            dateJoined: e.dateJoined || "",
            username: e.username || "",
            email: e.email || "",
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
    const payload: any = {
      name: formData.name,
      nic: formData.nic,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
      contactNumber: formData.contactNumber,
      role: formData.role,
      job: formData.job,
      jobType: formData.jobType,
      department: formData.department,
      dateJoined: formData.dateJoined,
      username: formData.username,
      email: formData.email,
    };
    try {
      const res = await fetch(`http://localhost:2027/api/employees/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setModal({ show: true, type: "success", msg: "Employee updated successfully!" });
      } else {
        setModal({ show: true, type: "error", msg: result.message || "Update failed." });
      }
    } catch {
      setModal({ show: true, type: "error", msg: "Error connecting to server." });
    }
  };

  const handleCloseModal = () => {
    const wasSuccess = modal.type === "success";
    setModal({ ...modal, show: false });
    if (wasSuccess) router.push("/admin-dashboard/admin-manage-users");
  };

  if (loading) return <p style={{ color: "#fff" }}>Loading...</p>;

  return (
    <>
      <h2 className={styles.pageTitle}>Edit User — {formData.name}</h2>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>

          {/* ── Personal Details ── */}
          <h3 className={styles.sectionTitle}>Personal Details</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input name="name" value={formData.name} onChange={handleChange} className={styles.input} required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Employee ID</label>
              <input value={formData.employeeId} readOnly className={styles.input} style={{ background: "#f0f0f0", cursor: "not-allowed" }} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>NIC</label>
              <input name="nic" value={formData.nic} onChange={handleChange} className={styles.input} placeholder="e.g. 200012345678" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Date of Birth</label>
              <input name="dob" type="date" value={formData.dob} onChange={handleChange} className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={styles.select}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Number</label>
              <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={styles.input} placeholder="07xxxxxxxx" />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.label}>Address</label>
              <input name="address" value={formData.address} onChange={handleChange} className={styles.input} placeholder="Residential Address" />
            </div>
          </div>

          {/* ── Job Details ── */}
          <h3 className={styles.sectionTitle}>Job Details</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Title</label>
              <input name="job" value={formData.job} onChange={handleChange} className={styles.input} placeholder="Lecturer / Officer" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Department</label>
              <select name="department" value={formData.department} onChange={handleChange} className={styles.select}>
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="Management">Management</option>
                <option value="Finance">Finance</option>
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

            <div className={styles.formGroup}>
              <label className={styles.label}>Date Joined</label>
              <input name="dateJoined" type="date" value={formData.dateJoined} onChange={handleChange} className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className={styles.select}>
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option>
                <option value="HR">HR Staff</option>
              </select>
            </div>
          </div>

          {/* ── Login Credentials ── */}
          <h3 className={styles.sectionTitle}>Login Credentials</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Username</label>
              <input name="username" value={formData.username} onChange={handleChange} className={styles.input} required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className={styles.input} required />
            </div>
          </div>

          <button type="submit" className={styles.updateBtn}>UPDATE USER</button>
        </form>
      </div>

      {modal.show && (
        <MessageBox
          type={modal.type}
          message={modal.msg}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}