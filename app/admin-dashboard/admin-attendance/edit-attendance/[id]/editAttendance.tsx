"use client";

import React, { useRef } from 'react';
import styles from './editAttendance.module.css';
import { useParams, useRouter } from 'next/navigation';

const EditAttendance: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleCalendarClick = () => {
    if (dateInputRef.current && 'showPicker' in HTMLInputElement.prototype) {
      (dateInputRef.current as any).showPicker();
    }
  };

  return (
    <>
      <h2 className={styles.pageTitle}>Edit Attendance — Record #{params.id}</h2>
      <div className={styles.formCard}>
        <form className={styles.attendanceForm}>
          <div className={styles.fullWidth}>
            <label className={styles.label}>Name:</label>
            <input type="text" className={styles.input} defaultValue="S.Perera" />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee ID:</label>
              <input type="text" className={styles.input} defaultValue={params.id as string} readOnly style={{ background: '#f0f0f0', cursor: 'not-allowed' }} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Type:</label>
              <div className={styles.selectWrapper}>
                <select className={styles.select} defaultValue="academic">
                  <option value="academic">Academic</option>
                  <option value="non-academic">Non-academic</option>
                </select>
                <img src="/icons/dropdown.png" alt="" className={styles.selectIcon} />
              </div>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Course:</label>
              <div className={styles.selectWrapper}>
                <select className={styles.select}>
                  <option>BSc IT</option>
                  <option>Finance Management</option>
                  <option>Business Admin</option>
                </select>
                <img src="/icons/dropdown.png" alt="" className={styles.selectIcon} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Department:</label>
              <div className={styles.selectWrapper}>
                <select className={styles.select}>
                  <option>HR</option>
                  <option>Management</option>
                  <option>Language</option>
                  <option>IT</option>
                  <option>Behavioral</option>
                </select>
                <img src="/icons/dropdown.png" alt="" className={styles.selectIcon} />
              </div>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Time In:</label>
              <input type="time" className={styles.input} defaultValue="08:00" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Time Out:</label>
              <input type="time" className={styles.input} defaultValue="17:00" />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date:</label>
              <div className={styles.dateWrapper} onClick={handleCalendarClick}>
                <input type="date" ref={dateInputRef} className={styles.dateInput} />
                <img src="/icons/calendar.png" alt="calendar" className={styles.calendarIcon} />
              </div>
            </div>
            <div />
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.updateBtn}>UPDATE</button>
            <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>CANCEL</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditAttendance;