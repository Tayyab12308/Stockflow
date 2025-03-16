import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Flyout = ({ open, onClose, title, body, buttons = [] }) => {
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => {
    if (open) {
      setInternalOpen(true);
    }
  }, [open]);

  const closeFlyout = () => {
    setInternalOpen(false);
    if (onClose) onClose();
  };

  if (!internalOpen) return null;

  const handleOverlayClick = () => {
    closeFlyout();
  };

  const handleContentClick = (e) => {
    // Prevent clicks inside the modal from closing the flyout.
    e.stopPropagation();
  };

  const handleButtonClick = (buttonCallback) => {
    if (buttonCallback) buttonCallback();
    closeFlyout();
  };

  return (
    <div className="flyout-overlay" onClick={handleOverlayClick}>
      <div className="flyout-modal" onClick={handleContentClick}>
        <div className="flyout-header">
          <div className="flyout-title">{title}</div>
          <div className="flyout-close-button" onClick={closeFlyout}>
            <svg fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="m13.414 12 6.293-6.293-1.414-1.414L12 10.586 5.707 4.293 4.293 5.707 10.586 12l-6.293 6.293 1.414 1.414L12 13.414l6.293 6.293 1.414-1.414L13.414 12Z" fill="white"></path>
            </svg>
          </div>
        </div>
        <div className="flyout-body">{body}</div>
        {buttons.length > 0 && (
          <div className="flyout-button-container">
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`flyout-button ${button.className}`}
                onClick={() => handleButtonClick(button.onClick)}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Flyout.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.node.isRequired,
  body: PropTypes.node.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      className: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
};

export default Flyout;
