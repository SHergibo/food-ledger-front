import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function TitleButtonInteraction({title, openTitleMessage, setOpenTitleMessage, icon, contentDiv}) {
  return (
    <>
      <button 
      className="btn-action-title"
      title={title} 
      onClick={() => {setOpenTitleMessage(!openTitleMessage)}}>
        {icon}
      </button>
      {openTitleMessage && 
        <div className="title-interact-container">
        <div className="inner-title-interact-container">
          <div className="header-title-interact-message">
            <h3>{title}</h3>
            <button 
            className="btn-close-title-message" 
            onClick={() => {setOpenTitleMessage(!openTitleMessage)}}>
              <FontAwesomeIcon icon="times" />
            </button>
          </div>
          
          {contentDiv}
        </div>
          
        </div>
      }
    </>
  )
}

TitleButtonInteraction.propTypes = {
  title: PropTypes.string.isRequired,
  openTitleMessage: PropTypes.bool.isRequired,
  setOpenTitleMessage: PropTypes.func.isRequired,
  icon : PropTypes.object.isRequired,
  contentDiv: PropTypes.object.isRequired
}

export default TitleButtonInteraction

