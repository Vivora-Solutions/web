import React from 'react';
import './SalonDashboard.css'; // Don't forget to import the CSS file
import Header from '../../components/Header/Header';
import salonImage from '../../assets/salonImage.png';

const SalonDashboard = () => {
  return (
    <div>
        <Header />
        <div className="salon-dashboard-container">
        <div className="salon-header">
            <div className="salon-logo-section">
            <img src={salonImage} alt="Liyo Saloon Logo" className="salon-logo" />
            </div>
            <div className="salon-info-section">
            <div className="salon-title-row">
                <h1>Liyo Saloon</h1>
                <span className="edit-icon">&#9998;</span> {/* Unicode for pencil icon */}
            </div>
            <p className="salon-category">Hair Salon</p>
            <div className="salon-description">
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised</p>
                <button className="edit-description-button">Edit Description</button>
            </div>
            </div>
        </div>

        <div className="dashboard-content">
            {/* Opening Days Section */}
            <div className="card opening-days-card">
            <h2>Opening Days</h2>
            <div className="opening-days-grid">
                <p>Date</p>
                <p>Time</p>
                <div className="time-range-display">
                <span className="time-value">9:00 am</span>
                <span className="time-separator">-</span>
                <span className="time-value">5:00 pm</span>
                </div>
                <span className="edit-icon">&#9998;</span>

                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                <React.Fragment key={day}>
                    <div className="day-entry">
                    <span className="checkbox checked"></span> {/* Green square */}
                    <p>{day}</p>
                    </div>
                    <div className="time-entry">
                    <span className="time-value">8:00 am</span>
                    <span className="time-separator">-</span>
                    <span className="time-value">5:00 pm</span>
                    </div>
                    <span className="edit-icon">&#9998;</span>
                </React.Fragment>
                ))}
            </div>
            <button className="save-update-button">Save and Update</button>
            </div>

            {/* Photos Section */}
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
                    src="http://googleusercontent.com/file_content/0"
                    alt="Salon Interior"
                    className="salon-photo-thumbnail"
                />
                ))}
                <button className="next-button">&gt;</button> {/* Next button for slider */}
            </div>
            </div>

            {/* Services Section */}
            <div className="card services-card">
            <h2>Services</h2>
            <div className="show-prices-checkbox">
                <input type="checkbox" id="showPrices" defaultChecked />
                <label htmlFor="showPrices">Show Prices</label>
            </div>
            <div className="services-grid-header">
                <p>Service</p>
                <p>Price</p>
                <p>Time</p>
            </div>
            <button className="add-service-button">+ Add Service</button>
            {[...Array(3)].map((_, index) => (
                <div className="service-item" key={index}>
                <p className="service-name">Hair Cutting and Shaving</p>
                <div className="service-actions">
                    <span className="edit-icon">&#9998;</span>
                    <span className="delete-icon">&#128465;</span> {/* Unicode for trash can icon */}
                </div>
                <p className="service-price">Rs. 1400</p>
                <p className="service-time">15 minutes</p>
                </div>
            ))}
            <button className="save-update-button">Save and Update</button>
            </div>

            {/* Employees Section */}
            <div className="card employees-card">
            <h2>Employees</h2>
            <button className="add-employee-button">+ Add Employee</button>
            {[...Array(2)].map((_, index) => (
                <div className="employee-item" key={index}>
                <img src="https://via.placeholder.com/40" alt="Employee Avatar" className="employee-avatar" />
                <p className="employee-name">Ruwan</p>
                <span className="edit-icon">&#9998;</span>
                <span className="delete-icon">&#128465;</span>
                <p className="employee-contact">722225789v</p>
                </div>
            ))}
            <button className="save-update-button">Save and Update</button>
            </div>
        </div>
        </div>
    </div>
  );
};

export default SalonDashboard;