"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("user", JSON.stringify({
          userId: data.userId, username: data.username,
          name: data.name, role: data.role,
        }));
        const role = (data.role || "").toLowerCase();
        if (role === "admin")          router.push("/admin-dashboard");
        else if (role === "hr")        router.push("/hr_staff/dashboard");
        else if (role === "employee")  router.push("/employees");
        else                           router.push("/");
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch {
      setError("Cannot connect to server. Make sure the backend is running on port 2027.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Background image */}
      <div className={styles.bgImage}>
        <Image src="/loginBackground.jpg" alt="" fill style={{ objectFit: "cover" }} priority />
      </div>
      <div className={styles.bgOverlay} />

      {/* Decorative circles */}
      <div className={styles.circle1} />
      <div className={styles.circle2} />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoCircle}>
            <Image src="/Logo.png" alt="LLSOI" width={44} height={44} />
          </div>
          <div>
            <div className={styles.brandName}>LLSOI Campus</div>
            <div className={styles.brandSub}>HR Management System</div>
          </div>
        </div>

        <div className={styles.divider} />

        <span className={styles.signInLabel}>Sign in to your account</span>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className={styles.field}>
            <label>Username</label>
            <div className={styles.fieldWrap}>
              <svg className={styles.fieldIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label>Password</label>
            <div className={styles.fieldWrap}>
              <svg className={styles.fieldIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <svg
                className={styles.eyeBtn}
                onClick={() => setShowPwd(!showPwd)}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              >
                {showPwd
                  ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                }
              </svg>
            </div>
          </div>

          {/* Options row */}
          <div className={styles.optionsRow}>
            <label className={styles.rememberLabel}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFD814">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M14 12H3"/>
              </svg>
            )}
            {loading ? "Signing in…" : "LOGIN"}
          </button>
        </form>

        <div className={styles.footerText}>Secured portal — authorised access only</div>

        <div className={styles.roleChips}>
          <span className={`${styles.chip} ${styles.chipAdmin}`}>Admin</span>
          <span className={`${styles.chip} ${styles.chipHr}`}>HR Staff</span>
          <span className={`${styles.chip} ${styles.chipEmp}`}>Employee</span>
        </div>
      </div>
    </div>
  );
}