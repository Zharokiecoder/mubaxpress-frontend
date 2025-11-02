import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Image = ({ src, alt, className, fallback = 'https://via.placeholder.com/400' }) => {
  // Check if image is from our server or external
  const getImageUrl = () => {
    if (!src) return fallback;
    
    // If it's already a full URL (http/https), return as is
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    
    // If it starts with /uploads, prepend API base URL
    if (src.startsWith('/uploads')) {
      return `${API_BASE_URL}${src}`;
    }
    
    // Otherwise, assume it's a placeholder or external
    return src;
  };

  return (
    <img
      src={getImageUrl()}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.src = fallback;
      }}
    />
  );
};

export default Image;