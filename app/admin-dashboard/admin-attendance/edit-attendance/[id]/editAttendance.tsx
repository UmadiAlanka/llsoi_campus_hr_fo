"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./editAttendance.module.css";
import MessageBox from "../../../components/MessageBox";

const EditAttendance = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    type: "Academic",
    department: "",
    timeIn: "",
    timeOut: "",
    date: "",
  });

  const [modal, setModal] = useState<{ show: boolean; type: "success" | "error"; msg: string }>({
    show: false,
    type: "success",
    msg: "",
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch(`http://localhost:2027/api/attendance/${id}`);
        const result = await res.json();
        if (result.success) {
          setFormData({
            name: result.data.employee?.name || "",
            employeeId: result.data.employee?.id || "",
            type: result.data.type || "Academic",
            department: result.data.employee?.department || "",
            timeIn: result.data.clockInTime || "",
            timeOut: result.data.clockOutTime || "",
            date: result.data.date || "",
          });
        }
      } catch (err) {
        setModal({ show: true, type: "error", msg: "Failed to load record data." });
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:2027/api/attendance/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModal({ show: true, type: "success", msg: "Attendance updated successfully!" });
      } else {
        throw new Error("Update failed.");
      }
    } catch (err) {
      setModal({ show: true, type: "error", msg: "Error updating record." });
    }
  };

  if (loading) return <p className={styles.loading}>Loading Record...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Edit Attendance</h2>
      
      {/* White Semi-Transparent Card Container */}
      <div className={styles.formCard}>
        <form onSubmit={handleUpdate} className={styles.attendanceForm}>
          
          {/* Row 1: Name (Full Width) */}
          <div className={styles.formGroupFull}>
            <label>Name:</label>
            <input 
              type="text" 
              value={formData.name} 
              readOnly 
              className={styles.input}
            />
          </div>

          {/* Grid for two-column layout */}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Employee ID:</label>
              <input type="text" value={formData.employeeId} readOnly className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label>Select Type:</label>
              <select 
                className={styles.select}
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Academic">Academic</option>
                <option value="Non-Academic">Non-Academic</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Select Department:</label>
              <select 
                className={styles.select}
                value={formData.department} 
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                <option value="Management">Management</option>
                <option value="Academic Staff">Academic Staff</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Time In:</label>
              <input 
                type="time" 
                className={styles.input}
                value={formData.timeIn} 
                onChange={(e) => setFormData({...formData, timeIn: e.target.value})} 
              />
            </div>

            <div className={styles.formGroup}>
              <label>Time Out:</label>
              <input 
                type="time" 
                className={styles.input}
                value={formData.timeOut} 
                onChange={(e) => setFormData({...formData, timeOut: e.target.value})} 
              />
            </div>
          </div>

          {/* Row 4: Date (Full Width) */}
          <div className={styles.formGroupFull}>
            <label>Date:</label>
            <input 
              type="date" 
              className={styles.input}
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})} 
            />
          </div>

          <button type="submit" className={styles.updateBtn}>Update</button>
        </form>
      </div>

      {modal.show && (
        <MessageBox 
          type={modal.type} 
          message={modal.msg} 
          onClose={() => {
            setModal({ ...modal, show: false });
            if (modal.type === "success") router.push("/admin-dashboard/admin-attendance");
          }} 
        />
      )}
    </div>
  );
};

export default EditAttendance;