import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import ScaleLoader from "react-spinners/ScaleLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Loading({ loading, errorFetch, retryFetch }) {
  const [animLoading, setAnimLoading] = useState(true);
  const loadingRef = useRef(null);

  useEffect(() => {
    let animationLoading;
    let deleteContainerLoading;
    if(loading){
      setAnimLoading(true);
    }else{
      animationLoading = setTimeout(() => {
        loadingRef.current.style.opacity = 0; 
      }, 300);

      deleteContainerLoading = setTimeout(() => {
        setAnimLoading(false);
      }, 800);
    }
    
    return () => {
      clearInterval(animationLoading);
      clearInterval(deleteContainerLoading);
    }

  }, [loading]);

  return (
    <>
      {animLoading && 
        <div ref={loadingRef} className="loading-container">
          {!errorFetch &&
            <div className="loader">
              <ScaleLoader
                color={"#6337d2"}
                loading={animLoading}
              />
              <p>Chargement des données</p>
            </div>
          }
          {errorFetch &&
            <div className="loader">
              <p>Une erreur est survenue !</p>
              <button className="btn-purple" onClick={retryFetch}><FontAwesomeIcon icon="undo" className="btn-icon" />Réessayer</button>
            </div>
          }
        </div>
      }
    </>
  )
}

Loading.propTypes = {
  loading : PropTypes.bool.isRequired,
  errorFetch : PropTypes.bool.isRequired,
  retryFetch : PropTypes.func.isRequired,
}

export default Loading


