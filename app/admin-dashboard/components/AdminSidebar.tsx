"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminSidebar.module.css";

const menuItems = [
  { name: "Dashboard", icon: "/icons/home.png", href: "/admin-dashboard" },
  { name: "Manage Users", icon: "/icons/user.png", href: "/admin-dashboard/admin-manage-users" },
  { name: "Attendance", icon: "/icons/dattendance.png", href: "/admin-dashboard/admin-attendance" },
  { name: "Salary & Pay Slip", icon: "/icons/dsalary.png", href: "/admin-dashboard/salary" },
  { name: "Anomaly Detections", icon: "/icons/anomaly.png", href: "/admin-dashboard/anomaly" },
  { name: "Report & Analytics", icon: "/icons/report.png", href: "/admin-dashboard/analytics" },
  { name: "Leave Management", icon: "/icons/leave.png", href: "/admin-dashboard/leave" },
  { name: "Logout", icon: "/icons/logout.png", href: "/" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul className={styles.menuList}>
          {menuItems.map((item) => {
            const isExact = item.name === "Dashboard" || item.href === "/";
            const isActive = isExact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
                >
                  <img src={item.icon} alt="" className={styles.menuIconImage} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}