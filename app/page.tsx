import LoginForm from '@/app/login/LoginForm';
import Dashboard from '@/app/admin-dashboard/Dashboard';
import Attendance from '@/app/attendance/Attendance';
import AdminManage from '@/app/admin-dashboard/admin-manage-users/adminManage';    

export default function Home() {
  return (
   <div>
     <AdminManage/>
   </div>
  );
}

