import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  // Show spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-teal text-sm tracking-widest uppercase">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in — redirect to home with return path saved
  if (!user) {
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  return <>{children}</>;
}
