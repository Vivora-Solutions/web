import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, ReceiptText } from "lucide-react";

import Header from "./components/Header";
import SalonImageGallery from "./components/SalonImageGallery";
import { PublicAPI } from "../../utils/api";

const AppointmentPage = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        const res = await PublicAPI.get(`/salons/by-id/${salonId}`);
        setSalon(res.data);
      } catch (error) {
        console.error("Error fetching salon details:", error);
        // Handle error, e.g., navigate to an error page or show a message
      }
    };

    const fetchSalonServices = async () => {
      try {
        const res = await PublicAPI.get(`/salons/${salonId}/services`);
        //console.log("Services:", res.data.data)
        if (res.data.success) {
          setServices(res.data.data);
          setFilteredServices(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching salon services:", error);
        // Handle error
      }
    };

    const fetchSalonReviews = async () => {
      try {
        const res = await PublicAPI.get(`/review/${salonId}`);
        //console.log("Reviews:", res.data.data)
        //console.log("Reviews length:", res.data.data.length)
        if (Array.isArray(res.data.data)) {
          setReviews(res.data.data); // ✅ only the array
        }
      } catch (error) {
        console.error("Error fetching salon reviews:", error);
        // Handle error
      }
    };

    fetchSalonDetails();
    fetchSalonServices();
    fetchSalonReviews();
  }, [salonId]);

  useEffect(() => {
    let filtered = [...services];
    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (service) =>
          service.service_category.toLowerCase() ===
          activeCategory.toLowerCase()
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((service) =>
        service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredServices(filtered);
  }, [searchTerm, activeCategory, services]);

  const handleSelectService = (service) => {
    const already = selectedServices.find(
      (s) => s.service_id === service.service_id
    );
    if (already) {
      setSelectedServices((prev) =>
        prev.filter((s) => s.service_id !== service.service_id)
      );
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  const handleProceed = () => {
    if (selectedServices.length === 0) return;
    navigate("/schedule", {
      state: {
        salonId,
        salon_logo_link: salon?.salon_logo_link,
        salon_name: salon?.salon_name,
        salon_average_rating: salon?.average_rating,
        salon_address: salon?.salon_address,
        serviceIds: selectedServices.map((s) => s.service_id),
        serviceNames: selectedServices.map((s) => s.service_name),
        serviceDurations: selectedServices.map((s) => s.duration_minutes),
        servicePrices: selectedServices.map((s) => s.price),
      },
    });
  };

  const totalPrice = selectedServices.reduce(
    (sum, s) => sum + (s.price || 0),
    0
  );
  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + (s.duration_minutes || 0),
    0
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black-50 to-white flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
        {salon && (
          <div className="w-full max-w-7xl space-y-10">
            {/* Salon Header Card */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-black-100 transform transition-all duration-300 hover:scale-[1.01]">
              <div className="relative">
                <img
                  src={
                    salon.salon_logo_link ||
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ4AAACUCAMAAABV5TcGAAAAY1BMVEXm5eUAAADp6Ojs6+vw7+/j4uLz8vLe3d3X1tba2dnHxsbU09PEw8PAv7+4t7fKycmsq6tSUlKQj48pKSmjoqJubW2cm5tiYmJGRkY/Pz8RERFaWlocHBwwMDB3dnaEhIQ4NzcOspkzAAAKd0lEQVR4nO1d2ZKjOBBEJXEZEPeNgf//ytUFBgE987Lbi0xGzHSPcXeYpI6sUkljWQ8ePHjw4MGDBw8ePHjw4MGPgN/+AP8r2PbDxwqwpwT/9of4/wAiND7msQIaNEfktz/F/wU4QgiN7uMuEk6DBB+Pu3CAiwSmJ3xwkETSgYrHXRicUtGBXg8fzDreCx3NQwejQ1DR5R1C9Nv4IMdwKelA9YxQ72wvAJgeW3HhOgRjTBwGRY2iY+zZX2tyYe8AP4jt3/uo/wWcGdU0ftFkKtOy8B1+9yQXdKQZiyGepAM7QZWyl0vDtQip0BZCejmjDB40VXSAlQwytAaGx5JFci2ofbAwld9HNUKcHoh7dbUy2zYYyKhutWs7/iXj0ULaQlyilNVxEDbqLYP5iQa8QdFRlyXLJXkCFsnEC0GJCmLBK11lyBfIMlKsjjJV48DiA4DXiUDRDyy3+kqjspfqwHhnYZg+kaMqWjQxk+EelHlzxXwl6aSjMI/5ipbQ+vwZ8ok2yGMOwr6NotpmhjKrcm74hkjKAd6Hj256zRkGN0UjFC+QdsJAWZaZzY+kAuCOKx8oi3MC9jSHmClQR9X6MQ+u9Tf4CgeQZF75CKkH7sTDhhJpXW3zr3nyPd1TAkUjtTmauRH43BDwlM9zU0a2CLbj97DBDQTolM48jfAQId0iYPD9pOWZ5SvSCgdgCUJcmo0N6lczAMB20XDFWhbGF/cKOEiqqkoiF1ilT+BVNdsbd2lSFMkLO5wuQrDprOCq50Ejb8uJWswuMH59LgJxHNsLGSNZllWMlzCwHWJwvnWy7iPC6oIHiOX5My6Y95R9OucDL2y6YXg3aT1WAbOVX/3Q/xoWYcH0eUKZ00RruwsTN+mb94esFUObTjE2Mc9gT3TN34X3Yu5QUXdpEGISj2dUrJQ0heX84ZffDgCpyKFJudx5m3BfAfzqr6lYMFlmWQjIYrbbWcE7wvA3ZHBkrjmJBrCb6e4wpFmMg0x7cW7TNO3Zn7SZ892PzIkxvWSfjjobfeU7QNvNK3laThV9ea5r267rxjTJxnr7hvFliIHEqUbGnAWEBNnwMYs6S2LAQnxJMC2GsU+r8cNIk5ih3u0w2xIyjCET6nG9vvCeEkbPicBgBLlhtb5xmGwjVAjYAc1q6TBNFrmYJZT0c5Ohja8fOwafroT0ZvDBEq3tB3FMo8CzWQiAaF27r1/2H2ICgLtGmdQzJeUuUcHitdwaWovr1Wln86PukoOawBQ+VuB1Qe59/bCdeoSPZwCO1JJUatpgHViLbfT4+tZIgobtQi1xVdu5943ILwsAq8jYjT9EUEYa0yLbxThsTTIzmzVoiNVSfveHeUEn1SwBcCXMqqv+7Y/4HwJTpb4OD1n7Jx8r7LLti6CGIubIGPMATxVttbePG7Y+7yMmIJpw+y4gclmz90zhA1Qxd1yjDwstyxC+IrNfngRbLltlhtCBIymo8sO2DQgmzXvEQIi2lg+eULNdbAgfahF/PGZYu9AW3+RskLZcC5F0NSMaZDiSC3DzSa6EZNLeHPK36mkEZDg1YR4GXGUc1cnDxa9RG3IJhB1oqgsCIVsaA8wDXrJya8+kOQSl5hieMCQ9TGA5XBgbYB5KgZ2u0LPHXpzQgUJdnki1Xt6+lFNpAb1PxTn4ZXVGR6K/mRQ8AL1vL9VVVkDV6YM90AEBOoulzDy4khvuPwSiAun5cwWv3tMhM8uRDosIKXd7b7FltVKeB0EIUo0OOZOcHYb1ccy1XHPzQh9iaRwXc3AQz3s65AzuCR0WcG9533yeTlX2w0X9BVG3p8ORxV51pEMMA3TTvb2FyPZeedHmgKTbP2+QxsS7qZo+g5jnlvLeSkzd3mXzpmp31TyWiQVNAe0jrXBxebHb3zrVLrdHL4zD7+udGzkqDzX15OtuIfwovXVZS2SiyF8XdARoX8KprVDo5Rx30Qmq2ujOsdSRiaK52IwAdL+5mCjNdhDp4iIfJbr3NK7aQ1xeyYW63RXtzrISGZ7YgFBo3bm6vQnU/V31z31UbzMqDpSvnMYaLCRMdmc6VJ49UVUcuNiXMmRa1qbONnOAd3s6YPiRjne77WDgYNkWh4aTVVmw709H94PsYMFg1/4kn41RqIsOqcV0Opx+J0nxumdS4LhCZTYdTKJt59PBGtEOeajLUvGr7kwHHq7pcEa0XXTC9L2nQ2yz3f4unlmGW9NB5stQCu6Qb/Lvdgvh4i4aHeHtZZhKtJN7cinbx4Fk0NiYNCkrVOnNRbpsX5yoUvCabcMQgmZPxkD1iR9Rs9y7hFMi/aRmIdXHGfhFbRYZjY7+I4Laexf4jmyGvQ/PFNwaLSZDPHtpBGysQ+/zgM3j0L17x1iVqFS/QIquXNig6TortYFexWHRDbt3c3B56oc1aLtEqgeCkyF06IGNw4Is4VNR904sq/DQXR7TXO2qxq923ByetaJr9WVaHobam5/iQKQXdNpt2JOq4bncCJ3iwMbh+AoI+DpLfec0a3FXkHe3H/yBuEnV7RZotK38SEeqTdERfojDvZs/Fn/66u72dBQqmkCQdtSpjmzM+ilRwH1luP9Eg9Le21TLPOSt1GWBas9uDmyMoSbccMh9Jb25cYjusLzBTaKAUJXv4KcocwpdnvPTKvVAKmSaPmd4P4CvZkq36ymVaqBDxI/5PWqOQ82H5eap27sKX3dUqWI1D6ZIlwnTEZVu2B7pSPXIIYxjuveKpAB46unTtUQJ0CjyBm/oTOSwoZJjv07FMhF/8d6aQ2Exj3WSibmIXLZnWThP8KHPIbjbzaXLAu/eAn3BevbPqKQEZLnskZIRtVF4zCsMu4F8iHiwzQ0ZSl+GsIdK8gGlKvjhjVI/OfOVctcvsoW7GXOQFlQylb4TuQfu3as0y8+DUo2OtJymqaxTMSC4n72VIzPmbHha3UXx0clJMd78LH1xqaSx79q2F8QRpTTc5RUScjKHi5mIOwL7KpnmFedDaTK+cWcUHePMxXjdac2wCxxYlLuZGbutJbCamENDaZOFDn6Q68inzcufNtXKVe/akDiqsE5usBzq5IoOZhhlmO7rGR1yQqQ9m3C4MzYNrzbvheULOl41Sn/wA9EDQzM1QnJsQTYLKbLZwemoXyVveFwBi/Iuv3/pdgSh68mD8vRJTkeTjGi6ogNA/IiRbHA5tp7QMAnrGPmtZpfWAZY4uvF983bxJSBeTnxJeVtLDFxnGerPYwdYBWcjNS9uLMB+oXrmGbtbsQhTZ+/zCW1gpQ0vdO7fD7wGWLEsYHkRJwY2hjE9HYwDiw+K5ZVpZzNoAFseU9IG2CK8UdbMZ8sFRDRQy9j4/1APwC54BGmZMOdahH+v7UW3wOEnwTShIcdC/QEEizNbmX2oVNPuu36i5Cvjwxq+sSA4nFoWM0KVeHfKAsK+p7apx1KeAxOIJgrLokK0rWJ9m/x06ImZAMyPDatk5s2jTZz4jpBxBqbD5dli78I1+RzbvwVgL5l4YO3qKjyZqPs6AHZjWmVTOVah4f+5098BAFv8REr3YeOD7w2gDx48ePDgwYMHDx48ePDgwYMHDx48+G38A9gZecJ1i/KyAAAAAElFTkSuQmCC"
                  }
                  alt="Salon Logo"
                  className="w-24 h-24 rounded-full object-cover border-4 border-black-200 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  {salon.salon_name}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                  <div className="flex text-yellow-500 text-xl">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < (salon.average_rating || 0)
                            ? "fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-base text-gray-600">
                    ({salon.average_rating || 0}/5)
                  </span>
                </div>
                <p className="text-base text-gray-600 mt-2">
                  {salon.salon_description || "Hair and Beauty Salon"}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-black-400" />
                  <span className="text-base">
                    {salon.salon_address || "Colombo"}
                  </span>
                </div>
              </div>
            </div>

            {/* Salon Image Gallery */}
            <div className="w-full h-auto md:h-[36rem] rounded-3xl overflow-hidden shadow-xl">
              <SalonImageGallery banner_images={salon?.banner_images || []} />
            </div>

            {/* Filters */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {["All", "Men", "Women", "Children", "Men & Women"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveCategory(tag)}
                    className={`px-6 py-2 text-base rounded-full border-2 shadow-md transition-all duration-300
                      ${
                        activeCategory === tag
                          ? "bg-red-600 text-white border-red-600 scale-105 font-semibold"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:gray-800-100 hover:text-black-800"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Services..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg shadow-inner focus:ring-4 focus:ring-black-200 focus:border-black-400 transition-all duration-200"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            {/* Services and Summary Side by Side */}
            <div className="flex flex-col md:flex-row gap-10 w-full">
              <div className="flex-1 grid grid-cols-1 gap-8">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <label
                      key={service.service_id}
                      className="flex flex-col p-6 border border-gray-200 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative group"
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedServices.some(
                            (s) => s.service_id === service.service_id
                          )}
                          onChange={() => handleSelectService(service)}
                          className="mt-1 accent-red-600 scale-125 transform transition-transform duration-200"
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-xl text-gray-900">
                            {service.service_name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {service.service_description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center text-base text-gray-700">
                        <span className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-black-400" />
                          {service.duration_minutes || 0} min
                        </span>
                        <span className="font-extrabold text-xl text-black-700">
                          Rs {service.price}
                        </span>
                      </div>
                      <span className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Select
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-lg py-10">
                    No services found matching your criteria.
                  </p>
                )}
              </div>

              {/* Summary Panel */}
              <div className="w-full md:w-96 flex-shrink-0">
                <div className="sticky top-28 bg-white rounded-3xl shadow-2xl border border-black-100 p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
                    Summary
                  </h3>
                  {/* Selected services list */}
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                    {selectedServices.map((service) => (
                      <div
                        key={service.service_id}
                        className="flex justify-between text-base text-gray-700 border-b border-gray-100 pb-2"
                      >
                        <div>
                          <p className="font-medium">{service.service_name}</p>
                          <p className="text-sm text-gray-500">
                            {service.duration_minutes} min
                          </p>
                        </div>
                        <span className="font-semibold">
                          Rs {service.price}
                        </span>
                      </div>
                    ))}
                    {selectedServices.length === 0 && (
                      <p className="text-base text-gray-500 text-center py-4">
                        No services selected yet.
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between text-lg text-gray-800 pt-4 border-t border-gray-200">
                    <span>Duration</span>
                    <span className="font-medium">{totalDuration} minutes</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-2xl">
                    <span>Total</span>
                    <span className="text-black-800">
                      Rs {totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 pt-2">
                    <button
                      className="w-full py-4 text-lg bg-gray-100 text-gray-600 border border-gray-200 rounded-xl cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                      disabled
                    >
                      <ReceiptText className="w-6 h-6" />
                      <span>Pay at Venue</span>
                    </button>
                    <button
                      onClick={handleProceed}
                      disabled={selectedServices.length === 0}
                      className="w-full py-4 text-lg bg-black text-white rounded-xl shadow-lg hover:gray-800-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Salon Reviews Horizontal Cards */}
            <div className="w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Customer Reviews
              </h3>

              {reviews.length > 0 ? (
                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200">
                  {reviews.map((review, index) => (
                    <div
                      key={review.review_id || index}
                      className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-md p-6 border border-gray-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={
                            review.user_avatar ||
                            "https://freesvg.org/img/abstract-user-flat-4.png"
                          }
                          alt={review.user.customer.first_name || "User"}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.user.customer.first_name || "Anonymous"}
                          </p>
                          <div className="flex text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (review.star_rating || 0)
                                    ? "fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {review.review_text || "No comment provided."}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-lg py-6">No reviews yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;
