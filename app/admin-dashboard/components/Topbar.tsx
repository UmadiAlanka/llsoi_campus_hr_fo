import React from 'react';
import { UserCircle } from 'lucide-react';
import styles from './Topbar.module.css';

// 1. Define the interface for your props
interface TopbarProps {
  role?: string; // The '?' makes it optional
}

// 2. Pass 'role' into the component and give it a default value
const Topbar: React.FC<TopbarProps> = ({ role = "HR Staff" }) => {
  return (
    <header className={styles.topbar}>
      <div className={styles.leftSection}>
        <img 
          src="/Logo.png" 
          alt="LLSOI Logo" 
          className={styles.logoImage} 
        />
        <h1 className={styles.title}>
          LLSOI Campus HR <span className={styles.subTitle}>Management System</span>
        </h1>
      </div>

      <div className={styles.userProfile}>
        <UserCircle size={28} className={styles.userIcon} />
        {/* 3. Display the dynamic role here */}
        <span>{role}</span>
      </div>
    </header>
  );
};

export default Topbar;