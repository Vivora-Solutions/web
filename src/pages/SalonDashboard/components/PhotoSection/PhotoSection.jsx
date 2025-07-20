import React from 'react'
import { assets } from '../../../../assets/assets'
import  './PhotoSection.css'

const PhotoSection = () => {
  return (
    <div className="card photos-card">
        <h2>Photos</h2>
        <div className="photos-grid">
            <div className="add-photos-placeholder">
            <span className="plus-icon">+</span>
            <p>Add Photos</p>
            </div>
            {[...Array(4)].map((_, index) => (
            <img
                key={index}
                src={assets.salonImage}
                alt="Salon Interior"
                className="salon-photo-thumbnail"
            />
            ))}
            <button className="next-button">&gt;</button> {/* Next button for slider */}
        </div>
    </div>
  )
}

export default PhotoSection
