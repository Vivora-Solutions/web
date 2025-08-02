import React, { useState, useEffect } from 'react';
import './OpeningDays.css';
import API from '../../../../utils/api';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

const OpeningHours = () => {
  const [openingHours, setOpeningHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ];

  useEffect(() => {
    const fetchOpeningHours = async () => {
      setIsLoading(true);
      try {
        const response = await API.get('/salon-admin/opening-hours');
        // Ensure we have exactly 7 days
        const days = response.data.days || [];
        const completeDays = Array(7).fill().map((_, index) => {
          const existingDay = days.find(d => d.day_of_week === index);
          return existingDay || {
            day_of_week: index,
            is_open: false,
            opening_time: null,
            closing_time: null
          };
        });
        setOpeningHours(completeDays);
      } catch (error) {
        console.error('Error fetching opening hours:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpeningHours();
  }, []);

  const handleToggleOpen = (index) => {
    const updatedHours = [...openingHours];
    updatedHours[index].is_open = !updatedHours[index].is_open;

    if (!updatedHours[index].is_open) {
      updatedHours[index].opening_time = null;
      updatedHours[index].closing_time = null;
    } else {
      updatedHours[index].opening_time = updatedHours[index].opening_time || '10:00:00';
      updatedHours[index].closing_time = updatedHours[index].closing_time || '17:00:00';
    }

    setOpeningHours(updatedHours);
  };

  const handleTimeChange = (index, field, value) => {
    const updatedHours = [...openingHours];
    const formattedValue = value ? `${value}:00` : null;
    updatedHours[index][field] = formattedValue;
    setOpeningHours(updatedHours);
  };

  const formatTimeForDisplay = (time) => {
    if (!time) return '--:-- --';
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'pm' : 'am';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const formatTimeForInput = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const handleSave = async () => {
    try {
      const payload = {
        daysData: openingHours.map(day => ({
          day_of_week: day.day_of_week,
          is_open: day.is_open,
          opening_time: day.is_open ? day.opening_time : null,
          closing_time: day.is_open ? day.closing_time : null
        }))
      };

      await API.post('/salon-admin/opening-hours', payload);
      setIsEditing(false);
      alert('Opening hours updated successfully!');
    } catch (error) {
      console.error('Error updating opening hours:', error);
      alert(`Failed to update opening hours: ${error.response?.data?.error || error.message}`);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading opening hours..." />;
  }
  return (
    <div className="opening-hours-container">
      <div className="opening-hours-header">
        <h2>Opening Hours</h2>
        <div className="opening-hours-actions">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleSave} className="save-button">
                Save Changes
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Edit Hours
            </button>
          )}
        </div>
      </div>

      <table className="opening-hours-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Open</th>
            <th>Opening Time</th>
            <th>Closing Time</th>
          </tr>
        </thead>
        <tbody>
          {openingHours.map((day, index) => (
            <tr key={day.day_of_week}>
              <td>{daysOfWeek[day.day_of_week]}</td>
              <td>
                <input
                  type="checkbox"
                  checked={day.is_open}
                  onChange={() => handleToggleOpen(index)}
                  disabled={!isEditing}
                />
              </td>
              <td>
                {isEditing && day.is_open ? (
                  <input
                    type="time"
                    value={formatTimeForInput(day.opening_time)}
                    onChange={(e) => handleTimeChange(index, 'opening_time', e.target.value)}
                    disabled={!day.is_open}
                  />
                ) : (
                  formatTimeForDisplay(day.opening_time)
                )}
              </td>
              <td>
                {isEditing && day.is_open ? (
                  <input
                    type="time"
                    value={formatTimeForInput(day.closing_time)}
                    onChange={(e) => handleTimeChange(index, 'closing_time', e.target.value)}
                    disabled={!day.is_open}
                  />
                ) : (
                  formatTimeForDisplay(day.closing_time)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OpeningHours;