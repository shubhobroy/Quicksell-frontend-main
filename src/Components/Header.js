import React from 'react';
import './Header.css';

const Header = ({ imagePath, title, length }) => {
  return (
    <div className="column-header">
      <div className="header-left">
        <img src={imagePath} alt={title} className="header-icon" />
        <span className="header-title">{title}</span>
        <span className="header-length">{length}</span>
      </div>
      <div className="header-right">
        <img
          src="/images/icons/add.svg"
          alt="Add"
          className="header-right-icon"
          title="Add"
        />
        <img
          src="/images/icons/3 dot menu.svg"
          alt="Menu"
          className="header-right-icon"
          title="Menu"
        />
      </div>
    </div>
  );
};

export default Header;
