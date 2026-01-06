"use client";

import React, { useState, useEffect } from 'react';
import styles from './adminEditUser.module.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const adminEditUser: React.FC = () => {
  const params = useParams();
  const userId = params.id; // Gets the ID from the URL

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    address: '',
    contactNumber: '',
    role: 'Employee',
    job: '',
    jobType: 'Academic',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Mock effect to "fetch" user data based on the ID
  useEffect(() => {
    if (userId) {
      // In a real app, you would fetch data from an API here
      setFormData(prev => ({
        ...prev,
        employeeId: String(userId),
        name: 'A.A.Induja', // Example pre-filled data
        username: 'anduni',
        email: 'anduniinduja@gmail.com'
      }));
    }
  }, [userId]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/Logo.png" alt="Logo" className={styles.headerLogo} />
          <h1 className={styles.brandName}>LLSOI Campus HR <span>Management System</span></h1>
        </div>
        <div className={styles.adminProfile}>
          <img src="/icons/user-profile.png" alt="Admin" className={styles.adminAvatar} />
          <span className={styles.userName}>Admin</span>
        </div>
      </header>

      <div className={styles.layoutBody}>
        <aside className={styles.sidebar}>
          <nav>
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

        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Edit Users</h2>
          
          <div className={styles.formCard}>
            <form>
              <h3 className={styles.sectionTitle}>User Details</h3>
              <div className={styles.topFormSection}>
                {/* Left Column */}
                <div className={styles.column}>
                  <div className={styles.formGroup}>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Employee ID:</label>
                    <input type="text" name="employeeId" value={formData.employeeId} readOnly className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Address:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>CV:</label>
                    <div className={styles.fileInputContainer}>
                      <span className={styles.filePlaceholder}>Attach Employee CV as pdf</span>
                      <img src="/icons/attach.png" alt="attach" className={styles.attachIcon} />
                      <input type="file" name="cv" className={styles.fileInput} accept=".pdf" />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className={styles.column}>
                  <div className={styles.formGroup}>
                    <label>Contact Number:</label>
                    <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Role:</label>
                    <select name="role" value={formData.role} onChange={handleChange} className={styles.select}>
                      <option>Employee</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Job:</label>
                    <input type="text" name="job" value={formData.job} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Job Type:</label>
                    <select name="jobType" value={formData.jobType} onChange={handleChange} className={styles.select}>
                      <option>Academic</option>
                      <option>Non-academic</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Login Credentials Section - Side by Side as per screenshot */}
              <h3 className={styles.sectionTitle}>Login Credentials</h3>
              <div className={styles.credentialRow}>
                <div className={styles.formGroup}>
                  <label>Username:</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Adderss:</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} />
                </div>
              </div>

              {/* Password Section */}
              <h3 className={styles.sectionTitle}>Change Password(optional)</h3>
              <div className={styles.credentialRow}>
                <div className={styles.formGroup}>
                  <label>Password:</label>
                  <input type="password" name="password" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Confirm password:</label>
                  <input type="password" name="confirmPassword" className={styles.input} />
                </div>
              </div>

              <button type="submit" className={styles.updateBtn}>UPDATE</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default adminEditUser;