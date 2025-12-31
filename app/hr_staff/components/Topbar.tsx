import React from 'react';
import { UserCircle } from 'lucide-react';
import styles from './Topbar.module.css';

const Topbar = () => {
  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>LLSOI Campus HR <span className={styles.subTitle}>Management System</span></h1>
      <div className={styles.userProfile}>
        <UserCircle size={28} className={styles.userIcon} />
        <span>HR Staff</span>
      </div>
    </header>
  );
};

export default Topbar;