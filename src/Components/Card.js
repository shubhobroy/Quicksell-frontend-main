import React, { useState } from 'react';
import './Card.css';
import { LuMoreHorizontal } from 'react-icons/lu';

const Card = ({ id, title, tag }) => {
  // State to manage the visibility of card details
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function to handle card click
  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="ticket-card" onClick={toggleDetails}> {/* Toggle on click */}
      <div className="card-nav">
        <div className="card-id">{id}</div>
        <div className="imageContainer">
          <img
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            src="https://i1.rgstatic.net/ii/profile.image/732777481768961-1551719174431_Q512/Emanuel_Traeger.jpg"
            alt="UserImage"
          />
        </div>
      </div>
      <div className="card-title">{title}</div>
      <div className="card-container">
        <div className="urgent-icon"><LuMoreHorizontal color="#797d84" /></div>
        <div className="card-tag">
          <div className='tag-icon'></div>{tag}
        </div>
      </div>
      {/* Conditionally render the details section based on isOpen state */}
      {isOpen && (
        <div className="card-details">
          <p>Additional details about the card can go here.</p>
        </div>
      )}
    </div>
  );
};

export default Card;
