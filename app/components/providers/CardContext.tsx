"use client"
import React, {createContext, useContext, useState} from 'react';

interface CardContextType {
  isHover: boolean;
  setIsHover: (hover: boolean) => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <CardContext.Provider value={{ isHover, setIsHover }}>
      {children}
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
