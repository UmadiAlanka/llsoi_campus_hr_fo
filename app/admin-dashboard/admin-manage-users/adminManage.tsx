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
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [loading, setLoading] = useState(true);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:2027/api/employees");
      
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setUsers(result.data);
      } else {
        throw new Error(result.message || "Invalid data format received");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Failed to load employees. Please ensure the Backend is running on port 2027.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= DELETE USER =================
  const handleDelete = async (employeeId: string) => {
    if (!confirm(`Are you sure you want to delete employee ${employeeId}?`)) return;

    try {
      const res = await fetch(`http://localhost:2027/api/employees/${employeeId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setUsers((prev) => prev.filter((u) => u.employeeId !== employeeId));
      alert("Employee deleted successfully!");
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Error deleting employee. Please try again.");
    }
  };

  // ================= SEARCH FILTER LOGIC =================
  // This filters the users list based on Name or Employee ID
  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) || 
      user.employeeId.toString().toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
    );
  });

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
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/Logo.png" alt="Logo" className={styles.headerLogo} />
          <h2 className={styles.brandName}>
            LLSOI Campus HR <span>Management System</span>
          </h2>
        </div>
        <div className={styles.adminProfile}>
          <img src="/icons/user-profile.png" alt="Admin" className={styles.adminAvatar} />
          <span>Admin</span>
        </div>
      </header>

      <div className={styles.layoutBody}>
        <aside className={styles.sidebar}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                      href={item.href}
                      className={`${styles.menuItem} ${item.active ? styles.active : ""}`}
                    >
                  <img src={item.icon} alt={item.name} className={styles.menuIconImage} />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Manage Users</h1>

          <div className={styles.contentContainer}>
            <div className={styles.actionBar}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search Employee: Name / ID"
                  className={styles.searchInput}
                  value={searchTerm} // Bind input to state
                  onChange={(e) => setSearchTerm(e.target.value)} // Update state on change
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

            {loading ? (
              <div className={styles.loadingContainer}>
                <p>Loading employees...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className={styles.noData}>No employees match your search.</p>
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
                  {/* Map over filteredUsers instead of the full users array */}
                  {filteredUsers.map((u) => (
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