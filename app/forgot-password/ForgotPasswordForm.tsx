/** @jsxImportSource react */
"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import style from './ForgotPasswordForm.module.css';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    
    try {
      // 1. Connect to your Spring Boot backend
      const response = await fetch("http://localhost:2027/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }), // Sending email as a JSON object
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Success message from your Java Controller
        setMessage(data.message || 'A password reset link has been sent to your email address.');
        setEmail(''); // Clear input on success
      } else {
        // 3. Handle 404 Email Not Found or other errors
        setIsError(true);
        setMessage(data.message || 'Email address not found in our system.');
      }
    } catch (err) {
      console.error('Mail Error:', err);
      setIsError(true);
      setMessage('Failed to connect to the server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.main}> 
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/loginBackground.jpg"
          alt="Graduation Ceremony Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
        />
      </div>

      {/* Forgot Password Card */}
      <div className="relative z-10 flex items-center justify-center p-20 min-h-screen">
        <div className={style.loginCard}>
          
          <div className="text-center mb-6">
            <Image
              src="/Logo.png"
              alt="LLSOI Campus Logo"
              width={60}
              height={60}
              className="mx-auto"
            />
            <h1>
              <span className={style.titlePrimary}>LLSOI</span>
              <span className={style.titleSecondary}> Campus</span> 
            </h1>
            <h2 className={style.subHeader}>
              HR Management System
            </h2>
          </div>

          <div className={style.forgotPasswordContent}>
            <p className={style.forgotTitle}>
              Forgot your password?
            </p>
            <p className={style.subInstruction}>
              Enter your email address below and we'll send a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-8">
            <div className={style.inputGroup}>
              <label htmlFor="email" className={style.label}>
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                className={style.Input}
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {message && (
              <p className={isError ? "text-red-500 text-sm" : "text-green-500 text-sm"}>
                {message}
              </p>
            )}

            <button
              type="submit"
              className={style.resetButton}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className={style.backLink}>
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;