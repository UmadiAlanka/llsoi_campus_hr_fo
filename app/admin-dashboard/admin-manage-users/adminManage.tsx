"use client";

import React, { useEffect, useState } from "react";
import styles from "./adminManage.module.css";
import Link from "next/link";
import MessageBox from "../components/MessageBox"; 

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
  
  // Track which ID we want to delete
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error" | "confirm"; // Added confirm type
    msg: string;
  }>({
    show: false,
    type: "success",
    msg: "",
  });

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

  // 1. Trigger the confirmation MessageBox
  const handleDeleteClick = (employeeId: string) => {
    setPendingDeleteId(employeeId);
    setModal({
      show: true,
      type: "confirm",
      msg: `Are you sure you want to delete employee ${employeeId}?`
    });
  };

  // 2. The actual API call (Runs when "Yes, Delete" is clicked)
  const executeDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      const res = await fetch(`http://localhost:2027/api/employees/${pendingDeleteId}`, { 
        method: "DELETE" 
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.employeeId !== pendingDeleteId));
        setModal({ 
          show: true, 
          type: "success", 
          msg: "Employee deleted successfully!" 
        });
      } else {
        throw new Error("Failed to delete user.");
      }
    } catch (err: any) {
      setModal({ 
        show: true, 
        type: "error", 
        msg: err.message || "Error deleting employee." 
      });
    } finally {
      setPendingDeleteId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) || 
      user.employeeId.toString().includes(q) || 
      user.username.toLowerCase().includes(q)
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
                        {/* Updated onClick to use our new trigger */}
                        <button onClick={() => handleDeleteClick(u.employeeId)} className={styles.deleteButton}>DELETE</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* The Beautiful Modal */}
      {modal.show && (
        <MessageBox 
          type={modal.type} 
          message={modal.msg} 
          onClose={() => setModal({ ...modal, show: false })} 
          onConfirm={executeDelete} // Only fires if type is 'confirm'
        />
      )}
    </>
  );
}