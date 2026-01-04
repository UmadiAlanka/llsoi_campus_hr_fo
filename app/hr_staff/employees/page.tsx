"use client";

import React, { useState } from 'react';
import styles from './employees.module.css';
import { Search } from 'lucide-react'; // Optional: npm install lucide-react

// Mock Data based on your screenshot
const initialEmployees = [
  { id: '001', name: 'S.Perera', department: 'IT', position: 'Officer', contact: '0786543211', nic: '312456789087', dob: '09/08/2000', gender: 'male', email: 'Perera@gmail.com', dateJoined: '01/05/2020' },
  { id: '002', name: 'M.Silva', department: 'Management', position: 'Officer', contact: '0756543211', nic: '452456789088', dob: '12/04/1998', gender: 'female', email: 'Silva@gmail.com', dateJoined: '15/02/2021' },
  { id: '003', name: 'K.Dias', department: 'IT', position: 'Officer', contact: '0756873211', nic: '982456789089', dob: '22/11/1999', gender: 'male', email: 'Dias@gmail.com', dateJoined: '10/10/2019' },
];

export default function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(initialEmployees[0]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Employee Data</h1>

      <div className={styles.contentWrapper}>
        {/* Left Section: Table and Search */}
        <div className={styles.tableSection}>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search Employee: Name/ ID" />
            <button className={styles.searchBtn}><Search size={18} /></button>
          </div>

          <div className={styles.filters}>
            <select><option>Department</option></select>
            <select><option>Job Role</option></select>
            <select><option>Type</option></select>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.employeeTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {initialEmployees.map((emp) => (
                  <tr 
                    key={emp.id} 
                    onClick={() => setSelectedEmployee(emp)}
                    className={selectedEmployee.id === emp.id ? styles.activeRow : ''}
                  >
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>{emp.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className={styles.addBtn}>Add New Employee</button>
          </div>
        </div>

        {/* Right Section: Employee Details */}
        <aside className={styles.detailsSidebar}>
          <h3>Employee Details</h3>
          <div className={styles.detailsCard}>
            <section>
              <h4>Personal Information</h4>
              <div className={styles.infoRow}><span>Name</span> <span>{selectedEmployee.name}</span></div>
              <div className={styles.infoRow}><span>NIC</span> <span>{selectedEmployee.nic}</span></div>
              <div className={styles.infoRow}><span>DOB</span> <span>{selectedEmployee.dob}</span></div>
              <div className={styles.infoRow}><span>Gender</span> <span>{selectedEmployee.gender}</span></div>
              <div className={styles.infoRow}><span>Contact</span> <span>{selectedEmployee.contact}</span></div>
              <div className={styles.infoRow}><span>Email</span> <span>{selectedEmployee.email}</span></div>
            </section>

            <section>
              <h4>Job Information</h4>
              <div className={styles.infoRow}><span>Employee ID</span> <span>{selectedEmployee.id}</span></div>
              <div className={styles.infoRow}><span>Department</span> <span>{selectedEmployee.department}</span></div>
              <div className={styles.infoRow}><span>Position</span> <span>{selectedEmployee.position}</span></div>
              <div className={styles.infoRow}><span>Date joined</span> <span>{selectedEmployee.dateJoined}</span></div>
            </section>

            <button className={styles.editBtn}>Edit Employee</button>
          </div>
        </aside>
      </div>
    </div>
  );
}