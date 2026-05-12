"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ForgotPasswordForm.module.css";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:2027/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        // Save email so the Reset Password page knows which user to verify
        localStorage.setItem("resetEmail", email);
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.message || "Email not found in our system.");
      }
    } catch {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgImage}>
        <Image src="/loginBackground.jpg" alt="" fill style={{ objectFit: "cover" }} priority />
      </div>
      <div className={styles.bgOverlay} />
      <div className={styles.circle1} />
      <div className={styles.circle2} />

      <div className={styles.card}>
        {/* Back link */}
        <Link href="/login" className={styles.backBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to login
        </Link>

        {/* Icon */}
        <div className={styles.iconWrap}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#720e0e" strokeWidth={2}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1 className={styles.cardTitle}>Forgot password?</h1>
        <p className={styles.cardDesc}>
          Enter your email below. We'll send a <strong>6-digit verification code</strong> to your inbox to reset your password.
        </p>

        {/* Steps Progress Bar */}
        <div className={styles.stepRow}>
          <div className={`${styles.step} ${styles.stepDone}`}>
            <div className={styles.stepNum}>1</div>
            <span>Enter email</span>
          </div>
          <div className={styles.stepDiv} />
          <div className={`${styles.step} ${sent ? styles.stepDone : styles.stepPending}`}>
            <div className={styles.stepNum}>2</div>
            <span>Get Code</span>
          </div>
          <div className={styles.stepDiv} />
          <div className={`${styles.step} ${styles.stepPending}`}>
            <div className={styles.stepNum}>3</div>
            <span>Reset</span>
          </div>
        </div>

        {/* Success state - Displays after email is sent */}
        {sent && (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth={2.5}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className={styles.successTitle}>OTP Code Sent!</p>
            <p className={styles.successDesc}>
              A 6-digit code was sent to <strong>{email}</strong>. It expires in 10 minutes.
            </p>
            <Link href="/reset-password" className={styles.returnBtn}>
              ENTER CODE NOW
            </Link>
          </div>
        )}

        {/* Form state - Hidden once sent */}
        {!sent && (
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.field}>
              <label>Email address</label>
              <div className={styles.fieldWrap}>
                <svg className={styles.fieldIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
                <input
                  type="email"
                  placeholder="yourname@llsoi.edu.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.sendBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFD814">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              )}
              {loading ? "Sending…" : "SEND OTP CODE"}
            </button>
          </form>
        )}

        <div className={styles.altLink}>
          Remember your password?{" "}
          <Link href="/login">Sign in instead</Link>
        </div>
      </div>
    </div>
  );
}