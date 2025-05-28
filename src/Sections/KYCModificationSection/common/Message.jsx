import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const Message = ({ message }) => {
  if (!message.text) return null;
  
  return (
    <div className={`message message-${message.type}`} role="alert">
      {message.type === 'success' ? <CheckCircle className="icon" /> : <AlertCircle className="icon" />}
      {message.text}
    </div>
  );
};