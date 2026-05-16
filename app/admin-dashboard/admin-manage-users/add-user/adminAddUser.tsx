"use client";

import React, { useState } from "react";
import styles from "./adminAddUser.module.css";
import { useRouter } from "next/navigation";
import MessageBox from "../../components/MessageBox"; // Ensure this path is correct

export default function AddUser() {
  const router = useRouter();

  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    msg: string;
  }>({
    show: false,
    type: "success",
    msg: "",
  });

  const [formData, setFormData] = useState({
    name: "",
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
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

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

    try {
<<<<<<< HEAD
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";
      // Ensure we send exactly what the backend expects for a new user/employee
      const payload = {
        ...formData,
        confirmPassword: undefined,
        // Ensure username is explicitly set if backend uses it for auth
        username: formData.username.trim(),
        password: formData.password.trim()
      };
      
      const res = await fetch(`${API_URL}/employees`, {
=======
      const { confirmPassword, ...payload } = formData;

      const res = await fetch("http://localhost:2027/api/employees", {
>>>>>>> 98c1668263a722ee6f7a8923c6ffb2935a07ddfc
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        const friendlyMsg = errorText.includes("Duplicate entry")
          ? `The username "${formData.username}" is already taken.`
          : errorText;
        throw new Error(friendlyMsg);
      }

      setModal({
        show: true,
        type: "success",
        msg: "User has been registered successfully!",
      });
    } catch (err: any) {
      setModal({
        show: true,
        type: "error",
        msg: err.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <>
      <h2 className={styles.pageTitle}>Add User</h2>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>

          {/* ── Personal Details ── */}
          <h3 className={styles.sectionTitle}>Personal Details</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                placeholder="Full Name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Employee ID:</label>
              <input
                readOnly
                className={styles.input}
                placeholder="Auto Generated"
                style={{ background: "#f9f9f9", cursor: "not-allowed" }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>NIC:</label>
              <input
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g. 200012345678"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Date of Birth:</label>
              <input
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Number:</label>
              <input
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className={styles.input}
                placeholder="07xxxxxxxx"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Address:</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={styles.input}
                placeholder="Residential Address"
              />
            </div>
          </div>

          {/* ── Job Details ── */}
          <h3 className={styles.sectionTitle}>Job Details</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Title:</label>
              <input
                name="job"
                value={formData.job}
                onChange={handleChange}
                className={styles.input}
                placeholder="Lecturer / Officer"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Department:</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="Management">Management</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Job Type:</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Academic">Academic</option>
                <option value="Non-academic">Non-academic</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Date Joined:</label>
              <input
                name="dateJoined"
                type="date"
                value={formData.dateJoined}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={styles.select}
              >
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
              <label className={styles.label}>Username:</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email:</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password:</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password:</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.registerBtn}>
            REGISTER USER
          </button>
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