"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      {status === 'success' && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <div className={styles.successIcon}>✔</div>
            <p>Details updated successfully!</p>
          </div>
        </div>
      )}

      <h1 className={styles.title}>Employee Data</h1>
      
      <div className={styles.subHeader}>
        {/*<button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={24} color="white" />
        </button>*/}
        <h2 className={styles.subtitle}>Edit Employee</h2>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          
          {/* Personal Information */}
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
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Email:</label>
              <input type="email" name="email" value={formData.email} className={styles.whiteInput} onChange={handleChange} required />
            </div>
          </div>

          {/* Job Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Job Information</h3>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Employee ID:</label>
              <input type="text" name="employeeId" value={formData.employeeId} className={styles.whiteInput} readOnly />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Department:</label>
              <select name="department" value={formData.department} className={styles.whiteInput} onChange={handleChange} required>
                <option value="it">IT</option>
                <option value="management">Management</option>
                <option value="finance">Finance</option>
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