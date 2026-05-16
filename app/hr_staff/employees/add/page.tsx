"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouter import කරගන්න
import styles from './add.module.css';

const AddEmployeePage = () => {
  const router = useRouter(); // router object එක සාදාගන්න
  
  // Status can be idle, loading, success, or error
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '', nic: '', dob: '', gender: '', contact: '',
    email: '', department: '', position: '',
    dateJoined: '', employeeType: '', username: '', password: ''
  });

  // State for validation errors
  const [errors, setErrors] = useState<{ contact?: string; email?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "contact") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors.contact || errors.email) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let validationErrors: { contact?: string; email?: string } = {};

    if (formData.contact.length !== 10) {
      validationErrors.contact = "Contact number must be exactly 10 digits.";
    }

    if (!formData.email.includes('@')) {
      validationErrors.email = "Please enter a valid email address containing '@'.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus('loading');

    const payload = {
      name: formData.name,
      nic: formData.nic,
      dob: formData.dob,
      gender: formData.gender,
      contactNumber: formData.contact,
      email: formData.email,
      department: formData.department,
      job: formData.position,          
      dateJoined: formData.dateJoined,
      jobType: formData.employeeType,  
      role: "EMPLOYEE",                
      username: formData.username,     
      password: formData.password      
    };

    try {
      const response = await fetch('http://localhost:2027/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({
          name: '', nic: '', dob: '', gender: '', contact: '',
          email: '', department: '', position: '',
          dateJoined: '', employeeType: '', username: '', password: ''
        });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        alert("Error: " + (result.message || "Operation failed"));
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className={styles.container}>
      {/* Success Popup Message */}
      {status === 'success' && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Employee added successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.title}>Employee Data</h1>
      <h2 className={styles.subtitle}>Add New Employee</h2>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          
          {/* Left Column: Personal Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Personal Information</h3>
            
            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Name:</label>
              <input type="text" name="name" value={formData.name} className={styles.whiteInput} onChange={handleChange} required />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>NIC:</label>
              <input type="text" name="nic" value={formData.nic} className={styles.whiteInput} onChange={handleChange} required />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Date Of Birth:</label>
              <input type="date" name="dob" value={formData.dob} className={styles.whiteInput} onChange={handleChange} required />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Gender:</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female
                </label>
              </div>
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Contact Number:</label>
              <input type="text" name="contact" value={formData.contact} className={styles.whiteInput} onChange={handleChange} required />
              {errors.contact && <span style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '4px' }}>{errors.contact}</span>}
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Email:</label>
              <input type="email" name="email" value={formData.email} className={styles.whiteInput} onChange={handleChange} required />
              {errors.email && <span style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '4px' }}>{errors.email}</span>}
            </div>
          </div>

          {/* Right Column: Job & Account Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Job Information</h3>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Department:</label>
              <select name="department" value={formData.department} className={styles.whiteInput} onChange={handleChange} required>
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="Management">Management</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Position:</label>
              <input type="text" name="position" value={formData.position} className={styles.whiteInput} onChange={handleChange} required />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Date Joined:</label>
              <input type="date" name="dateJoined" value={formData.dateJoined} className={styles.whiteInput} onChange={handleChange} required />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Employee Type:</label>
              <select name="employeeType" value={formData.employeeType} className={styles.whiteInput} onChange={handleChange} required>
                <option value="">Select Employee Type</option>
                <option value="Academic">Academic</option>
                <option value="Non-academic">Non-academic</option>
              </select>
            </div>

            <h3 className={styles.sectionTitle} style={{ marginTop: '24px' }}>Account Information</h3>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Username:</label>
              <input type="text" name="username" value={formData.username} className={styles.whiteInput} onChange={handleChange} required />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Password:</label>
              <input type="password" name="password" value={formData.password} className={styles.whiteInput} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.submitBtn} 
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Saving...' : 'Add New Employee'}
        </button>
      </form>

     
      <div className={styles.backButtonContainer}>
        <button 
          type="button" 
          className={styles.backBtn} 
          onClick={() => router.push('/hr_staff/employees')}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AddEmployeePage;