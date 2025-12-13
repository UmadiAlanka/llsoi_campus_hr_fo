import React from 'react';
import ForgotPasswordForm from '@/app/forgot-password/ForgotPasswordForm';
import LoginForm from '@/app/login/LoginForm';

export default function ForgotPasswordPage() {
  return (
   <div>
     <ForgotPasswordForm/>
   </div>
  );
    
}

export function Home() {
  return (
   <div>
    <LoginForm/>
   </div>
  );
}
