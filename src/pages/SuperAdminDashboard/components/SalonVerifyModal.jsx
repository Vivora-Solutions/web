const SalonVerifyModal = ({ salon, onClose, onAction }) => {
  if (!salon) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Verify Salon</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-lg">&times;</button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Salon Info */}
          <div>
            <img
              src={salon.salon_logo_link}
              alt={salon.salon_name}
              className="w-32 h-32 object-cover rounded-lg border mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{salon.salon_name}</h3>
            <p className="text-sm text-gray-500">{salon.salon_type}</p>
            <p className="text-sm text-gray-600 mt-2">📍 {salon.salon_address}</p>
            <p className="text-sm text-gray-600 mt-1">
              {salon.salon_description || 'No description available.'}
            </p>
            <p className="text-sm text-gray-600 mt-2">📞 {salon.salon_contact_number}</p>
            <p className="text-sm text-gray-600">✉️ {salon.salon_email}</p>
          </div>

          {/* Map or Placeholder */}
          <div>
            <img
              src="https://via.placeholder.com/400x300?text=Map"
              alt="Map placeholder"
              className="w-full h-64 object-cover rounded-lg border"
            />
          </div>
        </div>

        {/* Owner Info */}
        <div className="px-6 text-sm text-gray-700">
          <p><strong>Owner:</strong> {salon.owner_name}</p>
          <p className="text-gray-600">📞 {salon.owner_phone}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => onAction('accept', salon.salon_id)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Accept
          </button>
          <button
            onClick={() => onAction('decline', salon.salon_id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Decline
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonVerifyModal;
