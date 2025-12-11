// src/components/LoginForm.tsx
/** @jsxImportSource react */

"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import style from './LoginForm.module.css';


const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 
    // TODO: Add your authentication logic here
    // Example: const response = await fetch('/api/login', { /* ... */ });
    // 
    console.log('Attempting login with:', { username, password });
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      // Redirect on success or show error
      if (username === 'admin' && password === 'pass') {
        alert('Login Successful!');
        // router.push('/dashboard'); 
      } else {
        alert('Invalid Credentials');
      }
    }, 1500);
  };

  return (
    // Outer container to mimic the background image and overlay
    <div className={style.main}> 
      
      {/* Background Image (Replace with your actual image path or URL) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/loginBackground.jpg" // Placeholder path for the background image
          alt="Graduation Ceremony Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          
        />
      </div>

      {/* Login Form Card */}
      <div className="relative z-0 flex  items-center justify-center p-20">
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
            <p className={style.subTitle}>
              Login to Your Account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className={style.label}>
                Username:
              </label>
              <input
                type="text"
                id="username"
                className={style.Input}
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className={style.label}>
                Password:
              </label>
              <input
                type="password"
                id="password"
                className={style.Input}
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={style.loginButton}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div>
            <a href="#" className={style.forgotLink}>
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// To use this component, you would place it in your app/login/page.tsx file.
// export default LoginForm; 

// Note: Ensure you have the 'next/image' configured in your next.config.js 
// if using external image sources.
export default LoginForm;