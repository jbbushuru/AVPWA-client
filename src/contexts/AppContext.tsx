import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getSummary, GradeSummary, StrengthDistribution } from '../services/unitService';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeView, setActiveView] = useState<string>('Daily');
  const [gradeDistribution, setGradeDistribution] = useState<GradeSummary[] | null>(null);
  const [strengthDistribution, setStrengthDistribution] = useState<StrengthDistribution[] | null>(null);

  const fetchUnitsSummary = async () => {
    const summary = await getSummary();
    setGradeDistribution(summary.stats);
    setStrengthDistribution(summary.strengths);
  };
  useEffect(() => {
    fetchUnitsSummary();
  }, []);

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
    fetchUnitsSummary,
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
