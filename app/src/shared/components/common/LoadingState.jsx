import React from 'react';
import Spinner from './Spinner';

const LoadingState = ({
  className = "bg-gray-50 rounded-lg p-8 text-center"
}) => {
  return (
    <div className={className}>
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    </div>
  );
};

export default LoadingState;
