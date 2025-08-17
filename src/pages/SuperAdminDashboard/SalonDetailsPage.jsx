import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProtectedAPI } from '../../utils/api';

const SalonDetailsPage = () => {
  const { salonid } = useParams();
  const [bookings, setBookings] = useState([]);
  const [salonInfo, setSalonInfo] = useState(null);
  const [filterType, setFilterType] = useState("all"); 
  const [filterValue, setFilterValue] = useState(""); 

  useEffect(() => {
    const fetchSalonInfo = async () => {
      try {
        const res = await ProtectedAPI.get(`/super-admin/salons/${salonid}`);
        setSalonInfo(res.data);
      } catch (err) {
        console.error('Error fetching salon info:', err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await ProtectedAPI.get(`/super-admin/booking/${salonid}`);
        setBookings(res.data || []);
        console.log('Bookings:', res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    fetchSalonInfo();
    fetchBookings();
  }, [salonid]);


  const filteredBookings = bookings.filter((b) => {
  const bookingDate = new Date(b.booking_start_datetime);

  if (filterType === "month" && filterValue) {
    const [year, month] = filterValue.split("-");
    return (
      bookingDate.getFullYear().toString() === year &&
      (bookingDate.getMonth() + 1).toString().padStart(2, "0") === month
    );
  }

  if (filterType === "day" && filterValue) {
    const selectedDate = new Date(filterValue);
    return (
      bookingDate.getFullYear() === selectedDate.getFullYear() &&
      bookingDate.getMonth() === selectedDate.getMonth() &&
      bookingDate.getDate() === selectedDate.getDate()
    );
  }

  return true; 
});





  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex gap-6 items-center">
          <img
            src={salonInfo?.salon_logo_link || '/default-logo.png'}
            alt="salon logo"
            className="w-24 h-24 object-cover rounded-lg border"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {salonInfo?.salon_name || 'Salon Name'}
            </h2>
            <p className="text-gray-600">{salonInfo?.salon_description || 'Description not provided'}</p>
            <p className="text-sm text-gray-500">📍 {salonInfo?.salon_address}</p>
            <p className="text-sm text-gray-500">📞 {salonInfo?.salon_contact_number}</p>
          </div>
        </div>
      </header>

      <div className="flex gap-4 items-center mb-6">
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setFilterValue(""); // reset when changing type
          }}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">All</option>
          <option value="month">By Month</option>
          <option value="day">By Day</option>
        </select>

        {filterType === "month" && (
          <input
            type="month"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        )}

        {filterType === "day" && (
          <input
            type="date"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        )}
      </div>


      

      <section className="booking-table">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Service</th>
              <th className="border px-4 py-2">Stylist</th>
              <th className="border px-4 py-2">Duration</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Mode</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              filteredBookings.map((booking) => {
                const start = new Date(booking.booking_start_datetime);
                const end = new Date(booking.booking_end_datetime);
                const formattedDate = start.toLocaleDateString();
                const formattedTime = `${start.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })} - ${end.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`;

                const services = booking.booking_services || [];

                return (
                  <React.Fragment key={booking.booking_id}>
                    {services.map((s, idx) => (
                      <tr key={s.booking_service_id}>
                        {/* Show date only for first row */}
                        {idx === 0 && (
                          <td
                            rowSpan={services.length}
                            className="border px-4 py-2 align-top"
                          >
                            {formattedDate}
                          </td>
                        )}
                        <td className="border px-4 py-2">
                          {s.service?.service_name || 'N/A'}
                        </td>
                        <td className="border px-4 py-2">
                          {booking.stylist?.stylist_name || 'N/A'}
                        </td>
                        <td className="border px-4 py-2">
                          {s.service_duration_at_booking} mins
                        </td>
                        <td className="border px-4 py-2">{formattedTime}</td>
                        <td className="border px-4 py-2">
                          Rs. {s.service_price_at_booking}
                        </td>

                        {/* Show mode only for first row */}
                        {idx === 0 && (
                          <td
                            rowSpan={services.length}
                            className="border px-4 py-2 align-top"
                          >
                            {booking.booked_mode}
                          </td>
                        )}

                        {/* Show total only for the last row */}
                        {idx === services.length - 1 ? (
                          <td className="border px-4 py-2 font-semibold text-indigo-700">
                            {booking.total_duration_minutes} mins / Rs. {booking.total_price}
                          </td>
                        ) : (
                          <td className="border px-4 py-2"></td>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>


      <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm">
        <p className="text-lg font-semibold text-green-800">
          Total Profit (10%): Rs.{" "}
          {filteredBookings
            .filter((b) => b.booked_mode?.toLowerCase() === "online")
            .reduce((acc, b) => acc + (b.total_price * 0.1), 0)
            .toFixed(2)}
        </p>
      </div>



    </div>
  );
};

export default SalonDetailsPage;
