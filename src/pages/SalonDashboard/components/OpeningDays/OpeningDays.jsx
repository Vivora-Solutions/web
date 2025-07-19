import React from 'react'
import './OpeningDays.css';
import { FaRegEdit } from "react-icons/fa";


const OpeningDays = () => {
  return (
    <div>
      <div className="card opening-days-card">
        <div className="opening-days-header">
            <h2>Opening Days</h2>
            <div className="time-controls">
            <h3>Time</h3>
            <select className="time-select">
                <option>9:00</option>
                <option>8:00</option>
                <option>10:00</option>
            </select>
            <select className="period-select">
                <option>am</option>
                <option>pm</option>
            </select>
            <span className="time-separator">-</span>
            <select className="time-select">
                <option>5:00</option>
                <option>4:00</option>
                <option>6:00</option>
            </select>
            <select className="period-select">
                <option>pm</option>
                <option>am</option>
            </select>
            </div>
        </div>
        
        <div className="opening-days-table">
            <div className="table-header">
            <span>Date</span>
            <span>Time</span>
            </div>
            
            {[
            { day: 'Monday', checked: true },
            { day: 'Tuesday', checked: true },
            { day: 'Wednesday', checked: true },
            { day: 'Thursday', checked: false },
            { day: 'Friday', checked: true },
            { day: 'Saturday', checked: true },
            { day: 'Sunday', checked: false }
            ].map((dayInfo, index) => (
            <div className="table-row" key={dayInfo.day}>
                <div className="day-column">
                <input 
                    type="checkbox" 
                    checked={dayInfo.checked}
                    className="day-checkbox"
                    onChange={() => {}}
                />
                <span className={`day-name ${!dayInfo.checked ? 'disabled' : ''}`}>
                    {dayInfo.day}
                </span>
                </div>
                <div className="time-column">
                <span className={`time-display ${!dayInfo.checked ? 'disabled' : ''}`}>
                    9:00 am - 5:00 pm
                </span>
                <span className="edit-icon"><FaRegEdit /></span>
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
