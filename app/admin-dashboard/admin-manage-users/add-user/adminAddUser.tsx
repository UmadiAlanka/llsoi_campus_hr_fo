"use client";

import React, { useState } from "react";
import styles from "./adminAddUser.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddUser() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    address: "",
    contactNumber: "",
    role: "EMPLOYEE", // default role
    job: "",
    jobType: "Academic",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const menuItems = [
    { name: "Dashboard", icon: "/icons/home.png", href: "/admin-dashboard" },
    { name: "Manage Users", icon: "/icons/user.png", href: "/admin-dashboard/admin-manage-users" },
    { name: "Attendance", icon: "/icons/dattendance.png", href: "/admin-dashboard/admin-attendance" },
    { name: "Salary & Pay Slip", icon: "/icons/dsalary.png", href: "/admin-dashboard/salary" },
    { name: "Anomaly Detections", icon: "/icons/anomaly.png", href: "/admin-dashboard/anomaly" },
    { name: "Report & Analytics", icon: "/icons/report.png", href: "/admin-dashboard/analytics" },
    { name: "Leave Management", icon: "/icons/leave.png", href: "/admin-dashboard/leave" },
    { name: "Logout", icon: "/icons/logout.png", href: "/" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      name: formData.name,
      employeeId: formData.employeeId,
      address: formData.address,
      contactNumber: formData.contactNumber,
      role: formData.role,          // EMPLOYEE / ADMIN / HR
      job: formData.job,
      jobType: formData.jobType,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:2027/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to create user");
      }

      alert("User added successfully!");

      // Reset form
      setFormData({
        name: "",
        employeeId: "",
        address: "",
        contactNumber: "",
        role: "EMPLOYEE",
        job: "",
        jobType: "Academic",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      router.push("/admin-dashboard/admin-manage-users");
    } catch (error) {
      console.error("Error:", error);
      alert("Error while adding user!");
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/Logo.png" className={styles.headerLogo} />
          <h1 className={styles.brandName}>
            LLSOI Campus HR <span>Management System</span>
          </h1>
        </div>
        <div className={styles.adminProfile}>
          <img src="/icons/user-profile.png" className={styles.adminAvatar} />
          <span className={styles.userName}>Admin</span>
        </div>
      </header>

      <div className={styles.layoutBody}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className={styles.menuItem}>
                  <img src={item.icon} className={styles.menuIconImage} />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Add User</h2>

          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <input name="name" placeholder="Name" value={formData.name} className={styles.input} onChange={handleChange} />
                <input name="employeeId" placeholder="Employee ID" value={formData.employeeId} className={styles.input} onChange={handleChange} />
                <input name="address" placeholder="Address" value={formData.address} className={styles.input} onChange={handleChange} />
                <input name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} className={styles.input} onChange={handleChange} />
                <input name="job" placeholder="Job" value={formData.job} className={styles.input} onChange={handleChange} />

                <select name="jobType" value={formData.jobType} className={styles.select} onChange={handleChange}>
                  <option value="Academic">Academic</option>
                  <option value="Non-academic">Non-academic</option>
                </select>

                <select name="role" value={formData.role} className={styles.select} onChange={handleChange}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                  <option value="HR">HR Staff</option>
                </select>

                <input name="username" placeholder="Username" value={formData.username} className={styles.input} onChange={handleChange} />
                <input name="email" placeholder="Email" value={formData.email} className={styles.input} onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" value={formData.password} className={styles.input} onChange={handleChange} />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} className={styles.input} onChange={handleChange} />
              </div>

              <button type="submit" className={styles.registerBtn}>
                REGISTER
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
