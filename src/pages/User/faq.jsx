import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
const faqData = [
  {
    section: "General Questions",
    faqs: [
      {
        q: "What is SalonDora?",
        a: "SalonDora is a Salon Management and Appointment Booking Platform. Customers can easily book salon slots using our client app, while salon owners can manage their services, staff, and schedules using the salon app."
      },
      {
        q: "Is SalonDora free for customers?",
        a: "Yes! Using the SalonDora website and downloading SalonDora is always free. However, when booking a service, a 5% service charge will be added to the total amount."
      },
      {
        q: "How does SalonDora work for booking salon appointments?",
        a: "It’s simple! Select the services you want, pick the date, choose your preferred stylist, and book an available time slot directly through SalonDora."
      },
      {
        q: "Do I need to download the app to book a salon appointment?",
        a: "Not necessarily. You can book directly on the SalonDora website. The mobile app makes it even easier to manage your bookings."
      },
      {
        q: "Can I cancel or reschedule my appointment?",
        a: "Yes, you can cancel or reschedule anytime through SalonDora. To keep things fair, if you cancel three services in a row, your account may be temporarily suspended."
      }
    ]
  },
  {
    section: "For Customers",
    faqs: [
      {
        q: "How do I find salons near me?",
        a: "Allow location access on the app or website, and SalonDora will show you salons closest to your area."
      },
      {
        q: "Can I see prices before booking an appointment?",
        a: "Some salons choose to display their prices publicly, while others may not. If prices are available, you can see them before booking."
      },
      {
        q: "Are reviews and ratings available?",
        a: "Yes! SalonDora features real customer reviews and ratings to help you choose the right salon."
      },
      {
        q: "Do I need to pay in advance when I book?",
        a: "Most salons don’t require an advance payment. For larger services or special add-ons, advance payment may be requested by the salon."
      },
      {
        q: "Does SalonDora offer discounts or promotions?",
        a: "Yes! Regular customers often get discounts directly from their favorite salons. SalonDora also runs platform-wide promotions from time to time."
      }
    ]
  },
  {
    section: "For Salon Owners",
    faqs: [
      {
        q: "How can I list my salon on SalonDora?",
        a: "Listing your salon is quick and free! Just click “Register as a Salon”, enter your location and salon name, and we will call you for confirmation. Once verified, your salon will be listed on SalonDora."
      },
      {
        q: "Is there a registration fee for salons?",
        a: "No, joining SalonDora is completely free. The only cost is a booking commission, which applies when customers book through the platform."
      },
      {
        q: "Does the booking commission increase with higher service prices?",
        a: "No. While commission is percentage-based, it is capped at Rs. 250 per booking. Even if you offer premium services, the maximum commission is Rs. 250."
      },
      {
        q: "Can I manage my staff’s schedules with SalonDora?",
        a: "Yes. Salon owners can easily manage staff schedules, assign services, and track availability through the Salon App."
      },
      {
        q: "Does SalonDora provide customer support for salon partners?",
        a: "Absolutely. SalonDora offers dedicated customer support to help salon partners manage their accounts, services, and bookings."
      },
      {
        q: "How does SalonDora help salons get more customers?",
        a: "Unlike other platforms that only act as publicity channels, SalonDora works as your primary sales website. Each salon gets its own customizable page, which can be linked with social media. Customers can directly book services online, reducing friction compared to phone calls or walk-ins."
      },
      {
        q: "Can I update my services, prices, and offers?",
        a: "Yes. You have full control to update your services, prices, discounts, and whether or not to show prices publicly."
      }
    ]
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
        <Header />
    <section className="max-w-4xl mx-auto px-6 py-12">

      <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
        Frequently Asked Questions <span className="text-orange-500">(FAQ)</span>
      </h2>

      {faqData.map((block, blockIndex) => (
        <div key={blockIndex} className="mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-l-4 border-orange-500 pl-3">
            {block.section}
          </h3>
          <div className="space-y-3">
            {block.faqs.map((faq, index) => {
              const globalIndex = `${blockIndex}-${index}`;
              const isOpen = openIndex === globalIndex;

              return (
                <div
                  key={index}
                  className="border rounded-xl bg-white shadow-sm"
                >
                  <button
                    onClick={() => toggleFAQ(globalIndex)}
                    className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-medium"
                  >
                    {faq.q}
                    {isOpen ? (
                      <ChevronUp className="text-orange-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
    <Footer />
    </div>
  );
}
