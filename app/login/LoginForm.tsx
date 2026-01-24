"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import style from "./LoginForm.module.css";

const LoginForm: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 1. Save logged user info to localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: data.userId,
            username: data.username,
            name: data.name,
            role: data.role,
          })
        );

        // 2. Normalize role for comparison (prevents "Admin" vs "admin" errors)
        const userRole = data.role ? data.role.toLowerCase() : "";

        // 3. Redirect based on normalized role
        if (userRole === "admin") {
          router.push("/admin-dashboard");
          // Fallback if router fails: window.location.href = "/admin-dashboard";
        } else if (userRole === "hr") {
          router.push("/hr_staff/dashboard");
        } else if (userRole === "employee") {
          router.push("/employees");
        } else {
          router.push("/");
        }
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to server. Check if Backend is running on port 2027.");
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
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          quality={100}
          priority
        />
      </div>

      {/* Login Form Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className={style.loginCard}>
          <div className="text-center mb-6">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="mx-auto mb-2"
            />
            <h1>
              <span className={style.titlePrimary}>LLSOI</span>
              <span className={style.titleSecondary}> Campus</span>
            </h1>
            <h2 className={style.subHeader}>HR Management System</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={style.label}>Username:</label>
              <input
                type="text"
                className={style.Input}
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={style.label}>Password:</label>
              <input
                type="password"
                className={style.Input}
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={style.loginButton}
              disabled={loading}
            >
              {loading ? "Logging..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/forgot-password" className={style.forgotLink}>
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;