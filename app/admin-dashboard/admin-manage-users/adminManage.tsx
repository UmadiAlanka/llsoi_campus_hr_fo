"use client";

<<<<<<< HEAD
import React, { useState } from 'react';
import styles from './adminManage.module.css';
import Link from 'next/link';

// Data Interface for a User
interface UserData {
  id: string;
=======
import React, { useEffect, useState } from "react";
import styles from "./adminManage.module.css";
import Link from "next/link";
import MessageBox from "../components/MessageBox"; 

interface UserData {
  employeeId: string;
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
  name: string;
  username: string;
  email: string;
  role: string;
  job: string;
  jobType: string;
  contactNumber: string;
}

<<<<<<< HEAD
const adminManage: React.FC = () => {
  // Sample Data
  const [users] = useState<UserData[]>([
    {
      id: 'LLSOI-0001',
      name: 'A.A.Induja',
      username: 'anduni',
      email: 'anduniinduja@gmail.com',
      role: 'Employee',
      job: 'Student Coordinator',
      jobType: 'Non-academic',
      contactNumber: '077-1234567',
    },
    {
      id: 'LLSOI-0002',
      name: 'B.B.Bandara',
      username: 'bandara',
      email: 'bandara@gmail.com',
      role: 'Employee',
      job: 'Lecturer',
      jobType: 'Academic',
      contactNumber: '071-9876543',
    },
  ]);

  const menuItems = [
    { name: 'Dashboard', icon: '/icons/home.png', active: false, href: '/admin-dashboard/Dashboard' },
    { name: 'Manage Users', icon: '/icons/user.png', active: true, href: '/manage-users' },
    { name: 'Attendence', icon: '/icons/dattendance.png', active: false, href: '/attendance' },
    { name: 'Salary & Pay Slip', icon: '/icons/dsalary.png', active: false, href: '/salary' },
    { name: 'Anomaly Detections', icon: '/icons/anomaly.png', active: false, href: '/anomaly' },
    { name: 'Report & Analytics', icon: '/icons/report.png', active: false, href: '/analytics' },
    { name: 'Leave management', icon: '/icons/leave.png', active: false, href: '/leave' },
    { name: 'Logout', icon: '/icons/logout.png', active: false, href: '/logout' },
  ];

  return (
    <div className={styles.container}>
      {/* --- Header --- */}
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
        {/* --- Sidebar --- */}
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <ul className={styles.menuList}>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={`${styles.menuItem} ${item.active ? styles.activeItem : ''}`}>
                    <img src={item.icon} alt="" className={styles.menuIconImage} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* --- Main Content --- */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Manage Users</h2>
          
          {/* Translucent Content Container */}
          <div className={styles.contentContainer}>
            
            {/* Action Bar: Search & Add Button */}
            <div className={styles.actionBar}>
              <div className={styles.searchContainer}>
                <input 
                  type="text" 
                  placeholder="Search Employee: Name/ ID" 
                  className={styles.searchInput} 
                />
                <button className={styles.searchButton}>
                  <img src="/icons/search.png" alt="Search" />
                </button>
              </div>
               <Link href="/adminAddUser">
                <button className={styles.addUserBtn}>ADD USER +</button>
               </Link>
              </div>

            {/* User Table */}
            <div className={styles.tableContainer}>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Job</th>
                    <th>Job Type</th>
                    <th>Contact Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
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
                          <Link href={`/adminEditUser.tsx/${user.id}`}>
                          <button className={styles.editButton}>EDIT</button>
                          </Link>
                          <button className={styles.deleteButton}>DELETE</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default adminManage;
=======
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
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
