import React from 'react';

interface Loading3DProps {
  message?: string;
}

const Loading3D: React.FC<Loading3DProps> = ({ message = 'Loading 3D Experience...' }) => {
  return (
    <div className="loading-3d">
      <div className="loading-3d__spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-3d__message">{message}</p>
    </div>
  );
};

export default Loading3D;
