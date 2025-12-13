
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // TODO: Add your logic to send the password reset link
    console.log('Attempting to send reset link to:', { email });
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      // Simulate success/error response
      if (email.includes('@')) {
        setMessage('A password reset link has been sent to your email address.');
        // Optionally clear the email field: setEmail('');
      } else {
        setMessage('Please enter a valid email address.');
      }
    }, 1500);
  };

  return (
    // Outer container to mimic the background image and overlay
    // NOTE: For a real Next.js app, you'd place this component on a new page 
    // and let the page layout handle the background image.
    <div className={style.main}> 
      
      {/* Background Image (In a real app, this should be handled by a layout or parent component) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/loginBackground.jpg" // Placeholder path for the background image
          alt="Graduation Ceremony Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      {/* Forgot Password Card */}
      <div className="relative z-10 flex items-center justify-center p-20">
        <div className={style.loginCard}>
          
          <div className="text-center mb-6">
            {/* Logo/Emblem (Replace with your actual logo path) */}
            <Image
              src="/Logo.png" // Placeholder path for the LLSOI logo
              alt="LLSOI Campus Logo"
              width={60}
              height={60}
              className={style.logoImage}
            />
            <h1><span className={style.titlePrimary}>LLSOI</span><span className={style.titleSecondary}> Campus</span> </h1>
            <h2 className={style.subHeader }>
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
            
            {message && <p className={style.message}>{message}</p>}

            <button
              type="submit"
              className={style.resetButton}
              disabled={loading}
            >
              {loading ? 'Sending' : 'Send reset link'}
            </button>
          </form>

          <div>
            {/* Assuming a route '/login' for the login page */}
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