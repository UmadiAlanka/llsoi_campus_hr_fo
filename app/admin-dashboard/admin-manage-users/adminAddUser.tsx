"use client";

import React, { useState } from 'react';
import styles from './adminAddUser.module.css';
import Link from 'next/link';

const AddUser: React.FC = () => {
  // State for form fields
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

  // Sidebar menu items, with 'Manage Users' active
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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Add your backend API call here
    alert("User registration logic would go here.");
  };

  return (
    <div className={styles.container}>
      {/* Header - Same as other pages */}
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
        {/* Sidebar - Same as other pages */}
        <aside className={styles.sidebar}>
          <nav>
            <ul className={styles.menuList}>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className={`${styles.menuItem} ${item.active ? styles.activeItem : ''}`}
                  >
                    <img src={item.icon} alt="" className={styles.menuIconImage} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content - Add User Form */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Add Users</h2>
          
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <div className={styles.topFormSection}>
                
                {/* Left Column: User Details */}
                <div className={styles.formColumn}>
                  <h3 className={styles.sectionTitle}>User Details</h3>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Employee ID:</label>
                    <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} className={styles.input} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Address:</label>
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
                
                {/* Right Column: Contact & Job Details */}
                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Contact Number:</label>
                    {/* This input has a special class for the blue focus style shown in the image */}
                    <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={`${styles.input} ${styles.focusBlue}`} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Role:</label>
                    <select name="role" value={formData.role} onChange={handleChange} className={styles.select}>
                      <option value="Employee">Employee</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Job:</label>
                    <input type="text" name="job" value={formData.job} onChange={handleChange} className={styles.input} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Job Type:</label>
                    <select name="jobType" value={formData.jobType} onChange={handleChange} className={styles.select}>
                      <option value="Academic">Academic</option>
                      <option value="Non-academic">Non-academic</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Login Credentials */}
              <div className={styles.bottomFormSection}>
                <h3 className={styles.sectionTitle}>Login Credentials</h3>
                <div className={styles.credentialsGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Adderss:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Confirm password:</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={styles.input} />
                  </div>
                </div>
              </div>

              <button type="submit" className={styles.registerBtn}>REGISTER</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddUser;