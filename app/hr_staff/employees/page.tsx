"use client";

import React, { useState, useMemo, useEffect } from 'react';
import styles from './employees.module.css';
import { Search } from 'lucide-react';
import Link from 'next/link';

<<<<<<< HEAD
const initialEmployees = [
  { id: '001', name: 'S.Perera', department: 'IT', position: 'Lecturer', contact: '0786543211', nic: '312456789087', dob: '09/08/2000', gender: 'male', email: 'Perera@gmail.com', dateJoined: '01/05/2020', type: 'Academic' },
  { id: '002', name: 'M.Silva', department: 'Management', position: 'Officer', contact: '0756543211', nic: '452456789088', dob: '12/04/1998', gender: 'female', email: 'Silva@gmail.com', dateJoined: '15/02/2021', type: 'Non-academic' },
  { id: '003', name: 'K.Dias', department: 'IT', position: 'Officer', contact: '0756873211', nic: '982456789089', dob: '22/11/1999', gender: 'male', email: 'Dias@gmail.com', dateJoined: '10/10/2019', type: 'Non-academic' },
];

export default function EmployeesPage() {
=======
export default function EmployeesPage() {
  // 1. State for data and loading status
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
<<<<<<< HEAD
  
  // 1. Start as null so the right panel is empty on load
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  const filteredEmployees = useMemo(() => {
    return initialEmployees.filter((emp) => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        emp.id.includes(searchQuery);
      
      const matchesDept = deptFilter === '' || emp.department === deptFilter;
      const matchesRole = roleFilter === '' || emp.position === roleFilter;
      const matchesType = typeFilter === '' || emp.type === typeFilter;

      return matchesSearch && matchesDept && matchesRole && matchesType;
    });
  }, [searchQuery, deptFilter, roleFilter, typeFilter]);

  // 2. UPDATED LOGIC:
  // This ONLY clears the selection if the selected employee is filtered out.
  // It no longer forces the first employee to be selected on load.
  useEffect(() => {
    if (selectedEmployee) {
      const isStillVisible = filteredEmployees.some(emp => emp.id === selectedEmployee.id);
=======
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  // 2. Fetch data from Backend API (Port 2027)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Fetching from the new DTO endpoint we created
        const response = await fetch('http://localhost:2027/api/employees/all-dto');
        const result = await response.json();
        
        if (result.success) {
          // Setting the data array to the state
          setEmployees(result.data);
        }
      } catch (error) {
        console.error("English: Error fetching data from backend", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // 3. Filter Logic (Using 'employees' state)
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        emp.employeeId.includes(searchQuery);
      
      const matchesDept = deptFilter === '' || emp.department === deptFilter;
      const matchesRole = roleFilter === '' || emp.job === roleFilter;
      const matchesType = typeFilter === '' || emp.jobType === typeFilter;

      return matchesSearch && matchesDept && matchesRole && matchesType;
    });
  }, [employees, searchQuery, deptFilter, roleFilter, typeFilter]);

  // 4. Update Selection Logic
  useEffect(() => {
    if (selectedEmployee) {
      const isStillVisible = filteredEmployees.some(emp => emp.employeeId === selectedEmployee.employeeId);
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
      if (!isStillVisible) {
        setSelectedEmployee(null);
      }
    }
  }, [filteredEmployees, selectedEmployee]);

<<<<<<< HEAD
=======
  // Show loading state while waiting for API
  if (loading) {
    return <div className={styles.container}>Loading Employee Data...</div>;
  }

>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Employee Data</h1>

      <div className={styles.contentWrapper}>
        <div className={styles.tableSection}>
          <div className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Search Employee: Name/ ID" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.searchBtn}><Search size={18} /></button>
          </div>

          <div className={styles.filters}>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="">Department (All)</option>
              <option value="IT">IT</option>
              <option value="Management">Management</option>
            </select>
            
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">Job Role (All)</option>
              <option value="Officer">Officer</option>
              <option value="Manager">Manager</option>
              <option value="Lecturer">Lecturer</option>
            </select>

            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">Type (All)</option>
              <option value="Academic">Academic</option>
              <option value="Non-Academic">Non-Academic</option>
            </select>
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
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr 
<<<<<<< HEAD
                      key={emp.id} 
                      onClick={() => setSelectedEmployee(emp)}
                      className={selectedEmployee?.id === emp.id ? styles.activeRow : ''}
                      style={{ cursor: 'pointer' }} // Visual hint that rows are clickable
                    >
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>{emp.position}</td>
                      <td>{emp.contact}</td>
=======
                      key={emp.employeeId} 
                      onClick={() => setSelectedEmployee(emp)}
                      className={selectedEmployee?.employeeId === emp.employeeId ? styles.activeRow : ''}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{emp.employeeId}</td>
                      <td>{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>{emp.job}</td>
                      <td>{emp.contactNumber}</td>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>No employees found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Link href="/hr_staff/employees/add" className={styles.addBtnLink}>
            <button className={styles.addBtn}>Add New Employee</button>
          </Link>
        </div>

        <aside className={styles.detailsSidebar}>
          <h3>Employee Details</h3>
          <div className={styles.detailsCard}>
            {selectedEmployee ? (
              <>
                <section>
                  <h4>Personal Information</h4>
                  <div className={styles.infoRow}><span>Name</span> <span>{selectedEmployee.name}</span></div>
<<<<<<< HEAD
                  <div className={styles.infoRow}><span>NIC</span> <span>{selectedEmployee.nic}</span></div>
                  <div className={styles.infoRow}><span>DOB</span> <span>{selectedEmployee.dob}</span></div>
                  <div className={styles.infoRow}><span>Gender</span> <span>{selectedEmployee.gender}</span></div>
                  <div className={styles.infoRow}><span>Contact</span> <span>{selectedEmployee.contact}</span></div>
                  <div className={styles.infoRow}><span>Email</span> <span>{selectedEmployee.email}</span></div>
=======
                  <div className={styles.infoRow}><span>DOB</span> <span>{selectedEmployee.dob}</span></div>
                  <div className={styles.infoRow}><span>Gender</span> <span>{selectedEmployee.gender}</span></div>
                  <div className={styles.infoRow}><span>NIC</span> <span>{selectedEmployee.nic}</span></div> 
                  <div className={styles.infoRow}><span>Email</span> <span>{selectedEmployee.email}</span></div>
                  <div className={styles.infoRow}><span>Contact</span> <span>{selectedEmployee.contactNumber}</span></div>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
                </section>

                <section>
                  <h4>Job Information</h4>
<<<<<<< HEAD
                  <div className={styles.infoRow}><span>Employee ID</span> <span>{selectedEmployee.id}</span></div>
                  <div className={styles.infoRow}><span>Department</span> <span>{selectedEmployee.department}</span></div>
                  <div className={styles.infoRow}><span>Position</span> <span>{selectedEmployee.position}</span></div>
                  <div className={styles.infoRow}><span>Date joined</span> <span>{selectedEmployee.dateJoined}</span></div>
                </section>
=======
                  <div className={styles.infoRow}><span>Employee ID</span> <span>{selectedEmployee.employeeId}</span></div>
                  <div className={styles.infoRow}><span>Position</span> <span>{selectedEmployee.job}</span></div>
                  <div className={styles.infoRow}><span>Job Type</span> <span>{selectedEmployee.jobType}</span></div>
                  <div className={styles.infoRow}><span>System Role</span> <span>{selectedEmployee.role}</span></div>
                  <div className={styles.infoRow}><span>Department</span> <span>{selectedEmployee.department}</span></div>
                  <div className={styles.infoRow}><span>Date joined</span> <span>{selectedEmployee.dateJoined}</span></div>
                </section>
                {/* Note: Update the link to use the internal database ID if needed */}
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
                <Link href={`/hr_staff/employees/edit/${selectedEmployee.id}`}>
                    <button className={styles.editBtn}>Edit Employee</button>
                </Link>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ color: '#333', fontWeight: '600', marginBottom: '8px' }}>No employee selected</p>
                <p style={{ color: '#666', fontSize: '14px' }}>Select an employee from the list to view their full profile details.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}