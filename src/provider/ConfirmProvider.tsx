import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConfirmContextType {
  confirmed: boolean;
  confirm: () => void;
  guided: number;
  nextStep: () => void;
  closeGuide: () => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

interface ConfirmProviderProps {
  children: ReactNode;
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({
  children,
}) => {
  const [confirmed, setConfirmed] = useState<boolean>(() => {
    return localStorage.getItem('confirmed') === 'true';
  });

  const [guided, setGuided] = useState<number>(() => {
    return localStorage.getItem('guideCompleted') === 'true' ? 0 : 1;
  });

  const confirm = () => {
    setConfirmed(true);
    localStorage.setItem('confirmed', 'true');
    if (!localStorage.getItem('guideCompleted')) {
      setGuided(1); 
    }
  };

  const nextStep = () => {
    if (guided < 4) {
      setGuided((prev) => prev + 1);
    } else {
      localStorage.setItem('guideCompleted', 'true');
      setGuided(0); 
    }
  };

  const closeGuide = () => {
    localStorage.setItem('guideCompleted', 'true');
    setGuided(0);
  };
  return (
    <ConfirmContext.Provider value={{ confirmed, confirm, guided, nextStep, closeGuide }}>
      {children}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmContextType => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
