import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const Toast: React.FC = () => {
  const { error, setError, success, setSuccess } = useContext(AppContext);

  const activeMessage = error || success;
  const isError = !!error;

  useEffect(() => {
    if (activeMessage) {
      const timer = setTimeout(() => {
        if (isError) {
          setError(null);
        } else {
          setSuccess(null);
        }
      }, 3000); // 3 saniye sonra bildirimi kaldır

      return () => clearTimeout(timer);
    }
  }, [activeMessage, isError, setError, setSuccess]);

  if (!activeMessage) {
    return null;
  }

  const baseClasses = "fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-semibold transition-transform transform-gpu animate-fade-in-up";
  const colorClasses = isError 
    ? "bg-red-600" 
    : "bg-green-600";

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      {activeMessage}
    </div>
  );
};

export default Toast;
