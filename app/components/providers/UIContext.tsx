"use client"
import React, {createContext, useContext, useState} from 'react';
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
  const [ isOpen, setIsOpen ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const triggerNavigation = (callback: () => void) => {
      setIsOpen(false); //close dropdown
      setTimeout(() => {
        setIsLoading(true); //show animation after dropdown closes
        callback(); //trigger navigation
      }, 100); //dropdown animation duration
  };

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
    <UIContext.Provider 
      value={{ 
        isHover, 
        setIsHover, 
        isOpen, 
        setIsOpen,
        isLoading,
        setIsLoading,
        triggerNavigation
      }}
    >
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
