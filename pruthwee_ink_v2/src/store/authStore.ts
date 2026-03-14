import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, VolunteerProfile } from '../types';

interface AuthState {
  user:     AuthUser | null;
  profile:  VolunteerProfile | null;
  loading:  boolean;
  setUser:     (user: AuthUser | null) => void;
  setProfile:  (profile: VolunteerProfile | null) => void;
  setLoading:  (loading: boolean) => void;
  logout:      () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      loading: false,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (loading) => set({ loading }),

      logout: () => set({ user: null, profile: null }),
    }),
    {
      name: 'pruthwee-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
      }),
    }
  )
);
