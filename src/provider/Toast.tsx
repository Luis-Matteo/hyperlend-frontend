import React, { useEffect, useState } from 'react';
import toastSuccessImage from '../assets/icons/toast-success.svg';
import toastErrorImage from '../assets/icons/toast-error.svg';
import toastInfoImage from '../assets/icons/toast-info.svg';
import xmarkImage from '../assets/icons/xmark-icon.svg';
interface ToastProps {
  title: string;
  content: string;
  txLink: string;
  type: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ title, content, txLink, type }) => {
  const [isExiting, setIsExiting] = useState(false);

  const getToastStyle = (type: string) => {
    switch (type) {
      case 'success':
        return toastSuccessImage;
      case 'error':
        return toastErrorImage;
      case 'info':
        return toastInfoImage;
      default:
        return '';
    }
  };

  // Start exit animation before removing the toast
  useEffect(() => {
    const timer = setTimeout(() => setIsExiting(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`w-[360px] rounded-md transition-all duration-500 ease-in-out transform ${isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
    >
      <div className='px-4 py-5 bg-[#050A09] w-full rounded-md flex justify-between'>
        <div className='flex gap-4'>
          <div className='w-8 h-8 p-0.5'>
            <img
              className='w-full h-full '
              src={getToastStyle(type)}
              alt='toast-status'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <h5 className='text-secondary font-nexa text-sm'>{title}</h5>
            <p className='text-secondary font-nexa text-xs'>{content}</p>
            <a
              className='text-secondary text-xs font-lufga underline'
              href={txLink}
            >
              View transaction
            </a>
          </div>
        </div>
        <div className='w-2 h-2'>
          <img src={xmarkImage} alt='close' />
        </div>
      </div>
    </div>
  );
};

interface ToastListProps {
  toasts: Array<{
    id: number;
    title: string;
    content: string;
    txLink: string;
    type: string;
  }>;
}

const ToastList: React.FC<ToastListProps> = ({ toasts }) => {
  return (
    <div className='fixed bottom-0 right-0 p-4 space-y-2'>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          content={toast.content}
          txLink={toast.txLink}
          type={toast.type as 'success' | 'error' | 'info'}
        />
      ))}
    </div>
  );
};

export default ToastList;
