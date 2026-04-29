import React from 'react';

const ScrollIndicator: React.FC<{ label?: string }> = ({ label = 'اكتشف التجربة' }) => (
  <div className="scroll-indicator" aria-hidden="true">
    <span>{label}</span>
    <div className="scroll-indicator__mouse"><div className="scroll-indicator__dot" /></div>
  </div>
);

export default ScrollIndicator;
