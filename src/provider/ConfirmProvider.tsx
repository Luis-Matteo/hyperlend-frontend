import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  // Initialize `confirmed` and `preGuidedConfirm` from localStorage
  const [confirmed, setConfirmed] = useState<boolean>(() => {
    return localStorage.getItem('confirmed') === 'true';
  });

  const [preGuidedConfirm, setPreGuidedConfirm] = useState<boolean>(() => {
    return localStorage.getItem('preGuidedConfirm') === 'true';
  });

  // Initialize `guided` correctly, defaulting to 1 (guide not completed) if undefined
  const [guided, setGuided] = useState<number>(() => {
    return 0;
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

  useEffect(() => {
    // Check if the screen width is less than 1024px
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        if (!confirmed || !(guided === 0)) {
          navigate('/dashboard'); // Redirect to /dashboard if not confirmed and guide is not completed
        }
      }
    };

    handleResize(); // Call on mount to check initial screen width

    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [confirmed, guided, navigate]);

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
