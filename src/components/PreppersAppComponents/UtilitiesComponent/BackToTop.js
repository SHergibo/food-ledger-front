import React, { useEffect, useState } from "react";
import { animateScroll as scroll } from 'react-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function BackToTop() {
  const [show, setShow] = useState(false);

  const handleBackToTopScroll= () => {
    let scrollpage = Math.round(window.scrollY);
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    if (scrollpage > windowHeight/3 && windowWidth < 1320) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleBackToTopScroll);
    return () => {
      window.removeEventListener('scroll', handleBackToTopScroll);
    }
  }, []);
  
  const scrollToTop = () =>{
    scroll.scrollToTop();
  }
  
  return (
    <>
      {show && 
        <div tabIndex={0} className="back-to-top" onClick={scrollToTop} onKeyPress={scrollToTop}>
          <FontAwesomeIcon icon="chevron-up" />
        </div>
      }
    </>
  );
}

export default BackToTop;