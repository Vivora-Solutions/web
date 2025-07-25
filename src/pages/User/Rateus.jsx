// src/pages/RateUs.js

import React, { useState } from 'react';
import './Rateus.css';
import BlackButton from '../User/componants/blackbutton';

const RateUs = () => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === '') {
      alert('Please provide a rating and comment.');
      return;
    }

    console.log({ rating, comment });
    alert('Thank you for your feedback!');
    setRating(0);
    setComment('');
  };

  return (
    <div className="rate-container">
      <div className="rate-box">
        <h2>Rate Your Experience</h2>

        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${hovered >= star || rating >= star ? 'filled' : ''}`}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          className="comment-box"
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <BlackButton onClick={handleSubmit}>Submit</BlackButton>
      </div>
    </div>
  );
};

export default RateUs;
