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

  // Helper function to fix the "LocalTime could not be parsed" error
  // Converts "18:08" to "18:08:00"
  const formatTimeToBackend = (timeStr: string) => {
    if (!timeStr) return null;
    // Check if seconds are already present; if not, add :00
    return timeStr.split(":").length === 2 ? `${timeStr}:00` : timeStr;
  };

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch(`http://localhost:2027/api/attendance/${id}`);
        const result = await res.json();
        if (result.success) {
          // Note: Backend might send HH:mm:ss, but <input type="time"> needs HH:mm
          const stripSeconds = (timeStr: string) => (timeStr ? timeStr.substring(0, 5) : "");

          setFormData({
            name: result.data.employee?.name || "",
            employeeId: result.data.employee?.id || "",
            type: result.data.type || "Academic",
            department: result.data.employee?.department || "",
            timeIn: stripSeconds(result.data.clockInTime),
            timeOut: stripSeconds(result.data.clockOutTime),
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
      // 1. Prepare payload with formatted time strings
      const payload = {
        clockInTime: formatTimeToBackend(formData.timeIn),
        clockOutTime: formatTimeToBackend(formData.timeOut),
        date: formData.date || null,
        status: "PRESENT",
        type: formData.type,
      };

      // 2. Perform the PUT request with the required updatedBy query parameter
      const res = await fetch(
        `http://localhost:2027/api/attendance/${id}?updatedBy=Admin`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      // result.success check depends on your backend ApiResponse wrapper
      if (res.ok && (result.success || res.status === 200)) {
        setModal({ show: true, type: "success", msg: "Attendance updated successfully!" });
      } else {
        setModal({ show: true, type: "error", msg: result.message || "Error updating record." });
      }
    } catch (err) {
      setModal({ show: true, type: "error", msg: "Error updating record." });
    }
  };

  if (loading) return <p className={styles.loading}>Loading Record...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Edit Attendance</h2>

      <div className={styles.formCard}>
        <form onSubmit={handleUpdate} className={styles.attendanceForm}>
          <div className={styles.formGroupFull}>
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              readOnly
              className={styles.input}
            />
          </div>

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
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Academic">Academic</option>
                <option value="Non-Academic">Non-Academic</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Department:</label>
              <input type="text" value={formData.department} readOnly className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label>Time In:</label>
              <input
                type="time"
                className={styles.input}
                value={formData.timeIn}
                onChange={(e) => setFormData({ ...formData, timeIn: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Time Out:</label>
              <input
                type="time"
                className={styles.input}
                value={formData.timeOut}
                onChange={(e) => setFormData({ ...formData, timeOut: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroupFull}>
            <label>Date:</label>
            <input
              type="date"
              className={styles.input}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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