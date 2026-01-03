import LoginForm from '@/app/login/LoginForm';
import Dashboard from '@/app/admin-dashboard/Dashboard';
import Attendance from '@/app/attendance/Attendance';
import AdminManage from '@/app/admin-dashboard/admin-manage-users/adminManage';  
import AdminAddUser from '@/app/admin-dashboard/admin-manage-users/adminAddUser';
import AdminAttendance from '@/app/admin-dashboard/admin-attendance/adminAttendance';  

export default function Home() {
  return (
   <div>
     <AdminAttendance/>
   </div>
  );
}

