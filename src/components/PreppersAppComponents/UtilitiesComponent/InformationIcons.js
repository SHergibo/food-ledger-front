import React, {useRef, useState, useEffect, useCallback} from 'react';
import { useWindowWidth } from './../DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function InformationIcons({className, icon, message}) {
  const { windowWidth } = useWindowWidth();
  const iconRef = useRef(null);
  const [attrProps, setAttrProps] = useState({});
  const [isEntered, setIsEntered] = useState(false);
  const [messagePopUp, setMessagePopPup] = useState(false);
  const [showCloseIcon, setShowCloseIcon] = useState(true);

  useEffect(() => {
    if (windowWidth < 1320) {
      setShowCloseIcon(true);
    }
    if (windowWidth >= 1320) {
      setShowCloseIcon(false);
    }
  }, [windowWidth]);

  const onMouseEnter = useCallback(() => {
    setMessagePopPup(true);
    if(!isEntered){
      iconRef.current.classList.add('hide-icon-pulse');
    }
    setIsEntered(true);
  }, [isEntered]);


  const onMouseOut = () => {
    setMessagePopPup(false);
  };

  useEffect(() => {
    if(className !== "success-icon"){
      setAttrProps({
        onMouseOver: onMouseEnter,
        onMouseOut: onMouseOut
      })
    }
  }, [className, onMouseEnter]);

  return (
    <div className="info-icon-container">
      <span ref={iconRef} className={`${className}`} {...attrProps}>{icon}</span>
      {messagePopUp && className ==="warning-icon" &&
        <div className="message-box-info-warning">
          {showCloseIcon &&
            <span className="close-message-box-info"><FontAwesomeIcon icon="times" /></span>
          }
          {message}
        </div>
      }
      {messagePopUp && className ==="error-icon" &&
        <div className="message-box-info-error">
          {showCloseIcon &&
            <span className="close-message-box-info"><FontAwesomeIcon icon="times" /></span>
          }
          {message}
        </div>
      }
    </div>
  )
}

InformationIcons.propTypes = {
  className: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  message: PropTypes.string,
}

export default InformationIcons;
