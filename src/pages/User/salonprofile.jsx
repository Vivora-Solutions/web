import React, { useState } from 'react';
import Header from './componants/header';
import StarRating from './componants/rating';
import LocationIndicator from './componants/location';
import './salonprofile.css';
import salonLogo from '../../assets/images/salonLogo.png';
import salonImage from '../../assets/images/salonimage.png';


const HomePage = () => {
  const salonData = {
    name: 'Liyo Salon',
    type: 'Hair and Beauty',
    rating: 4,
    location: 'Colombo',
    logo: 'salonLogo',
    images: [
      salonImage,
     salonImage,
     salonImage,
     salonImage,
      salonImage,
       salonImage,
        salonImage,
     

    ],
    services: [
      { name: 'Hair Cutting and Shaving', price: 1400, duration: '45 minutes', category: 'Male' },
      { name: 'Oil Massage', price: 300, category: 'Unisex' },
      { name: 'Beard Trimming', price: 300, category: 'Male' },
      { name: 'Hair Coloring', price: 1500, category: 'Female' },
      { name: 'Kids Haircut', price: 800, category: 'Children' },
      { name: 'Facial', price: 1200, category: 'Female' },
      { name: 'Full Body Massage', price: 2500, category: 'Unisex' },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState('Male');
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const exists = selectedServices.find((s) => s.name === service.name);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.name !== service.name));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const duration = selectedServices.length > 0 ? selectedServices[0].duration || 'Varies' : '0 minutes';

  const filteredServices = salonData.services.filter(
    (service) => service.category === selectedCategory
  );

  const categoryOptions = ['Male', 'Female', 'Children', 'Unisex'];

  return (
    <div className="page">
      <Header />
      <div className="salon-details">
        <div className="salon-logo">
          <img src={salonLogo} alt="salonLogo" />
        </div>
        <div className="salon-info">
          <h2>{salonData.name}</h2>
          <p>{salonData.type}</p>
          <StarRating rating={salonData.rating} />
          <LocationIndicator location={salonData.location} />
        </div>
      </div>

      <div className="salon-images">
        {salonData.images.map((img, i) => (
          <img key={i} src={img} alt={`Salon ${i + 1}`} />
        ))}
      </div>

      <div className="services-section">
        <div className="filters">
          <span>Services</span>
          <div>
            {categoryOptions.map((category) => (
              <button
                key={category}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <input type="text" placeholder="Search Services" />
        </div>

        <div className="services-list centered">
          {filteredServices.map((service, index) => (
            <div key={index} className="service-item">
              <input
                type="checkbox"
                onChange={() => toggleService(service)}
                checked={selectedServices.some((s) => s.name === service.name)}
              />
              <span>{service.name}</span>
              <span>Rs {service.price}</span>
            </div>
          ))}
        </div>

        <div className="payment-summary">
          <button>💳 Pay at Venue</button>
          <div>
            <strong>Duration</strong>
            <span>{duration}</span>
          </div>
          <div>
            <strong>Total</strong>
            <span>Rs {total}</span>
          </div>
          <button className="proceed-button">Proceed</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
