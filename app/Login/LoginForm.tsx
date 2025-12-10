// src/components/LoginForm.tsx

import React, { useState } from 'react';
import Image from 'next/image';
import @styles/loginForm.css; // Assuming you have a CSS file for styling

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
    <div className="login-page-bg"> 
      
      {/* Background Image (Replace with your actual image path or URL) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background-ceremony.jpg" // Placeholder path for the background image
          alt="Graduation Ceremony Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="login-background-image" // For the overlay effect
        />
      </div>

      {/* Login Form Card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="login-card-container">
          
          <div className="text-center mb-6">
            {/* Logo/Emblem (Replace with your actual logo path) */}
            <Image
              src="/logo/llsoi-logo.png" // Placeholder path for the LLSOI logo
              alt="LLSOI Campus Logo"
              width={60}
              height={60}
              className="mx-auto mb-2"
            />
            <h1 className="text-3xl font-bold text-gray-800">
              LLSOI Campus
            </h1>
            <h2 className="text-xl font-semibold text-gray-700 mt-1 mb-3">
              HR Management System
            </h2>
            <p className="text-red-600 font-medium">
              Login to Your Account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="login-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                className="login-input"
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="login-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="login-input"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="#" className="login-link">
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