import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
            <FontAwesomeIcon icon="times" />
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

