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
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";

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

      if (data.success) {
        // Save logged user info
        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: data.userId,
            username: data.username,
            name: data.name,
            role: data.role,
          })
        );

        // Redirect by role
        if (data.role === "Admin") {
          router.push("/admin-dashboard");
        } else if (data.role === "HR") {
          router.push("/hr_staff/dashboard");
        } else if (data.role === "Employee") {
          router.push("/employees");
        } else {
          router.push("/");
        }
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to server. Make sure backend is running.");
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
          style={{ objectFit: "cover" }}
          quality={100}
          priority
        />
      </div>

      {/* Login Form Card */}
      <div className="relative z-10 flex items-center justify-center p-20">
        <div className={style.loginCard}>
          <div className="text-center mb-6">
            <Image
              src="/Logo.png"
              alt="LLSOI Campus Logo"
              width={60}
              height={60}
              className={style.logoImage}
            />
            <h1>
              <span className={style.titlePrimary}>LLSOI</span>
              <span className={style.titleSecondary}> Campus</span>
            </h1>
            <h2 className={style.subHeader}>HR Management System</h2>
            <p className={style.subTitle}>Login to Your Account</p>
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

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
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

          <div>
            <Link href="/forgot-password" className={style.forgotLink}>
              Forgot your password?
            </Link>
          </div>

          {/* Test info */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
            <p className="font-semibold mb-1">Test Credentials:</p>
            <p>Admin: admin / admin123</p>
            <p>HR: hrstaff / hr123</p>
            <p>Employee: employee1 / 12345</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
