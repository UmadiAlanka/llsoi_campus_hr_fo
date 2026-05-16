"use client";

import React, { useEffect, useState } from "react";
import styles from "./adminManage.module.css";
import Link from "next/link";
import MessageBox from "../components/MessageBox";

interface UserData {
  id: number;
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

  // Track which ID we want to delete (use numeric id for API call)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error" | "confirm";
    msg: string;
  }>({
    show: false,
    type: "success",
    msg: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:2027/api/employees/all-dto");
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

  // 1. Trigger the confirmation MessageBox
  const handleDeleteClick = (user: UserData) => {
    // Use the numeric `id` field for the actual API call
    setPendingDeleteId(user.id);
    setModal({
      show: true,
      type: "confirm",
      msg: `Are you sure you want to delete employee "${user.name}" (ID: ${user.employeeId})?`,
    });
  };

  // 2. The actual API call — uses numeric database id
  const executeDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      const res = await fetch(`http://localhost:2027/api/employees/${pendingDeleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove from local state using the numeric id
        setUsers((prev) => prev.filter((u) => u.id !== pendingDeleteId));
        setModal({
          show: true,
          type: "success",
          msg: "Employee deleted successfully!",
        });
      } else {
        // Try to parse error message from backend
        let errMsg = "Failed to delete employee.";
        try {
          const errData = await res.json();
          errMsg = errData.message || errMsg;
        } catch {
          // If response isn't JSON (e.g. 500 HTML), use status text
          errMsg = `Server error: ${res.status} ${res.statusText}`;
        }
        setModal({
          show: true,
          type: "error",
          msg: errMsg,
        });
      }
    } catch (err: any) {
      setModal({
        show: true,
        type: "error",
        msg: "Could not connect to server. Make sure the backend is running on port 2027.",
      });
    } finally {
      setPendingDeleteId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.employeeId?.toString().includes(q) ||
      user.username?.toLowerCase().includes(q)
    );
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
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Job</th>
                  <th>Type</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
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
                          onClick={() => handleDeleteClick(u)}
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
          </div>
        )}
      </div>

      {modal.show && (
        <MessageBox
          type={modal.type}
          message={modal.msg}
          onClose={() => setModal({ ...modal, show: false })}
          onConfirm={modal.type === "confirm" ? executeDelete : undefined}
        />
      )}
    </>
  );
}