import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';

interface RoleGuardProps {
  children: React.ReactNode;
  role:     UserRole;
}

export default function RoleGuard({ children, role }: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user || user.role !== role) {
    // Wrong role — send them to their correct home
    const redirectMap: Record<UserRole, string> = {
      volunteer:  '/dashboard',
      organiser:  '/organiser/dashboard',
      admin:      '/admin',
    };
    return <Navigate to={redirectMap[user?.role ?? 'volunteer']} replace />;
  }

  return <>{children}</>;
}
