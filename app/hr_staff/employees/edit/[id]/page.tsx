"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
<<<<<<< HEAD
import { ArrowLeft } from 'lucide-react';
import styles from './edit.module.css';

// Mock data (This would eventually come from your Java Backend)
const initialEmployees = [
  { id: '001', name: 'S.Perera', department: 'it', position: 'officer', contact: '0786543211', nic: '312456789087', dob: '2000-08-09', gender: 'Male', email: 'Perera@gmail.com', dateJoined: '2020-05-01', employeeType: 'Academic' },
  { id: '002', name: 'M.Silva', department: 'finance', position: 'Officer', contact: '0756543211', nic: '452456789088', dob: '1998-04-12', gender: 'Female', email: 'Silva@gmail.com', dateJoined: '2021-02-15', employeeType: 'Non-academic' },
  { id: '003', name: 'K.Dias', department: 'management', position: 'Officer', contact: '0756873211', nic: '982456789089', dob: '1999-11-12', gender: 'Male', email: 'Dias@gmail.com', dateJoined: '2019-10-10', employeeType: 'Non-academic' },
];

const EditEmployeePage = () => {
  const router = useRouter();
  const params = useParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  
  const [formData, setFormData] = useState({
    name: '', nic: '', dob: '', gender: '', contact: '',
    email: '', employeeId: '', department: '', position: '',
    dateJoined: '', employeeType: ''
  });

  useEffect(() => {
    const employee = initialEmployees.find(emp => emp.id === params.id);
    if (employee) {
      setFormData({
        name: employee.name,
        nic: employee.nic,
        dob: employee.dob,
        gender: employee.gender,
        contact: employee.contact,
        email: employee.email,
        employeeId: employee.id,
        department: employee.department,
        position: employee.position,
        dateJoined: employee.dateJoined,
        employeeType: employee.employeeType
      });
=======
import styles from './edit.module.css';

const EditEmployeePage = () => {
  const router = useRouter();
  const params = useParams();
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ contact?: string; email?: string }>({});
  
  // Initializing state with empty strings. 
  // Added 'username' to the state to prevent "null" errors during database update.
  const [formData, setFormData] = useState({
    name: '', 
    nic: '', 
    dob: '', 
    gender: '', 
    contact: '',
    email: '', 
    employeeId: '', 
    department: '', 
    position: '',
    dateJoined: '', 
    employeeType: '',
    username: '' // Vital field for the backend update query
  });

  // 1. Fetch Employee Data from Backend on page load
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:2027/api/employees/${params.id}`);
        const result = await response.json();
        
        if (result.success) {
          const emp = result.data;
          
          // Map backend response fields to frontend state keys
          setFormData({
            name: emp.name || '',
            nic: emp.nic || '', 
            dob: emp.dob || '',
            gender: emp.gender || '',
            contact: emp.contactNumber || '', 
            email: emp.email || '',
            employeeId: emp.employeeId ? emp.employeeId.toString() : '',
            department: emp.department || '',
            position: emp.job || '',
            dateJoined: emp.dateJoined || '',
            employeeType: emp.jobType || '',
            username: emp.username || '' // Ensure username is stored even if hidden
          });
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    if (params.id) {
      fetchEmployee();
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
<<<<<<< HEAD
    setFormData(prev => ({ ...prev, [name]: value }));
=======

    // Contact Number Validation: Only digits and max 10 characters
    if (name === "contact") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors when user types
    if (errors.contact || errors.email) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    setStatus('loading');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus('success');
    setTimeout(() => {
        setStatus('idle');
        router.push('/hr_staff/employees'); // Redirect back to list after update
    }, 2000);
  };

  if (!formData.employeeId) return <div className={styles.loading}>Loading Data...</div>;

  return (
    <div className={styles.container}>
=======
    
    // Manual Validation for contact and email
    let validationErrors: { contact?: string; email?: string } = {};
    if (formData.contact.length !== 10) {
      validationErrors.contact = "Contact number must be exactly 10 digits.";
    }
    if (!formData.email.includes('@')) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');

    // 2. Prepare Payload for PUT Request
    // Added 'username' to satisfy the [Column 'username' cannot be null] constraint.
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
      username: formData.username // Required by backend database constraints
    };

    try {
      const response = await fetch(`http://localhost:2027/api/employees/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        // Redirect to employee list after successful update
        setTimeout(() => {
          setStatus('idle');
          router.push('/hr_staff/employees'); 
        }, 2000);
      } else {
        setStatus('error');
        // Display backend error message if update fails
        alert("Update failed: " + (result.message || "Check console for details"));
        console.error("Backend Error Details:", result);
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error("Update request error:", error);
      setStatus('error');
    }
  };

  // Show loading state until data is successfully fetched
  if (!formData.name && status !== 'error') return <div className={styles.loading}>Loading Data...</div>;

  return (
    <div className={styles.container}>
      {/* Success Notification Popup Overlay */}
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
      {status === 'success' && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Details updated successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.title}>Employee Data</h1>
<<<<<<< HEAD
      
      <div className={styles.subHeader}>
        {/*<button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={24} color="white" />
        </button>*/}
=======
      <div className={styles.subHeader}>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
        <h2 className={styles.subtitle}>Edit Employee</h2>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          
<<<<<<< HEAD
          {/* Personal Information */}
=======
          {/* Section 1: Personal Information */}
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Personal Information</h3>
            
            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Name:</label>
              <input type="text" name="name" value={formData.name} className={styles.whiteInput} onChange={handleChange} required />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>NIC:</label>
              <input type="text" name="nic" value={formData.nic} className={styles.whiteInput} readOnly />
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
<<<<<<< HEAD
=======
              {errors.contact && <span style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '4px' }}>{errors.contact}</span>}
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Email:</label>
              <input type="email" name="email" value={formData.email} className={styles.whiteInput} onChange={handleChange} required />
<<<<<<< HEAD
            </div>
          </div>

          {/* Job Information */}
=======
              {errors.email && <span style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '4px' }}>{errors.email}</span>}
            </div>
          </div>

          {/* Section 2: Job Information */}
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Job Information</h3>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Employee ID:</label>
              <input type="text" name="employeeId" value={formData.employeeId} className={styles.whiteInput} readOnly />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Department:</label>
              <select name="department" value={formData.department} className={styles.whiteInput} onChange={handleChange} required>
<<<<<<< HEAD
                <option value="it">IT</option>
                <option value="management">Management</option>
                <option value="finance">Finance</option>
=======
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="Management">Management</option>
                <option value="Finance">Finance</option>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
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
<<<<<<< HEAD
=======
                <option value="">Select Type</option>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
                <option value="Academic">Academic</option>
                <option value="Non-academic">Non-academic</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.submitBtn} 
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Updating...' : 'Update Employee Details'}
        </button>
      </form>
    </div>
  );
};

export default EditEmployeePage;