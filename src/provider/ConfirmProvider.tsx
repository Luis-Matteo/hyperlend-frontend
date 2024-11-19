import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConfirmContextType {
  confirmed: boolean;
  preGuidedConfirm: boolean;
  confirm: () => void;
  gotoGuide: () => void;
  skipGuide: () => void;
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
  // Initialize `confirmed` and `preGuidedConfirm` from localStorage
  const [confirmed, setConfirmed] = useState<boolean>(() => {
    return localStorage.getItem('confirmed') === 'true';
  });

  const [preGuidedConfirm, setPreGuidedConfirm] = useState<boolean>(() => {
    return localStorage.getItem('preGuidedConfirm') === 'true';
  });

  // Initialize `guided` correctly, defaulting to 1 (guide not completed) if undefined
  const [guided, setGuided] = useState<number>(() => {
    return localStorage.getItem('guideCompleted') === 'true' ? 0 : 1;
  });

  // Confirm action
  const confirm = () => {
    setConfirmed(true);
    localStorage.setItem('confirmed', 'true');
  };

  // Start the guide
  const gotoGuide = () => {
    setPreGuidedConfirm(true);
    localStorage.setItem('preGuidedConfirm', 'true');
    setGuided(1); // Ensure the guide starts at step 1
  };

  // Skip the guide
  const skipGuide = () => {
    setPreGuidedConfirm(true);
    localStorage.setItem('preGuidedConfirm', 'true');
    setGuided(0); // Set guide as completed
  };

  // Navigate to the next step in the guide
  const nextStep = () => {
    if (guided > 0 && guided < 4) {
      setGuided((prev) => prev + 1);
    } else {
      closeGuide();
    }
  };

  // Close the guide and mark as completed
  const closeGuide = () => {
    setGuided(0); // Reset the guide
    localStorage.setItem('guideCompleted', 'true');
  };

  return (
    <ConfirmContext.Provider
      value={{
        confirmed,
        preGuidedConfirm,
        confirm,
        gotoGuide,
        skipGuide,
        guided,
        nextStep,
        closeGuide,
      }}
    >
      {children}
    </ConfirmContext.Provider>
  );
};

// Hook to use the ConfirmContext
export const useConfirm = (): ConfirmContextType => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
