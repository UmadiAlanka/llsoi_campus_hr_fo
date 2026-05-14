<<<<<<< HEAD
import React from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';

const Dashboard = () => {
=======
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    leaveBalance: 15,
    presentDays: 0,
    lateDays: 0,
    upcomingHoliday: 'Loading...'
  });
  const [user, setUser] = useState(null);
  const [attendanceState, setAttendanceState] = useState('NOT_MARKED'); // NOT_MARKED, CHECKED_IN, COMPLETED
  const [todayTimes, setTodayTimes] = useState({ checkIn: null, checkOut: null });
  const [loading, setLoading] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);
  const [allHolidays, setAllHolidays] = useState([]);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchData(parsedUser.userId);
    }
  }, []);

  const fetchData = async (userId) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";
    try {
      // Fetch Attendance Stats
      const attRes = await fetch(`${API_URL}/attendance/employee/${userId}`, { cache: 'no-store' });
      const responseData = await attRes.json();
      let attendance = [];

      if (responseData.data && Array.isArray(responseData.data)) {
        attendance = responseData.data;
      } else if (Array.isArray(responseData)) {
        attendance = responseData;
      }

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const parseDate = (dateVal) => {
        if (Array.isArray(dateVal)) return new Date(dateVal[0], dateVal[1] - 1, dateVal[2]);
        return new Date(dateVal);
      };

      const monthlyAttendance = attendance.filter(a => {
        const recordDate = parseDate(a.date);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
      });

      const present = monthlyAttendance.filter(a => a.status && a.status.toLowerCase() === 'present').length;
      
      // Calculate late days: Check-in after 09:00 AM
      const late = monthlyAttendance.filter(a => {
        if (!a.clockInTime) return false;
        const timeStr = Array.isArray(a.clockInTime) 
          ? `${String(a.clockInTime[0]).padStart(2, '0')}:${String(a.clockInTime[1]).padStart(2, '0')}`
          : a.clockInTime;
        return timeStr > "09:00:00";
      }).length;

      // Check if marked today
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRecord = attendance.find(a => {
        const recordDate = parseDate(a.date).toISOString().split('T')[0];
        return recordDate === todayStr;
      });

      if (todayRecord) {
        setTodayTimes({
          checkIn: todayRecord.clockInTime,
          checkOut: todayRecord.clockOutTime
        });

        if (todayRecord.clockOutTime) {
          setAttendanceState('COMPLETED');
        } else if (todayRecord.clockInTime) {
          setAttendanceState('CHECKED_IN');
        }
      } else {
        setAttendanceState('NOT_MARKED');
        setTodayTimes({ checkIn: null, checkOut: null });
      }

      // Fetch Leave Stats
      const leaveRes = await fetch(`${API_URL}/leave/employee/${userId}`, { cache: 'no-store' });
      const leaveData = await leaveRes.json();
      const leaves = (leaveData && leaveData.data) || (Array.isArray(leaveData) ? leaveData : []);
      const usedLeaves = leaves.filter(l => l.status && l.status.toUpperCase() === 'APPROVED').length;

      // --- SRI LANKA 2026 HOLIDAYS DATABASE ---
      const slHolidays2026 = [
        { date: "2026-01-03", name: "Duruthu Full Moon Poya Day" },
        { date: "2026-01-14", name: "Tamil Thai Pongal Day" },
        { date: "2026-02-01", name: "Navam Full Moon Poya Day" },
        { date: "2026-02-04", name: "Independence Day" },
        { date: "2026-02-17", name: "Mahasivarathri Day" },
        { date: "2026-03-03", name: "Madin Full Moon Poya Day" },
        { date: "2026-03-21", name: "Id-Ul-Fitr (Ramazan Festival Day)" },
        { date: "2026-04-01", name: "Bak Full Moon Poya Day" },
        { date: "2026-04-13", name: "Day prior to Sinhala & Tamil New Year Day" },
        { date: "2026-04-14", name: "Sinhala & Tamil New Year Day" },
        { date: "2026-04-15", name: "Good Friday" },
        { date: "2026-05-01", name: "May Day / Vesak Full Moon Poya Day" },
        { date: "2026-05-02", name: "Pre-Vesak Full Moon Poya Day" },
        { date: "2026-05-28", name: "Id-Ul-Adha (Hadji Festival Day)" },
        { date: "2026-05-30", name: "Poson Full Moon Poya Day" },
        { date: "2026-06-29", name: "Esala Full Moon Poya Day" },
        { date: "2026-07-28", name: "Nikini Full Moon Poya Day" },
        { date: "2026-08-26", name: "Binara Full Moon Poya Day" },
        { date: "2026-09-25", name: "Milad-Un-Nabi (Holy Prophet's Birthday)" },
        { date: "2026-09-25", name: "Vap Full Moon Poya Day" },
        { date: "2026-10-24", name: "Deepavali Festival Day" },
        { date: "2026-10-25", name: "Il Full Moon Poya Day" },
        { date: "2026-11-23", name: "Unduvap Full Moon Poya Day" },
        { date: "2026-12-25", name: "Christmas Day" }
      ];

      setAllHolidays(slHolidays2026);
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const nextHoliday = slHolidays2026
        .map(h => ({ ...h, dateObj: new Date(h.date) }))
        .filter(h => h.dateObj >= now)
        .sort((a, b) => a.dateObj - b.dateObj)[0];

      let holidayStr = 'No upcoming holidays';
      if (nextHoliday) {
        holidayStr = `${nextHoliday.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${nextHoliday.name}`;
      }

      setStats({
        leaveBalance: 15 - usedLeaves,
        presentDays: present,
        lateDays: late,
        upcomingHoliday: holidayStr
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleMarkAttendance = async () => {
    if (!user || attendanceState === 'COMPLETED') return;
    setLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";

    try {
      let endpoint = '';
      let method = 'POST';
      if (attendanceState === 'NOT_MARKED') {
        endpoint = `/attendance/clock-in?employeeId=${user.userId}&markedBy=${user.name}`;
      } else {
        // Trying path variable for clock-out, which may be different from in
        endpoint = `/attendance/clock-out/${user.userId}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const data = result.data;
        // The backend should tell us if it was a check-in or check-out
        if (data.clockOutTime) {
          setAttendanceState('COMPLETED');
          setTodayTimes(prev => ({ ...prev, checkOut: data.clockOutTime }));
          alert("Checked Out Successfully!");
        } else if (data.clockInTime) {
          setAttendanceState('CHECKED_IN');
          setTodayTimes(prev => ({ ...prev, checkIn: data.clockInTime }));
          alert("Checked In Successfully!");
        }
        fetchData(user.userId);
      } else {
        alert(result.message || "Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Network error: Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
  return (
    <div className={styles.appContainer}>
      {/* FULL WIDTH RED HEADER */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <img src="/logo.png" alt="LLSOI Logo" className={styles.mainLogo} />
          <h1 className={styles.systemTitle}>LLSOI Campus HR Management System</h1>
        </div>

        <div className={styles.userProfile}>
          <div className={styles.userText}>
<<<<<<< HEAD
            <p>welcome, <strong>Employee Name!</strong></p>
            <span>Employee ID</span>
=======
            <p>Welcome, <strong>{user ? user.name : 'Employee'}!</strong></p>
            <span>Employee ID: {user ? user.username : ''}</span>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
          </div>
          <div className={styles.profileAvatar}>
            {/* Removed the circular container for a normal look */}
            <img src="/icons/user-profile.png" alt="User" className={styles.avatarImg} />
          </div>
        </div>
      </header>

      <div className={styles.dashboardBody}>
        {/* SIDEBAR (Logo removed from here) */}
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            {/* Link to Dashboard */}
<<<<<<< HEAD
            <Link href="/Dashboard" className={`${styles.navLink} ${styles.active}`}>
=======
            <Link href="/employees" className={`${styles.navLink} ${styles.active}`}>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
              <img src="/icons/dashboard.png" alt="" className={styles.navIcon} /> Dashboard
            </Link>

            {/* Link to Attendance */}
<<<<<<< HEAD
            <Link href="/employees/V-Attendence/" className={styles.navLink}>
=======
            <Link href="/employees/V-Attendance" className={styles.navLink}>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
              <img src="/icons/attendance.png" alt="" className={styles.navIcon} /> View Attendance
            </Link>

            {/* Link to Leave Request */}
<<<<<<< HEAD
            <Link href="/leave" className={styles.navLink}>
=======
            <Link href="/employees/Leave_Request" className={styles.navLink}>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
              <img src="/icons/leave.png" alt="" className={styles.navIcon} /> Request Leave
            </Link>

            {/* Link to Salary */}
<<<<<<< HEAD
            <Link href="/salary" className={styles.navLink}>
=======
            <Link href="/employees/Salary" className={styles.navLink}>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
              <img src="/icons/salary.png" alt="" className={styles.navIcon} /> View Salary
            </Link>

            {/* Link to Logout/Login */}
<<<<<<< HEAD
            <Link href="/login" className={styles.navLink}>
              <img src="/icons/logout.png" alt="" className={styles.navIcon} /> Log Out
            </Link>
          </nav>
        </aside>
        
=======
            {/* Link to Logout/Login */}
            <div onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }} className={styles.navLink}>
              <img src="/icons/logout.png" alt="" className={styles.navIcon} /> Log Out
            </div>
          </nav>
        </aside>

>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
        {/* MAIN CONTENT */}
        <main className={styles.mainContent}>
          <section className={styles.pageBody}>
            <h2 className={styles.sectionHeading}>Dashboard</h2>

            <div className={styles.attendanceHero}>
<<<<<<< HEAD
              <h3 className={styles.attendanceDate}>Attendance for December 6, 2025</h3>
              <button className={styles.markAttendanceBtn}>
                <img src="/icons/check-circle3.png" alt="" className={styles.btnIcon} /> Mark Attendance
=======
              <h3 className={styles.attendanceDate}>Attendance for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
              <div style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#555' }}>
                {todayTimes.checkIn && <span><strong>In:</strong> {todayTimes.checkIn}</span>}
                {todayTimes.checkOut && <span style={{ marginLeft: '15px' }}><strong>Out:</strong> {todayTimes.checkOut}</span>}
              </div>
              <button
                className={styles.markAttendanceBtn}
                onClick={handleMarkAttendance}
                disabled={loading || attendanceState === 'COMPLETED'}
                style={{
                  opacity: attendanceState === 'COMPLETED' ? 0.7 : 1,
                  cursor: attendanceState === 'COMPLETED' ? 'default' : 'pointer',
                  backgroundColor: attendanceState === 'CHECKED_IN' ? '#e67300' : '#7a1212' // Orange for Check Out
                }}
              >
                <img src="/icons/check-circle3.png" alt="" className={styles.btnIcon} />
                {loading ? "Processing..." :
                  attendanceState === 'NOT_MARKED' ? "Mark Attendance" :
                    attendanceState === 'CHECKED_IN' ? "Check Out" :
                      "Attendance Completed"}
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
              </button>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.whiteCard}>
                <img src="/icons/leave-balance.png" alt="" className={styles.cardIcon} />
                <p className={styles.cardLabel}>Leave Balance</p>
<<<<<<< HEAD
                <div className={styles.statValue}>12</div>
                <p className={styles.statSubtext}>/15 Days left</p>
              </div>

              <div className={styles.whiteCard}>
                <img src="/icons/upcoming.png" alt="" className={styles.cardIcon} />
                <p className={styles.cardLabel}>Upcoming Leave</p>
                <div className={styles.dateValue}>Dec 25th Christmas</div>
=======
                <div className={styles.statValue}>{stats.leaveBalance}</div>
                <p className={styles.statSubtext}>/15 Days left</p>
              </div>

              <div className={styles.whiteCard} onClick={() => setShowHolidays(true)} style={{ cursor: 'pointer' }}>
                <img src="/icons/upcoming.png" alt="" className={styles.cardIcon} />
                <p className={styles.cardLabel}>Upcoming Holiday</p>
                <div className={styles.dateValue}>{stats.upcomingHoliday}</div>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
              </div>

              <div className={styles.whiteCard}>
                <img src="/icons/monthly-attendance.png" alt="" className={styles.cardIcon} />
                <p className={styles.cardLabel}>Monthly Attendance</p>
                <div className={styles.attendanceDetail}>
<<<<<<< HEAD
                  <p>15 Days Present,</p>
                  <p>2 Days Late</p>
=======
                  <p>{stats.presentDays} Present (On-Time),</p>
                  <p>{stats.lateDays} Late (After 9 AM)</p>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
                </div>
              </div>
            </div>

            <h2 className={styles.sectionHeading}>Quick Action</h2>
            <div className={styles.actionsGrid}>
<<<<<<< HEAD
              <button className={styles.actionButton}>
                <img src="/icons/request-btn.png" alt="" className={styles.smallBtnIcon} /> Request Leave
              </button>
              <button className={styles.actionButton}>
                <img src="/icons/payslip-btn.png" alt="" className={styles.smallBtnIcon} /> View Payslip
              </button>
              <button className={styles.actionButton}>
                <img src="/icons/history-btn.png" alt="" className={styles.smallBtnIcon} /> View Leave History
              </button>
=======
              <Link href="/employees/Leave_Request">
                <button className={styles.actionButton}>
                  <img src="/icons/request-btn.png" alt="" className={styles.smallBtnIcon} /> Request Leave
                </button>
              </Link>
              <Link href="/employees/Payslip">
                <button className={styles.actionButton}>
                  <img src="/icons/payslip-btn.png" alt="" className={styles.smallBtnIcon} /> View Payslip
                </button>
              </Link>
              <Link href="/employees/Leave_History">
                <button className={styles.actionButton}>
                  <img src="/icons/history-btn.png" alt="" className={styles.smallBtnIcon} /> View Leave History
                </button>
              </Link>
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
            </div>
          </section>
        </main>
      </div>
<<<<<<< HEAD
=======

      {/* HOLIDAY CALENDAR MODAL */}
      {showHolidays && (
        <div className={styles.modalOverlay} onClick={() => setShowHolidays(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Public Holidays {viewYear}</h3>
              <button className={styles.closeBtn} onClick={() => setShowHolidays(false)}>&times;</button>
            </div>
            
            <div className={styles.calendarControls}>
              <button onClick={() => {
                if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
                else { setViewMonth(viewMonth - 1); }
              }} className={styles.navBtn}>&lt;</button>
              
              <span className={styles.monthLabel}>
                {new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' })} {viewYear}
              </span>
              
              <button onClick={() => {
                if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
                else { setViewMonth(viewMonth + 1); }
              }} className={styles.navBtn}>&gt;</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.calendarGrid}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className={styles.dayHeader}>{day}</div>
                ))}
                
                {(() => {
                  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
                  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
                  const cells = [];
                  
                  // Empty cells for previous month
                  for (let i = 0; i < firstDay; i++) {
                    cells.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
                  }
                  
                  // Actual days
                  for (let d = 1; d <= daysInMonth; d++) {
                    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const holiday = allHolidays.find(h => h.date === dateStr);
                    
                    cells.push(
                      <div key={d} className={`${styles.calendarDay} ${holiday ? styles.isHoliday : ''}`} title={holiday ? holiday.localName || holiday.name : ''}>
                        <span className={styles.dayNum}>{d}</span>
                        {holiday && <span className={styles.holidayIndicator}></span>}
                        {holiday && <div className={styles.holidayPopup}>{holiday.localName || holiday.name}</div>}
                      </div>
                    );
                  }
                  return cells;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
>>>>>>> aaa9fb7a542de002a63dd9c859c632f10b0d94f9
    </div>
  );
};

export default Dashboard;