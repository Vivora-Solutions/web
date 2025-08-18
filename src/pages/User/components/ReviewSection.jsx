import { useEffect, useState } from "react"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { PublicAPI } from "../../../utils/api"

dayjs.extend(relativeTime)

const DEFAULT_PROFILE_PIC = "https://freesvg.org/img/abstract-user-flat-4.png"

const ReviewSection = () => {
  const [reviews, setReviews] = useState([])
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3)

  const showMoreReviews = () => {
    setVisibleReviewsCount((prev) => prev + 3)
  }

  const hasMoreReviews = visibleReviewsCount < reviews.length

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await PublicAPI.get("/review/review-for-home-page")
        const fetched = res.data.data.map((item, index) => ({
          id: index,
          name: item.user?.customer?.first_name || "Anonymous",
          rating: item.star_rating,
          comment: item.review_text,
          service: item.salon?.salon_name || "Salon",
          image: DEFAULT_PROFILE_PIC,
          date: dayjs(item.created_at).fromNow(),
        }))
        setReviews(fetched)
      } catch (err) {
        console.error("Failed to fetch reviews", err)
      }
    }

    fetchReviews()
  }, [])

   return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-black via-gray-800 to-red-600 bg-clip-text text-transparent mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real customers have to say about their experiences.
          </p>
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.slice(0, visibleReviewsCount).map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={review.image}
                alt={review.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow-md mb-6"
              />
              <div className="flex items-center justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-gray-700 text-base leading-relaxed mb-6 italic">
                "{review.comment}"
              </blockquote>
              <div className="mt-auto">
                <h4 className="font-bold text-black text-lg">{review.name}</h4>
                <p className="text-orange-500 font-medium text-sm">{review.service}</p>
                <p className="text-gray-500 text-xs mt-1">{review.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {hasMoreReviews && (
          <div className="text-center mt-12">
            <button
              onClick={showMoreReviews}
              className="inline-flex items-center px-8 py-4 border border-black text-base font-medium rounded-full shadow-lg text-white bg-black hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              Show More Reviews
              <svg className="ml-3 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-black mb-2">4.9</div>
            <div className="text-gray-700">Average Rating</div>
            <div className="flex justify-center mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-black mb-2">2,500+</div>
            <div className="text-gray-700">Happy Customers</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-black mb-2">98%</div>
            <div className="text-gray-700">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;