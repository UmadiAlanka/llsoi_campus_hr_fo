"use client";

import React, { useState } from 'react';
import styles from './adminManage.module.css';
import Link from 'next/link';

// Data Interface for a User
interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  job: string;
  jobType: string;
  contactNumber: string;
}

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