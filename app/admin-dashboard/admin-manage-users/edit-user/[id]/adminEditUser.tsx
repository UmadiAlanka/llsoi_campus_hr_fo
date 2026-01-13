"use client";

import React, { useState, useEffect } from "react";
import styles from "./adminEditUser.module.css";
import { useParams, useRouter } from "next/navigation";

export default function AdminEditUser() {
  const params = useParams();
  const router = useRouter();
  const employeeId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    address: "",
    contactNumber: "",
    role: "Employee",
    job: "",
    jobType: "Academic",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ================= FETCH EMPLOYEE =================
  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:2027/api/employees/${employeeId}`);
        const result = await res.json();

        if (!res.ok || !result.success || !result.data) {
          alert("Employee not found");
          setLoading(false);
          return;
        }

        const emp = result.data;

        setFormData({
          name: emp.name || "",
          employeeId: emp.employeeId || "",
          address: emp.address || "",
          contactNumber: emp.contactNumber || "",
          role: emp.role || "Employee",
          job: emp.job || "",
          jobType: emp.jobType || "Academic",
          username: emp.username || "",
          email: emp.email || "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error(error);
        alert("Error loading employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // ================= HANDLE CHANGE =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= HANDLE UPDATE =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload: any = {
      name: formData.name,
      address: formData.address,
      contactNumber: formData.contactNumber,
      role: formData.role,
      job: formData.job,
      jobType: formData.jobType,
      username: formData.username,
      email: formData.email,
    };

    if (formData.password.trim() !== "") {
      payload.password = formData.password;
    }

    try {
      const res = await fetch(
        `http://localhost:2027/api/employees/${employeeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (!res.ok || result.success !== true) {
        alert("Update failed");
        return;
      }

      alert("User updated successfully!");
      router.push("/admin-dashboard/admin-manage-users");
    } catch (error) {
      console.error(error);
      alert("Error updating user");
    }
  };

  if (loading) return <p>Loading employee data...</p>;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/Logo.png" className={styles.headerLogo} />
          <h2 className={styles.brandName}>
            LLSOI Campus HR <span>Management System</span>
          </h2>
        </div>
        <div className={styles.adminProfile}>
          <img src="/icons/user-profile.png" className={styles.adminAvatar} />
          <span>Admin</span>
        </div>
      </header>

      <div className={styles.layoutBody}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <ul className={styles.menuList}>
            <li>
              <a href="/admin-dashboard" className={styles.menuItem}>
                <img src="/icons/home.png" className={styles.menuIconImage} />
                Dashboard
              </a>
            </li>

            <li>
              <a
                href="/admin-dashboard/admin-manage-users"
                className={`${styles.menuItem} ${styles.activeItem}`}
              >
                <img src="/icons/user.png" className={styles.menuIconImage} />
                Manage Users
              </a>
            </li>

            <li>
              <a href="/admin-dashboard/admin-attendance" className={styles.menuItem}>
                <img src="/icons/dattendance.png" className={styles.menuIconImage} />
                Attendance
              </a>
            </li>

            <li>
              <a href="/admin-dashboard/salary" className={styles.menuItem}>
                <img src="/icons/dsalary.png" className={styles.menuIconImage} />
                Salary & Pay Slip
              </a>
            </li>

            <li>
              <a href="/admin-dashboard/anomaly" className={styles.menuItem}>
                <img src="/icons/anomaly.png" className={styles.menuIconImage} />
                Anomaly Detections
              </a>
            </li>

            <li>
              <a href="/admin-dashboard/analytics" className={styles.menuItem}>
                <img src="/icons/report.png" className={styles.menuIconImage} />
                Report & Analytics
              </a>
            </li>

            <li>
              <a href="/admin-dashboard/leave" className={styles.menuItem}>
                <img src="/icons/leave.png" className={styles.menuIconImage} />
                Leave Management
              </a>
            </li>

            <li>
              <a href="/" className={styles.menuItem}>
                <img src="/icons/logout.png" className={styles.menuIconImage} />
                Logout
              </a>
            </li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Edit Users</h1>

          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <h3 className={styles.sectionTitle}>User Details</h3>

              <div className={styles.topFormSection}>
                {/* LEFT */}
                <div className={styles.column}>
                  <div className={styles.formGroup}>
                    <label>Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} className={styles.input} />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Employee ID</label>
                    <input name="employeeId" value={formData.employeeId} readOnly className={styles.input} />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Address</label>
                    <input name="address" value={formData.address} onChange={handleChange} className={styles.input} />
                  </div>

                  <div className={styles.formGroup}>
                    <label>CV</label>
                    <div className={styles.fileInputContainer}>
                      <span className={styles.filePlaceholder}>Attach Employee CV as pdf</span>
                      <img src="/icons/attach.png" className={styles.attachIcon} />
                      <input type="file" className={styles.fileInput} accept=".pdf" />
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className={styles.column}>
                  <div className={styles.formGroup}>
                    <label>Contact Number</label>
                    <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={styles.input} />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className={styles.select}>
                      <option>Employee</option>
                      <option>Admin</option>
                      <option>HR</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Job</label>
                    <input name="job" value={formData.job} onChange={handleChange} className={styles.input} />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Job Type</label>
                    <select name="jobType" value={formData.jobType} onChange={handleChange} className={styles.select}>
                      <option>Academic</option>
                      <option>Non-academic</option>
                    </select>
                  </div>
                </div>
              </div>

              <h3 className={styles.sectionTitle}>Login Credentials</h3>
              <div className={styles.credentialRow}>
                <div className={styles.formGroup}>
                  <label>Username</label>
                  <input name="username" value={formData.username} onChange={handleChange} className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input name="email" value={formData.email} onChange={handleChange} className={styles.input} />
                </div>
              </div>

              <h3 className={styles.sectionTitle}>Change Password (Optional)</h3>
              <div className={styles.credentialRow}>
                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={styles.input} />
                </div>
              </div>

              <button type="submit" className={styles.updateBtn}>UPDATE</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
