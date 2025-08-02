"use client"

import { useState } from "react"

const ReviewSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Amazing experience! The salon was clean, professional, and the staff was incredibly friendly. My hair looks fantastic!",
      service: "Hair Styling",
      image: "/placeholder.svg?height=60&width=60",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      comment: "Best haircut I've had in years! The barber really understood what I wanted and delivered perfectly.",
      service: "Men's Haircut",
      image: "/placeholder.svg?height=60&width=60",
      date: "1 week ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 4,
      comment:
        "Great service and atmosphere. The manicure was perfect and lasted for weeks. Will definitely come back!",
      service: "Manicure",
      image: "/placeholder.svg?height=60&width=60",
      date: "3 days ago",
    },
    {
      id: 4,
      name: "David Thompson",
      rating: 5,
      comment: "Exceptional service from start to finish. The massage was incredibly relaxing and therapeutic.",
      service: "Spa Treatment",
      image: "/placeholder.svg?height=60&width=60",
      date: "5 days ago",
    },
    {
      id: 5,
      name: "Jessica Lee",
      rating: 4,
      comment: "The facial was rejuvenating, and my skin feels amazing. Highly recommend this salon!",
      service: "Facial Treatment",
      image: "/placeholder.svg?height=60&width=60",
      date: "1 day ago",
    },
    {
      id: 6,
      name: "Chris Wilson",
      rating: 5,
      comment: "Always a pleasure visiting this salon. The staff is attentive, and the results are consistently great.",
      service: "Beard Trim",
      image: "/placeholder.svg?height=60&width=60",
      date: "4 days ago",
    },
  ]

  const reviewsPerPage = 3 // Number of reviews to show per "page"
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(reviewsPerPage)

  const showMoreReviews = () => {
    setVisibleReviewsCount((prevCount) => prevCount + reviewsPerPage)
  }

  const hasMoreReviews = visibleReviewsCount < reviews.length

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real customers have to say about their experiences.
          </p>
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.slice(0, visibleReviewsCount).map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={review.image || "/placeholder.svg"}
                alt={review.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-purple-100 shadow-lg mb-6"
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
                {" "}
                {/* Push content to top, keep name/date at bottom */}
                <h4 className="font-bold text-gray-800 text-lg">{review.name}</h4>
                <p className="text-purple-600 font-medium text-sm">{review.service}</p>
                <p className="text-gray-500 text-xs mt-1">{review.date}</p>
              </div>
            </div>
          ))}
        </div>

        {hasMoreReviews && (
          <div className="text-center mt-12">
            <button
              onClick={showMoreReviews}
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:-translate-y-1"
            >
              Show More Reviews
              <svg className="ml-3 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.9</div>
            <div className="text-gray-600">Average Rating</div>
            <div className="flex justify-center mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-purple-600 mb-2">2,500+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReviewSection
