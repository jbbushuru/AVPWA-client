import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService, LoginDTO, RegisterDTO } from '../services/userService';
import { profileService, Profile } from '../services/profileService';
import { setAccessToken } from '../services/api';
import {PUBLIC_PATHS} from '../constants/constants';

interface User {
  id: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  register: (credentials: RegisterDTO) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const userProfile = await profileService.getMyProfile();
      setProfile(userProfile);
    } catch (error) {
      // Profile might not exist yet if user hasn't completed setup
      setProfile(null);
    }
  };

  // 1. Silent Auth Hydration on App Mount / Page Refresh
useEffect(() => {
  // const init = async () => {
  //   setIsLoading(true);

  //   try {
  //     // if (import.meta.env.DEV) {
  //     //   // 1. DEV MODE: Skip refresh token check, directly load profile using mock bypass
  //     //   const userProfile = await profileService.getMyProfile();
  //     //   setProfile(userProfile);
  //     //   setUser({ id: '6a8426fedeb52eb769292cbe' }); // Set mock user so app knows you're logged in
  //     // } else {
  //       // 2. PRODUCTION MODE: Full auth hydration flow
  //       await userService.checkAuthStatus();
  //       await fetchProfile();
  //     // }
  //   } catch (error) {
  //     console.error('Auth initialization error:', error);
  //     setAccessToken(null);
  //     setUser(null);
  //     setProfile(null);
  //   } finally {
  //     setIsLoading(false); // ALWAYS runs to unblock the UI
  //   }
  // };

  const init = async () => {
    setIsLoading(true);

    // 1. Skip auth checks if user is on login/register pages
    const publicPaths = PUBLIC_PATHS;
    if (publicPaths.includes(window.location.pathname)) {
      setIsLoading(false);
      return;
    }

    try {
      await userService.checkAuthStatus();
      await fetchProfile();
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAccessToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  init();
}, []);

  // 2. Login Flow
  const login = async (credentials: LoginDTO) => {
    setIsLoading(true);
    try {
      const data = await userService.login(credentials);
      setUser({ id: data.userId });
      await fetchProfile();
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Register Flow
  const register = async (credentials: RegisterDTO) => {
    setIsLoading(true);
    try {
      const data = await userService.register(credentials);
      setUser({ id: data.userId });
      setProfile(null); // New account won't have a profile yet
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Logout Flow
  const logout = async () => {
    setIsLoading(true);
    try {
      await userService.logout();
    } finally {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user || !!profile,
        isLoading,
        login,
        register,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for accessing Auth state across your app
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};