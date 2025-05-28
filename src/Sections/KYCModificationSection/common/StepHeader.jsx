import React from 'react';

export const StepHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="step-header">
    <div className="step-icon">
      <Icon className="icon" />
    </div>
    <h2>{title}</h2>
    <p>{subtitle}</p>
  </div>
);