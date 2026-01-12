"use client";

import React, { useEffect, useState } from "react";
import styles from "./adminManage.module.css";
import Link from "next/link";

interface UserData {
  dbId: number;            // Database ID (emp_id)
  id: string;              // Employee ID (EMP-001)
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:2027/api/employees");
      const data = await res.json();

      const mappedUsers = data.map((emp: any) => ({
        dbId: emp.id,              // for delete
        id: emp.employeeId,        // shown in UI
        name: emp.name,
        username: emp.username,
        email: emp.email,
        role: emp.role,
        job: emp.job,
        jobType: emp.jobType,
        contactNumber: emp.contactNumber,
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE FUNCTION MUST BE INSIDE COMPONENT
const handleDelete = async (dbId: number) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(`http://localhost:2027/api/employees/${dbId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Delete failed");
    }

    // Remove deleted user from UI
    setUsers(prev => prev.filter(user => user.dbId !== dbId));
    alert("User deleted successfully");

  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete user");
  }
};

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

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/Logo.png" alt="LLSOI Logo" className={styles.headerLogo} />
          <h1 className={styles.brandName}>
            LLSOI Campus HR <span>Management System</span>
          </h1>
        </div>
        <div className={styles.adminProfile}>
          <img src="/icons/user-profile.png" alt="Admin" className={styles.adminAvatar} />
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
                  <img src={item.icon} alt="" className={styles.menuIconImage} />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Manage Users</h2>

          <div className={styles.contentContainer}>
            <div className={styles.actionBar}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search Employee: Name / ID"
                  className={styles.searchInput}
                />
                <button className={styles.searchButton}>
                  <img src="/icons/search.png" alt="Search" />
                </button>
              </div>

              <Link
                href="/admin-dashboard/admin-manage-users/add-user"
                className={styles.addUserBtn}
              >
                ADD USER +
              </Link>
            </div>

            <div className={styles.tableContainer}>
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
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center" }}>
                          No employees found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.dbId}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>{user.job}</td>
                          <td>{user.jobType}</td>
                          <td>{user.contactNumber}</td>
                          <td>
                            <div className={styles.actionButtons}>
                              <Link
                                href={`/admin-dashboard/admin-manage-users/edit-user/${user.dbId}`}
                                className={styles.editButton}
                              >
                                EDIT
                              </Link>
                              <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(user.dbId)}
                              >
                                DELETE
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
