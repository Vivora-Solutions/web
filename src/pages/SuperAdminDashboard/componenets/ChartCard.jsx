// src/pages/SuperAdminDashboard/ChartCard.jsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const ChartCard = ({ title, data }) => (
  <div className="chart-box">
    <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>{title}</h4>
    {data && data.length > 0 ? (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
    )}
  </div>
);

export default ChartCard;
