import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getSummary, GradeSummary, StrengthDistribution } from '../services/unitService';
import { getTimetableSettings, TimetableSettings } from '../services/timetableService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';

// Define context state and function types
export interface AppContextType {
  user: any | null;
  setUser: (user: any | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  activeView: string;
  setActiveView: (view: string) => void;
  gradeDistribution: GradeSummary[] | null;
  strengthDistribution: StrengthDistribution[] | null;
  fetchUnitsSummary: () => Promise<void>;
  settings: TimetableSettings | null;
  isAlreadySetup: boolean;
  setSettings: (settings: TimetableSettings | null) => void;
  fetchUserSettings: () => Promise<void>;
}

// Create context with default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Props interface for AppProvider
interface AppProviderProps {
  children: ReactNode;
}

// AppProvider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeView, setActiveView] = useState<string>('Daily');

  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data: summaryData, isLoading: isSummaryLoading, refetch: fetchUnitsSummary } = useQuery({
    queryKey: ['unitsSummary'],
    queryFn: getSummary,
    enabled: isAuthenticated,
  });

  const gradeDistribution = summaryData?.stats || null;
  const strengthDistribution = summaryData?.strengths || null;

  const { 
    data: settingsData, 
    isLoading: isSettingsLoading, 
    error: settingsError, 
    refetch: fetchUserSettingsQuery 
  } = useQuery({
    queryKey: ['timetableSettings'],
    queryFn: getTimetableSettings,
    enabled: isAuthenticated,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    }
  });

  const isLoading = isSummaryLoading || isSettingsLoading;
  
  // Set setup status based on 404 error
  const isAlreadySetup = settingsData ? true : (settingsError as any)?.response?.status === 404 ? false : !!settingsData;
  const settings = (settingsData as TimetableSettings) || null;

  const setSettings = (newSettings: TimetableSettings | null) => {
    // Manually push updated settings into React Query cache
    queryClient.setQueryData(['timetableSettings'], newSettings);
  };

  const setIsLoading = (loading: boolean) => {}; // No-op as requested by removing manual isLoading

  const fetchUserSettings = async () => {
    // Force a fresh request from backend
    await queryClient.invalidateQueries({ queryKey: ['timetableSettings'] });
  };

  const value: AppContextType = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    theme,
    setTheme,
    activeView,
    setActiveView,
    gradeDistribution,
    strengthDistribution,
    fetchUnitsSummary: async () => { await fetchUnitsSummary(); },
    settings,
    isAlreadySetup,
    setSettings,
    fetchUserSettings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to consume the AppContext easily
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
