import React from 'react';
import Logo from './Logo';

function SubNav() {
  return (
    <div className="container-subnav">
      <Logo />
      <div className="interaction-sub-menu">
        <p>Notifications</p>
        <p>Img profil</p>
        <p>Logout</p>
      </div>
    </div>
  )
}

export default SubNav;
