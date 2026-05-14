"use client";

import React, { useState } from "react";
import styles from "./adminAddUser.module.css";
import { useRouter } from "next/navigation";
<<<<<<< HEAD

export default function AddUser() {
  const router = useRouter();
=======
import MessageBox from "../../components/MessageBox"; // Ensure this path is correct

export default function AddUser() {
  const router = useRouter();
  
  // 1. New state for controlling the custom message box
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    msg: string;
  }>({
    show: false,
    type: "success",
    msg: "",
  });

>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
  const [formData, setFormData] = useState({
    name: "", address: "", contactNumber: "", role: "EMPLOYEE",
    job: "", jobType: "Academic", username: "", email: "",
    password: "", confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

<<<<<<< HEAD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { alert("Passwords do not match!"); return; }
=======
  // 2. Helper to close modal and redirect if successful
  const handleCloseModal = () => {
    const wasSuccess = modal.type === "success";
    setModal({ ...modal, show: false });
    
    if (wasSuccess) {
      router.push("/admin-dashboard/admin-manage-users");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setModal({ show: true, type: "error", msg: "Passwords do not match!" });
      return;
    }

>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
    try {
      const res = await fetch("http://localhost:2027/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, confirmPassword: undefined }),
      });
<<<<<<< HEAD
      if (!res.ok) throw new Error(await res.text());
      alert("User added successfully!");
      router.push("/admin-dashboard/admin-manage-users");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
=======

      if (!res.ok) {
        const errorText = await res.text();
        // Check if the error is a duplicate username
        const friendlyMsg = errorText.includes("Duplicate entry") 
          ? `The username "${formData.username}" is already taken.` 
          : errorText;
        throw new Error(friendlyMsg);
      }

      // 3. Success state instead of alert
      setModal({ 
        show: true, 
        type: "success", 
        msg: "User has been registered successfully!" 
      });

    } catch (err: any) {
      // 4. Error state instead of alert
      setModal({ 
        show: true, 
        type: "error", 
        msg: err.message || "An unexpected error occurred." 
      });
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
    }
  };

  return (
    <>
      <h2 className={styles.pageTitle}>Add User</h2>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
<<<<<<< HEAD
=======
          {/* ... User Details Section (Same as your code) */}
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
          <h3 className={styles.sectionTitle}>User Details</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name:</label>
              <input name="name" value={formData.name} onChange={handleChange} className={styles.input} placeholder="Full Name" required />
            </div>
            <div className={styles.formGroup}>
<<<<<<< HEAD
              <label className={styles.label}>Employee ID:</label>
              <input readOnly className={styles.input} placeholder="Auto Generated" style={{ background: '#f9f9f9', cursor: 'not-allowed' }} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Address:</label>
              <input name="address" value={formData.address} onChange={handleChange} className={styles.input} placeholder="Residential Address" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Number:</label>
              <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={styles.input} placeholder="07xxxxxxxx" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Title:</label>
              <input name="job" value={formData.job} onChange={handleChange} className={styles.input} placeholder="Lecturer / Officer" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Role:</label>
              <select name="role" value={formData.role} onChange={handleChange} className={styles.select}>
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option>
                <option value="HR">HR Staff</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Type:</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} className={styles.select}>
                <option value="Academic">Academic</option>
                <option value="Non-academic">Non-academic</option>
              </select>
=======
               <label className={styles.label}>Employee ID:</label>
               <input readOnly className={styles.input} placeholder="Auto Generated" style={{ background: '#f9f9f9', cursor: 'not-allowed' }} />
            </div>
            <div className={styles.formGroup}>
               <label className={styles.label}>Address:</label>
               <input name="address" value={formData.address} onChange={handleChange} className={styles.input} placeholder="Residential Address" />
            </div>
            <div className={styles.formGroup}>
               <label className={styles.label}>Contact Number:</label>
               <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={styles.input} placeholder="07xxxxxxxx" required />
            </div>
            <div className={styles.formGroup}>
               <label className={styles.label}>Job Title:</label>
               <input name="job" value={formData.job} onChange={handleChange} className={styles.input} placeholder="Lecturer / Officer" />
            </div>
            <div className={styles.formGroup}>
               <label className={styles.label}>Role:</label>
               <select name="role" value={formData.role} onChange={handleChange} className={styles.select}>
                 <option value="EMPLOYEE">Employee</option>
                 <option value="ADMIN">Admin</option>
                 <option value="HR">HR Staff</option>
               </select>
            </div>
            <div className={styles.formGroup}>
               <label className={styles.label}>Job Type:</label>
               <select name="jobType" value={formData.jobType} onChange={handleChange} className={styles.select}>
                 <option value="Academic">Academic</option>
                 <option value="Non-academic">Non-academic</option>
               </select>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
            </div>
          </div>

          <h3 className={styles.sectionTitle}>Login Credentials</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Username:</label>
              <input name="username" value={formData.username} onChange={handleChange} className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email:</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password:</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password:</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={styles.input} required />
            </div>
          </div>

          <button type="submit" className={styles.registerBtn}>REGISTER USER</button>
        </form>
      </div>
<<<<<<< HEAD
=======

      {/* 5. Render the MessageBox Component */}
      {modal.show && (
        <MessageBox 
          type={modal.type} 
          message={modal.msg} 
          onClose={handleCloseModal} 
        />
      )}
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
    </>
  );
}