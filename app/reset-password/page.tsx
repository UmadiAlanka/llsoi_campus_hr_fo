"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import style from './ResetPasswordForm.module.css';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:2027/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (res.ok) {
        alert("Password updated successfully!");
        router.push("/login");
      } else {
        setMessage("Link expired or invalid token.");
      }
    } catch (err) {
      setMessage("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.main}>
      <Image
        src="/loginBackground.jpg"
        alt="Background"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />

      <div className="relative z-10 flex items-center justify-center p-5">
        <div className={style.loginCard}>
          <Image src="/Logo.png" alt="Logo" width={60} height={60} className="mx-auto mb-2" />
          <h1><span className={style.titlePrimary}>LLSOI</span><span className={style.titleSecondary}> Campus</span></h1>
          <h2 className={style.subHeader}>HR Management System</h2>
          <p className={style.resetTitle}>Reset Your Password</p>

          <form onSubmit={handleUpdate} className="mt-6">
            <label className={style.label}>New Password:</label>
            <input
              type="password"
              className={style.Input}
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label className={style.label}>Confirm Password:</label>
            <input
              type="password"
              className={style.Input}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {message && <p className={style.message}>{message}</p>}

            <button type="submit" className={style.updateButton} disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}