import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConfirmContextType {
    confirmed: boolean;
    confirm: () => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

interface ConfirmProviderProps {
    children: ReactNode;
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
    const [confirmed, setConfirmed] = useState<boolean>(() => {
        return localStorage.getItem('confirmed') === 'true';
    });

    const confirm = () => {
        setConfirmed(true);
        localStorage.setItem('confirmed', 'true');
    };

    return (
        <ConfirmContext.Provider value={{ confirmed, confirm }}>
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
