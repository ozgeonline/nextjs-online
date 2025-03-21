"use client"
import React, {createContext, useContext, useState} from 'react';
import { createPortal } from 'react-dom';
import RedCircle_Animation from '../animation/RedCircle_Animation';

interface CardContextType {
  isHover: boolean;
  setIsHover: (hover: boolean) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  triggerNavigation: (callback: () => void) => void; 
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    <CardContext.Provider 
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
    </CardContext.Provider>
  );
};

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCardContext must be used within a CardProvider");
  }
  return context;
};
