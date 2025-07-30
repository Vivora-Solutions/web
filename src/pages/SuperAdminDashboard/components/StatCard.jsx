const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition">
    <span className="text-sm text-gray-500">{label}</span>
    <strong className="text-2xl font-semibold text-gray-800 mt-2">{value}</strong>
  </div>
);

export default StatCard;
