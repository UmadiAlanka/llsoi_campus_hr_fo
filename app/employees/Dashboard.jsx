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

  // Payslip Modal State
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [latestSalary, setLatestSalary] = useState(null);
  const [fetchingSalary, setFetchingSalary] = useState(false);

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

      const formatTime = (timeVal) => {
        if (!timeVal) return null;
        if (Array.isArray(timeVal)) {
          return `${String(timeVal[0]).padStart(2, '0')}:${String(timeVal[1]).padStart(2, '0')}:${String(timeVal[2] || 0).padStart(2, '0')}`;
        }
        return timeVal;
      };

      const monthlyAttendance = attendance.filter(a => {
        const recordDate = parseDate(a.date);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
      });

      let presentCount = 0;
      let lateCount = 0;

      monthlyAttendance.forEach(a => {
        const inTime = formatTime(a.clockInTime);
        const outTime = formatTime(a.clockOutTime);
        
        let hrs = a.workingHours;
        if (hrs === null && inTime && outTime) {
          try {
            const [h1, m1] = inTime.split(':').map(Number);
            const [h2, m2] = outTime.split(':').map(Number);
            const diff = (h2 + m2/60) - (h1 + m1/60);
            hrs = diff > 0 ? diff : 0;
          } catch (e) { hrs = 0; }
        }

        // Apply rules
        const isLate = inTime && inTime > "09:00:00";
        const isAbsent = hrs !== null && hrs > 0 && hrs < 4;

        if (!isAbsent) {
          if (isLate) lateCount++;
          else presentCount++;
        }
      });

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
      let leaveBalance = 48;
      try {
        const balRes = await fetch(`${API_URL}/leave/employee/${userId}/balance`, { cache: 'no-store' });
        const balData = await balRes.json();
        if (balRes.ok && balData.success) {
          leaveBalance = balData.data;
        } else {
          // Fallback manual calculation
          const leaveRes = await fetch(`${API_URL}/leave/employee/${userId}`, { cache: 'no-store' });
          const leaveData = await leaveRes.json();
          const leaves = (leaveData && leaveData.data) || (Array.isArray(leaveData) ? leaveData : []);
          const currentYear = new Date().getFullYear();
          const usedLeaves = leaves
            .filter(l => l.status && l.status.toUpperCase() === 'APPROVED')
            .filter(l => parseDate(l.startDate).getFullYear() === currentYear)
            .reduce((sum, l) => {
              const start = parseDate(l.startDate);
              const end = parseDate(l.endDate);
              if (isNaN(start.getTime()) || isNaN(end.getTime())) return sum;
              const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
              return sum + (diffDays > 0 ? diffDays : 0);
            }, 0);
          leaveBalance = 48 - usedLeaves;
        }
      } catch (e) {
        console.error("Error fetching leave balance:", e);
      }

      // ... SRI LANKA 2026 HOLIDAYS DATABASE ...
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
        leaveBalance: leaveBalance,
        presentDays: presentCount,
        lateDays: lateCount,
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
        endpoint = `/attendance/clock-out/${user.userId}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const data = result.data;
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

  const handleViewLatestPayslip = async () => {
    if (!user) return;
    setFetchingSalary(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2027/api";
    try {
      const res = await fetch(`${API_URL}/salary/employee/${user.userId}/latest`);
      const result = await res.json();
      if (result.success) {
        setLatestSalary(result.data);
        setShowPayslipModal(true);
      } else {
        alert(result.message || "No salary record found.");
      }
    } catch (error) {
      console.error("Error fetching latest salary:", error);
      alert("Failed to fetch salary details.");
    } finally {
      setFetchingSalary(false);
    }
  };

  const getMonthName = (m) => {
    return new Date(2000, m - 1).toLocaleString('en-US', { month: 'long' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.appContainer}>
      <header className={`${styles.topHeader} no-print`}>
        <div className={styles.headerLeft}>
          <img src="/logo.png" alt="LLSOI Logo" className={styles.mainLogo} />
          <h1 className={styles.systemTitle}>LLSOI Campus HR Management System</h1>
        </div>

        <div className={styles.userProfile}>
          <div className={styles.userText}>
            <p>Welcome, <strong>{user ? user.name : 'Employee'}!</strong></p>
            <span>Employee ID: {user ? user.username : ''}</span>
          </div>
          <div className={styles.profileAvatar}>
            <img src="/icons/user-profile.png" alt="User" className={styles.avatarImg} />
          </div>
        </div>
      </header>

      <div className={styles.dashboardBody}>
        <aside className={`${styles.sidebar} no-print`}>
          <nav className={styles.navMenu}>
            <Link href="/employees" className={`${styles.navLink} ${styles.active}`}>
              <img src="/icons/dashboard.png" alt="" className={styles.navIcon} /> Dashboard
            </Link>
            <Link href="/employees/V-Attendance" className={styles.navLink}>
              <img src="/icons/attendance.png" alt="" className={styles.navIcon} /> View Attendance
            </Link>
            <Link href="/employees/Leave_Request" className={styles.navLink}>
              <img src="/icons/leave.png" alt="" className={styles.navIcon} /> Request Leave
            </Link>
            <Link href="/employees/Salary" className={styles.navLink}>
              <img src="/icons/salary.png" alt="" className={styles.navIcon} /> View Salary
            </Link>

            <div onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }} className={styles.navLink}>
              <img src="/icons/logout.png" alt="" className={styles.navIcon} /> Log Out
            </div>
          </nav>
        </aside>




        <main className={styles.mainContent}>
          <section className={`${styles.pageBody} no-print`}>
            <h2 className={styles.sectionHeading}>Dashboard</h2>

            <div className={styles.attendanceHero}>
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
                  backgroundColor: attendanceState === 'CHECKED_IN' ? '#e67300' : '#7a1212'
                }}
              >
                <img src="/icons/check-circle3.png" alt="" className={styles.btnIcon} />
                {loading ? "Processing..." :
                  attendanceState === 'NOT_MARKED' ? "Mark Attendance" :
                    attendanceState === 'CHECKED_IN' ? "Check Out" :
                      "Attendance Completed"}
              </button>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.whiteCard}>
                <img src="/icons/leave-balance.png" alt="" className={styles.cardIcon} />
                <p className={styles.cardLabel}>Leave Balance</p>
                <div className={styles.statValue}>{stats.leaveBalance}</div>
                <p className={styles.statSubtext}>/48 Days left</p>
              </div>

              <div className={styles.whiteCard} onClick={() => setShowHolidays(true)} style={{ cursor: 'pointer' }}>
                <img src="/icons/upcoming.png" alt="" className={styles.cardIcon} />
                <p className={styles.cardLabel}>Upcoming Holiday</p>
                <div className={styles.dateValue}>{stats.upcomingHoliday}</div>
              </div>

              <div className={styles.whiteCard}>
                <img src="/icons/monthly-attendance.png" alt="" className={styles.cardIcon} />
                <p className={styles.cardLabel}>Monthly Attendance</p>
                <div className={styles.attendanceDetail}>
                  <p>{stats.presentDays} Present (On-Time),</p>
                  <p>{stats.lateDays} Late (After 9 AM)</p>
                </div>
              </div>
            </div>

            <h2 className={styles.sectionHeading}>Quick Action</h2>
            <div className={styles.actionsGrid}>
              <Link href="/employees/Leave_Request">
                <button className={styles.actionButton}>
                  <img src="/icons/request-btn.png" alt="" className={styles.smallBtnIcon} /> Request Leave
                </button>
              </Link>
              <button className={styles.actionButton} onClick={handleViewLatestPayslip} disabled={fetchingSalary}>
                <img src="/icons/payslip-btn.png" alt="" className={styles.smallBtnIcon} /> 
                {fetchingSalary ? "Loading..." : "View Latest Payslip"}
              </button>
              <Link href="/employees/Leave_History">
                <button className={styles.actionButton}>
                  <img src="/icons/history-btn.png" alt="" className={styles.smallBtnIcon} /> View Leave History
                </button>
              </Link>
            </div>
          </section>

          {/* PAYSLIP MODAL */}
          {showPayslipModal && latestSalary && (
            <div className={`${styles.modalOverlay}`} onClick={() => setShowPayslipModal(false)}>
              <div className={styles.payslipModalContent} onClick={(e) => e.stopPropagation()}>
                <div id="printable-payslip" className={styles.payslipPrintable}>
                  <div className={styles.payslipHeader}>
                    <div className={styles.companyInfo}>
                      <img src="/logo.png" alt="Logo" className={styles.payslipLogo} />
                      <div>
                        <h2 className={styles.companyName}>LLSOI CAMPUS (PVT) LTD.</h2>
                        <p className={styles.payslipTitleHeader}>Employee Pay Sheet - {getMonthName(latestSalary.month).toUpperCase()} {latestSalary.year}</p>
                      </div>
                    </div>
                    <div className={styles.slipStatus}>
                      <span className={styles.statusTag}>{latestSalary.status}</span>
                    </div>
                  </div>

                  <hr className={styles.divider} />

                  <div className={styles.employeeDetails}>
                    <div className={styles.detailGroup}>
                      <p><strong>Employee Name:</strong> {user?.name}</p>
                      <p><strong>Employee ID:</strong> {user?.username}</p>
                    </div>
                    <div className={styles.detailGroup}>
                      <p><strong>Pay Period:</strong> {getMonthName(latestSalary.month)} {latestSalary.year}</p>
                      <p><strong>Generated Date:</strong> {latestSalary.generatedDate ? new Date(latestSalary.generatedDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>

                  <div className={styles.salaryGrid}>
                    <div className={styles.earningsSection}>
                      <h4>EARNINGS</h4>
                      <div className={styles.salaryRowItem}><span>Basic Salary</span> <span>{Number(latestSalary.basicSalary || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                      <div className={styles.salaryRowItem}><span>Allowances</span> <span>{Number(latestSalary.allowances || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                      <div className={styles.salaryRowItem}><span>Overtime Pay</span> <span>{Number(latestSalary.overtimePay || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                      <div className={styles.salaryTotalItem}><span>GROSS SALARY</span> <span>LKR {Number(latestSalary.grossSalary || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                    </div>

                    <div className={styles.deductionsSection}>
                      <h4>DEDUCTIONS</h4>
                      <div className={styles.salaryRowItem}><span>EPF (8%)</span> <span>{Number(latestSalary.epfDeduction || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                      <div className={styles.salaryRowItem}><span>ETF (3%)</span> <span>{Number(latestSalary.etfDeduction || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                      <div className={styles.salaryRowItem}><span>Other Deductions</span> <span>{Number(latestSalary.otherDeductions || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                      <div className={styles.salaryTotalItem}><span>TOTAL DEDUCTIONS</span> <span>LKR {Number((latestSalary.epfDeduction || 0) + (latestSalary.etfDeduction || 0) + (latestSalary.otherDeductions || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                    </div>
                  </div>

                  <div className={styles.netSalarySection}>
                    <div className={styles.netSalaryLabel}>NET SALARY (TAKE HOME)</div>
                    <div className={styles.netSalaryValue}>LKR {Number(latestSalary.netSalary || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                  </div>

                  <div className={styles.payslipFooter}>
                    <p>This is a computer-generated document and does not require a signature.</p>
                  </div>
                </div>

                <div className={`${styles.modalActions} no-print`}>
                  <button className={styles.printBtn} onClick={handlePrint}>Print / Save as PDF</button>
                  <button className={styles.closeModalBtn} onClick={() => setShowPayslipModal(false)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

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
                  for (let i = 0; i < firstDay; i++) {
                    cells.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
                  }
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
    </div>
  );
};

export default Dashboard;