"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './ResetPasswordForm.module.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Retrieve email saved by the Forgot Password step
  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (otpCode.length !== 6) {
      setMessage("Please enter the 6-digit code sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:2027/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            email, 
            code: otpCode, 
            newPassword 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password updated successfully!");
        localStorage.removeItem('resetEmail'); 
        router.push("/login");
      } else {
        setMessage(data.message || "Invalid or expired OTP code.");
      }
    } catch (err) {
      setMessage("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Background Section */}
      <div className={styles.bgImage}>
        <Image src="/loginBackground.jpg" alt="" fill style={{ objectFit: "cover" }} priority />
      </div>
      <div className={styles.bgOverlay} />
      <div className={styles.circle1} />
      <div className={styles.circle2} />

      <div className={styles.card}>
        {/* Header Section */}
        <Link href="/login" className={styles.backBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to login
        </Link>

        <div className={styles.iconWrap}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#720e0e" strokeWidth={2}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>

        <h1 className={styles.cardTitle}>Set New Password</h1>
        <p className={styles.cardDesc}>
          Verification code sent to <strong>{email || 'your email'}</strong>. 
          Please enter the code and your new credentials.
        </p>

        {/* Form Section */}
        <form onSubmit={handleUpdate} className="w-full">
          {message && <div className={styles.errorBox}>{message}</div>}

          <div className={styles.field}>
            <label>6-Digit Verification Code</label>
            <div className={styles.fieldWrap}>
              <input
                type="text"
                maxLength={6}
                className={styles.otpInput}
                placeholder="0 0 0 0 0 0"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>New Password</label>
            <div className={styles.fieldWrap}>
              <svg className={styles.fieldIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                placeholder="••••••••"
                className={styles.Input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Confirm New Password</label>
            <div className={styles.fieldWrap}>
              <svg className={styles.fieldIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <input
                type="password"
                placeholder="••••••••"
                className={styles.Input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.updateBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : "UPDATE PASSWORD"}
          </button>
        </form>

        <p className={styles.altLink}>
          Didn't get a code? <Link href="/forgot-password">Resend Code</Link>
        </p>
      </div>
    </div>
  );
}