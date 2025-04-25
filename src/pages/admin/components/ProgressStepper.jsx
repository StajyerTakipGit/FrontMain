import React from 'react';
import { FiCheck } from 'react-icons/fi';
import './ProgressStepper.css';

const ProgressStepper = ({ currentStatus, steps }) => {
  const currentIndex = steps.findIndex(step => step.status === currentStatus);
  
  return (
    <div className="progress-stepper">
      <div className="stepper-track">
        {steps.map((step, index) => (
          <React.Fragment key={step.status}>
            <div className={`stepper-step ${index <= currentIndex ? 'completed' : ''}`}>
              <div className="step-icon">
                {index < currentIndex ? <FiCheck /> : index + 1}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`stepper-connector ${index < currentIndex ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="current-status">
        Mevcut Durum: <strong>{steps[currentIndex]?.label}</strong>
      </div>
    </div>
  );
};

export default ProgressStepper;