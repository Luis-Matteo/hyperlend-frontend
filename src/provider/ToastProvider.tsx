import React, { createContext, useContext, useState, ReactNode } from 'react';
import ToastList from './Toast';
type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    title: string;
    content: string;
    txLink: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (title: string, content: string, txLink: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [nextId, setNextId] = useState(1);

    const addToast = (title: string, content: string, txLink: string, type: ToastType) => {
        const newToast: Toast = { id: nextId, title, content, txLink, type };
        setToasts((prevToasts) => [...prevToasts, newToast]);
        setNextId((prevId) => prevId + 1);

        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastList toasts={toasts} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
