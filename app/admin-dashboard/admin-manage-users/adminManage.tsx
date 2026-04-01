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
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:2027/api/employees");
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) setUsers(result.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (employeeId: string) => {
    if (!confirm(`Delete employee ${employeeId}?`)) return;
    try {
      await fetch(`http://localhost:2027/api/employees/${employeeId}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.employeeId !== employeeId));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = searchTerm.toLowerCase();
    return user.name.toLowerCase().includes(q) || user.employeeId.toString().includes(q) || user.username.toLowerCase().includes(q);
  });

  return (
    <>
      <h2 className={styles.pageTitle}>Manage Users</h2>

      <div className={styles.contentContainer}>
        <div className={styles.actionBar}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search by Name / ID / Username"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={styles.searchButton}>
              <img src="/icons/search.png" alt="Search" style={{ width: 20 }} />
            </button>
          </div>
          <Link href="/admin-dashboard/admin-manage-users/add-user" className={styles.addUserBtn}>
            + ADD USER
          </Link>
        </div>

        {loading ? (
          <p style={{ padding: 20 }}>Loading employees...</p>
        ) : filteredUsers.length === 0 ? (
          <p style={{ padding: 20 }}>No employees found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Username</th><th>Email</th>
                  <th>Role</th><th>Job</th><th>Type</th><th>Contact</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
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
                        <Link href={`/admin-dashboard/admin-manage-users/edit-user/${u.employeeId}`} className={styles.editButton}>EDIT</Link>
                        <button onClick={() => handleDelete(u.employeeId)} className={styles.deleteButton}>DELETE</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}