import React from "react";

const SpinnerLoading = ({size = 200, bgColor = '#f1f5f9'}) => {
  const halfSize = size / 2;
  return (
    <div className="spinner-box" style={{width: `${size}px`, height: `${size}px`}}>
      <div className="circle-border" style={{width: `${halfSize}px`, height: `${halfSize}px`}}>
        <div className="circle-core" style={{backgroundColor: bgColor}}></div>
      </div>
    </div>
  );
};

export default SpinnerLoading;
