import React from 'react';

const PageIndicator = ({ sectionsCount, selectedIndex }) => {
  return (
    <div className="page-indicator">
      {[...Array(sectionsCount)].map((_, index) => (
        <div
          key={index}
          className={`indicator ${index === selectedIndex ? 'selected' : ''}`}
        />
      ))}
    </div>
  );
};

export default PageIndicator;
