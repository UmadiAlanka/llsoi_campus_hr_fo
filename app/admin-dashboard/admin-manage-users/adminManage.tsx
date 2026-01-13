"use client";

import React, { useEffect, useState } from "react";
import styles from "./adminManage.module.css";
import Link from "next/link";

interface UserData {
  employeeId: string;
  name: string;
  username: string;
  email: string;
  role: string;
  job: string;
  jobType: string;
  contactNumber: string;
}

export default function AdminManage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:2027/api/employees");
      const result = await res.json();

      console.log("Employees:", result);

      if (!res.ok || !Array.isArray(result.data)) {
        throw new Error("Invalid response");
      }

      setUsers(result.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= DELETE USER =================
  const handleDelete = async (employeeId: string) => {
    if (!confirm(`Delete employee ${employeeId}?`)) return;

    try {
      const res = await fetch(`http://localhost:2027/api/employees/${employeeId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error("Delete failed");
      }

      setUsers((prev) => prev.filter((u) => u.employeeId !== employeeId));
      alert("Employee deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: "/icons/home.png", href: "/admin-dashboard" },
    { name: "Manage Users", icon: "/icons/user.png", href: "/admin-dashboard/admin-manage-users", active: true },
    { name: "Attendance", icon: "/icons/dattendance.png", href: "/admin-dashboard/admin-attendance" },
    { name: "Salary & Pay Slip", icon: "/icons/dsalary.png", href: "/admin-dashboard/salary" },
    { name: "Anomaly Detections", icon: "/icons/anomaly.png", href: "/admin-dashboard/anomaly" },
    { name: "Report & Analytics", icon: "/icons/report.png", href: "/admin-dashboard/analytics" },
    { name: "Leave Management", icon: "/icons/leave.png", href: "/admin-dashboard/leave" },
    { name: "Logout", icon: "/icons/logout.png", href: "/" },
  ];

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
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`${styles.menuItem} ${item.active ? styles.activeItem : ""}`}
                >
                  <img src={item.icon} className={styles.menuIconImage} />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN */}
        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Manage Users</h1>

          <div className={styles.contentContainer}>
            <div className={styles.actionBar}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search Employee: Name / ID"
                  className={styles.searchInput}
                />
                <button className={styles.searchButton}>
                  <img src="/icons/search.png" />
                </button>
              </div>

              <Link
                href="/admin-dashboard/admin-manage-users/add-user"
                className={styles.addUserBtn}
              >
                ADD USER +
              </Link>
            </div>

            {loading ? (
              <p>Loading employees...</p>
            ) : (
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Job</th>
                    <th>Job Type</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.employeeId}>
                      <td>{u.employeeId}</td>
                      <td>{u.name}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.job}</td>
                      <td>{u.jobType}</td>
                      <td>{u.contactNumber}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <Link
                            href={`/admin-dashboard/admin-manage-users/edit-user/${u.employeeId}`}
                            className={styles.editButton}
                          >
                            EDIT
                          </Link>
                          <button
                            onClick={() => handleDelete(u.employeeId)}
                            className={styles.deleteButton}
                          >
                            DELETE
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
