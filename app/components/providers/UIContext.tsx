"use client"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import RedCircle_Animation from '../animation/RedCircle_Animation';

interface UIContextType {
  isHover: boolean;
  setIsHover: (hover: boolean) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  triggerNavigation: (callback: () => void) => void; 
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (navigationTimerRef.current) {
        window.clearTimeout(navigationTimerRef.current);
      }
    };
  }, []);

  const triggerNavigation = useCallback((callback: () => void) => {
    setIsOpen(false);

    if (navigationTimerRef.current) {
      window.clearTimeout(navigationTimerRef.current);
    }

    navigationTimerRef.current = window.setTimeout(() => {
      setIsLoading(true);
      callback();
      navigationTimerRef.current = null;
    }, 100);
  }, []);

  const value = useMemo<UIContextType>(() => ({
    isHover,
    setIsHover,
    isOpen,
    setIsOpen,
    isLoading,
    setIsLoading,
    triggerNavigation
  }), [isHover, isOpen, isLoading, triggerNavigation]);

  const animationPortal =
    isLoading && (
      createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <RedCircle_Animation />
        </div>,
        document.body
      )
    );

  return (
    <UIContext.Provider value={value}>
      {children}
      {animationPortal}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUIContext must be used within a UIProvider");
  }
  return context;
};
