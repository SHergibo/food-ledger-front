import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

function TitleButtonInteraction({openTitleMessage, setOpenTitleMessage, icon, contentDiv}) {
  return (
    <>
      <button 
      className="btn-action-title" 
      onClick={() => {setOpenTitleMessage(!openTitleMessage)}}>
        {icon}
      </button>
      {openTitleMessage && 
        <div className="title-message">
          <button 
          className="btn-close-title-message" 
          onClick={() => {setOpenTitleMessage(!openTitleMessage)}}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          {contentDiv}
        </div>
      }
    </>
  )
}

TitleButtonInteraction.propTypes = {
  openTitleMessage: PropTypes.bool.isRequired,
  setOpenTitleMessage: PropTypes.func.isRequired,
  icon : PropTypes.object.isRequired,
  contentDiv: PropTypes.object.isRequired
}

export default TitleButtonInteraction

