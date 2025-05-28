import React from 'react';

export const FormInput = ({ label, children, help }) => (
  <div className="form-group">
    <label>{label}</label>
    {children}
    {help && <small>{help}</small>}
  </div>
);
