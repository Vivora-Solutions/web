import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ChartCard = ({ title, data }) => (
  <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
    <h4 className="text-center text-base font-semibold text-gray-700 mb-3">{title}</h4>
    {data && data.length > 0 ? (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#4f46e5" // indigo-600 from Tailwind
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-center text-sm text-gray-400">Loading...</p>
    )}
  </div>
);

export default ChartCard;
