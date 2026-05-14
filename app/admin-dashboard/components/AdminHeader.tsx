import React from "react";
import styles from "./AdminHeader.module.css";

export default function AdminHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src="/Logo.png" alt="LLSOI Logo" className={styles.logo} />
        <h1 className={styles.brand}>
          <span className={styles.brandGold}>LLSOI Campus</span>
          <span className={styles.brandWhite}> HR Management System</span>
        </h1>
      </div>
      <div className={styles.profilePill}>
        <img src="/icons/user-profile.png" alt="Admin" className={styles.avatar} />
        <div className={styles.profileText}>
          <span className={styles.profileName}>Admin</span>
          <span className={styles.profileRole}>Administrator</span>
        </div>
      </div>
    </header>
  );
}