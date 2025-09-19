import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ProtectedAPI } from "../../utils/api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CheckCircle, Clock, CalendarCheck2, Star } from "lucide-react";

const MyBookingsPage = () => {
  const navigate = useNavigate();

  const [ongoingBookings, setOngoingBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Format date/time
  const formatDateTime = (datetime) => {
    // Create date object and subtract the timezone offset to get correct time
    const date = new Date(datetime);

    // Get the timezone offset in minutes and convert to milliseconds
    const timezoneOffset = date.getTimezoneOffset() * 60000;

    // Create a new date with the offset applied
    const adjustedDate = new Date(date.getTime() + timezoneOffset);

    return `${adjustedDate.toLocaleDateString()} - ${adjustedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Sort bookings by date (most recent first)
  const sortBookingsByDate = (bookings) => {
    return [...bookings].sort((a, b) => {
      const dateA = new Date(a.booking_start_datetime);
      const dateB = new Date(b.booking_start_datetime);
      return dateB - dateA; // Sort in descending order (most recent first)
    });
  };

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const [ongoingRes, historyRes] = await Promise.all([
        ProtectedAPI.get("/bookings"),
        ProtectedAPI.get("/bookings/history"),
      ]);
      
      // Sort bookings by date (most recent first)
      const sortedOngoingBookings = sortBookingsByDate(ongoingRes.data || []);
      const sortedHistoryBookings = sortBookingsByDate(historyRes.data?.data || []);
      
      setOngoingBookings(sortedOngoingBookings);
      setBookingHistory(sortedHistoryBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [navigate, fetchBookings]);

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await ProtectedAPI.put(`/bookings/${bookingId}`);
      setOngoingBookings((prev) =>
        prev.filter((b) => b.booking_id !== bookingId)
      );
      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(
        error.response?.data?.error || "Failed to cancel booking. Try again."
      );
    }
  };

  // Open review modal
  const openReviewModal = (booking) => {
    setCurrentBooking(booking);
    if (booking.customer_reviews?.length) {
      const { review_text, star_rating, review_id } =
        booking.customer_reviews[0];
      setReviewText(review_text);
      setStarRating(star_rating);
      setEditingReviewId(review_id);
    } else {
      setReviewText("");
      setStarRating(0);
      setEditingReviewId(null);
    }
    setIsReviewModalOpen(true);
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!currentBooking) {
      alert("No booking selected.");
      return;
    }

    const payload = {
      booking_id: currentBooking.booking_id,
      salon_id: currentBooking.salon?.salon_id || currentBooking.salon_id,
      review_text: reviewText,
      star_rating: starRating,
    };

    try {
      if (editingReviewId) {
        await ProtectedAPI.put(`/review/${editingReviewId}`, payload);
        alert("Review updated successfully!");
      } else {
        await ProtectedAPI.post("/review", payload);
        alert("Review added successfully!");
      }
      setIsReviewModalOpen(false);
      fetchBookings();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.error || "Failed to submit review");
    }
  };

  // Booking card component
  const BookingCard = ({ booking, showCancelButton }) => {
    const hasReview = booking.customer_reviews?.length > 0;
    const review = hasReview ? booking.customer_reviews[0] : null;

    return (
      <div className="bg-white hover:shadow-lg transition-shadow duration-300 rounded-2xl p-5 mb-6 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {booking.salon.salon_name}
            </h2>
            <p className="text-sm text-gray-500">
              {booking.salon.salon_address}
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              booking.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {booking.status.toUpperCase()}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
          <p>
            <strong>👤 Stylist:</strong> {booking.stylist.stylist_name}
          </p>
          <p>
            <strong>🕒 Start:</strong>{" "}
            {formatDateTime(booking.booking_start_datetime)}
          </p>
     
          <p>
            <strong>⏳ Duration:</strong> {booking.total_duration_minutes} mins
          </p>
               <p>
            <strong>✅ End:</strong>{" "}
            {formatDateTime(booking.booking_end_datetime)}
          </p>
          <p>
            <strong>💰 Total Price:</strong> Rs. {booking.total_price}
          </p>
          {booking.notes && (
            <p>
              <strong>📝 Notes:</strong> {booking.notes}
            </p>
          )}

          {hasReview ? (
            <>
              <p>
                <strong>📝 Your Review: </strong>
                {review.review_text}
              </p>
              <p>
                <strong>⭐ Your Rating: </strong>⭐ {review.star_rating}
              </p>
            </>
          ) : (
            <p>No reviews yet</p>
          )}
        </div>

        {/* Actions */}
        {booking.status === "completed" && (
          <div className="text-right">
            <button
              onClick={() => openReviewModal(booking)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-xl"
            >
              {hasReview ? "Edit Your Review" : "Add Your Review"}
            </button>
          </div>
        )}

        {showCancelButton && booking.status !== "completed" && (
          <div className="text-right">
            <button
              onClick={() => handleCancelBooking(booking.booking_id)}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-xl"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-8">
          <CalendarCheck2 className="inline-block w-6 h-6 mr-2" />
          My Bookings
        </h1>

        {loading ? (
          <>
            {/* Modern Skeleton Loading UI */}
            <div className="space-y-10">
              {/* Skeleton for Ongoing Bookings */}
              <section className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                  <div className="h-7 w-48 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="ml-4 space-y-2 flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="h-8 bg-gray-200 rounded-md w-24"></div>
                        <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Skeleton for Booking History */}
              <section>
                <div className="flex items-center mb-3">
                  <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                  <div className="h-7 w-48 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-5 bg-gray-200 rounded w-32"></div>
                          <div className="flex justify-end">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="animate-fadeIn">
            <section className="mb-10">
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Ongoing Bookings
                </h2>
              </div>
              {ongoingBookings.length ? (
                ongoingBookings.map((b) => (
                  <BookingCard
                    key={b.booking_id}
                    booking={b}
                    showCancelButton
                  />
                ))
              ) : (
                <p className="text-gray-500">No ongoing bookings found.</p>
              )}
            </section>

            <section>
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Booking History
                </h2>
              </div>
              {bookingHistory.length ? (
                bookingHistory.map((b) => (
                  <BookingCard
                    key={b.booking_id}
                    booking={b}
                    showCancelButton={false}
                  />
                ))
              ) : (
                <p className="text-gray-500">No booking history available.</p>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {editingReviewId ? "Edit Your Review" : "Add Your Review"}
            </h2>

            {/* Star Rating */}
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    star <= starRating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setStarRating(star)}
                  fill={star <= starRating ? "currentColor" : "none"}
                />
              ))}
            </div>

            <textarea
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                {editingReviewId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MyBookingsPage;
