import React, { useState } from 'react'
import './OpeningDays.css';
import { FaRegEdit } from "react-icons/fa";
import EditableField from '../../../../components/EditableField/EditableField';

const OpeningDays = () => {
  const [openingDays, setOpeningDays] = useState([
    { day: 'Monday', checked: true, startTime: '9:00', startPeriod: 'am', endTime: '5:00', endPeriod: 'pm' },
    { day: 'Tuesday', checked: true, startTime: '9:00', startPeriod: 'am', endTime: '5:00', endPeriod: 'pm' },
    { day: 'Wednesday', checked: true, startTime: '9:00', startPeriod: 'am', endTime: '5:00', endPeriod: 'pm' },
    { day: 'Thursday', checked: false, startTime: '9:00', startPeriod: 'am', endTime: '5:00', endPeriod: 'pm' },
    { day: 'Friday', checked: true, startTime: '9:00', startPeriod: 'am', endTime: '5:00', endPeriod: 'pm' },
    { day: 'Saturday', checked: true, startTime: '9:00', startPeriod: 'am', endTime: '5:00', endPeriod: 'pm' },
    { day: 'Sunday', checked: false, startTime: '9:00', startPeriod: 'am', endTime: '5:00', endPeriod: 'pm' }
  ]);

  const [globalTime, setGlobalTime] = useState({
    startTime: '9:00',
    startPeriod: 'am',
    endTime: '5:00',
    endPeriod: 'pm'
  });

  const [editingRowIndex, setEditingRowIndex] = useState(null);

  const handleCheckboxChange = (index) => {
    setOpeningDays(prevDays => 
      prevDays.map((day, i) => 
        i === index ? { ...day, checked: !day.checked } : day
      )
    );
  };

  const handleTimeChange = (field, value) => {
    setGlobalTime(prev => ({
      ...prev,
      [field]: value
    }));

    // Update all rows with the new global time
    setOpeningDays(prevDays => 
      prevDays.map(day => ({
        ...day,
        [field]: value
      }))
    );
  };

  const handleRowTimeEdit = (index) => {
    setEditingRowIndex(index);
  };

  const handleRowTimeSave = (index, newTimeString) => {
    // Parse the time string (e.g., "9:00 am - 5:00 pm")
    const timeRegex = /(\d{1,2}:\d{2})\s*(am|pm)\s*-\s*(\d{1,2}:\d{2})\s*(am|pm)/i;
    const match = newTimeString.match(timeRegex);
    
    if (match) {
      const [, startTime, startPeriod, endTime, endPeriod] = match;
      setOpeningDays(prevDays => 
        prevDays.map((day, i) => 
          i === index ? { 
            ...day, 
            startTime, 
            startPeriod: startPeriod.toLowerCase(), 
            endTime, 
            endPeriod: endPeriod.toLowerCase() 
          } : day
        )
      );
    }
    setEditingRowIndex(null);
  };

  const formatTimeString = (day) => {
    return `${day.startTime} ${day.startPeriod} - ${day.endTime} ${day.endPeriod}`;
  };

  return (
    <div>
      <div className="card opening-days-card">
        <div className="opening-days-header">
            <h2>Opening Days</h2>
            <div className="time-controls">
            <h3>Time</h3>
            <select 
              className="time-select" 
              value={globalTime.startTime}
              onChange={(e) => handleTimeChange('startTime', e.target.value)}
            >
                <option value="8:00">8:00</option>
                <option value="9:00">9:00</option>
                <option value="10:00">10:00</option>
            </select>
            <select 
              className="period-select"
              value={globalTime.startPeriod}
              onChange={(e) => handleTimeChange('startPeriod', e.target.value)}
            >
                <option value="am">am</option>
                <option value="pm">pm</option>
            </select>
            <span className="time-separator">-</span>
            <select 
              className="time-select"
              value={globalTime.endTime}
              onChange={(e) => handleTimeChange('endTime', e.target.value)}
            >
                <option value="4:00">4:00</option>
                <option value="5:00">5:00</option>
                <option value="6:00">6:00</option>
            </select>
            <select 
              className="period-select"
              value={globalTime.endPeriod}
              onChange={(e) => handleTimeChange('endPeriod', e.target.value)}
            >
                <option value="am">am</option>
                <option value="pm">pm</option>
            </select>
            </div>
        </div>
        
        <div className="opening-days-table">
            <div className="table-header">
            <span>Date</span>
            <span>Time</span>
            </div>
            
            {openingDays.map((dayInfo, index) => (
            <div className={`table-row ${!dayInfo.checked ? 'row-disabled' : ''}`} key={dayInfo.day}>
                <div className="day-column">
                <input 
                    type="checkbox" 
                    checked={dayInfo.checked}
                    className="day-checkbox"
                    onChange={() => handleCheckboxChange(index)}
                />
                <span className={`day-name ${!dayInfo.checked ? 'disabled' : ''}`}>
                    {dayInfo.day}
                </span>
                </div>
                <div className="time-column">
                {editingRowIndex === index ? (
                    <EditableField
                        value={formatTimeString(dayInfo)}
                        onSave={(newValue) => handleRowTimeSave(index, newValue)}
                        className="time-editable-field"
                        placeholder="e.g., 9:00 am - 5:00 pm"
                    />
                ) : (
                    <>
                        <span className={`time-display ${!dayInfo.checked ? 'disabled' : ''}`}>
                            <span className="start-time">{dayInfo.startTime} {dayInfo.startPeriod}</span>
                            <span className="time-separator"> - </span>
                            <span className="end-time">{dayInfo.endTime} {dayInfo.endPeriod}</span>
                        </span>
                        <span 
                            className="edit-icon" 
                            onClick={() => handleRowTimeEdit(index)}
                            style={{ cursor: 'pointer' }}
                        >
                            <FaRegEdit />
                        </span>
                    </>
                )}
                </div>
            </div>
            ))}
        </div>
        
        <button className="save-update-button">Save and Update</button>
        </div>
    </div>
  )
}

export default OpeningDays