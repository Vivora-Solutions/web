import React from 'react';

const StarRating = () => {
  const rating = 4; // Set to 4 stars as per the image

  return (
    <>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21 12 17.77 5.82 21 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <style jsx>{`
        .star-rating {
          display: flex;
          gap: 5px;
        }
        .star {
          color: #ccc; /* Empty star color */
        }
        .star.filled {
          color: #ffd700; /* Filled star color (yellow) */
        }
      `}</style>
    </>
  );
};

export default StarRating;