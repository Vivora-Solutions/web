import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Users, Store, Shield, Clock, Star, Phone, MapPin, CreditCard, Calendar, Sparkles } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const faqData = [
  {
    section: "Getting Started",
    icon: <HelpCircle className="w-5 h-5" />,
    color: "from-gray-900 to-black",
    faqs: [
      {
        q: "What is SalonDora and how does it work?",
        a: "SalonDora is Sri Lanka's premier salon booking platform that connects beauty enthusiasts with verified, high-quality salons. Simply browse salons near you, select services, choose your preferred stylist, pick a convenient time slot, and book instantly. It's like having a personal beauty concierge in your pocket!"
      },
      {
        q: "Is SalonDora completely free to use?",
        a: "Absolutely! Downloading and using SalonDora is 100% free for customers. We only charge a small 5% convenience fee when you book a service - think of it as our way of maintaining the platform and ensuring quality service for everyone."
      },
      {
        q: "Do I need to download an app or can I use the website?",
        a: "Both options are available! You can book seamlessly through our mobile app (recommended for the best experience) or directly on our website. The mobile app offers additional features like push notifications for appointment reminders and exclusive mobile-only deals."
      },
      {
        q: "How do I create my SalonDora account?",
        a: "Sign up in under 30 seconds! Just provide your phone number, verify with OTP, add your name and location preferences. You can also sign up using Google or Facebook for even faster registration. No lengthy forms or complicated procedures!"
      }
    ]
  },
  {
    section: "Booking & Appointments",
    icon: <Calendar className="w-5 h-5" />,
    color: "from-black to-gray-800",
    faqs: [
      {
        q: "How do I find the perfect salon for my needs?",
        a: "Use our smart search filters! Filter by location, services offered, price range, ratings, availability, and even specific stylists. Our 'Perfect Match' feature uses AI to recommend salons based on your previous bookings and preferences."
      },
      {
        q: "Can I book multiple services at different salons?",
        a: "Yes! Create a 'Beauty Day' by booking multiple services across different partner salons. Our smart scheduling ensures realistic timing between appointments, and you'll get a consolidated booking confirmation."
      },
      {
        q: "What if I need to cancel or reschedule my appointment?",
        a: "Life happens! Cancel or reschedule easily through the app up to 2 hours before your appointment. After 3 consecutive no-shows, we temporarily pause booking privileges to be fair to salon partners. Emergency cancellations are handled case-by-case."
      },
      {
        q: "Can I request a specific stylist when booking?",
        a: "Absolutely! View stylist profiles, their specialties, customer reviews, and availability. You can book directly with your preferred stylist or discover new talent through our 'Rising Stars' recommendations."
      },
      {
        q: "What happens if the salon cancels my appointment?",
        a: "If a salon cancels, you'll get instant notification and priority rebooking options. We also provide a small credit to your account as an apology for the inconvenience. Salons with high cancellation rates are reviewed and may be removed from our platform."
      }
    ]
  },
  {
    section: "Pricing & Payments",
    icon: <CreditCard className="w-5 h-5" />,
    color: "from-gray-800 to-gray-900",
    faqs: [
      {
        q: "Can I see prices before booking an appointment?",
        a: "Many salons display transparent pricing on their profiles. For salons that prefer consultation-based pricing, you'll see price ranges and can request quotes. Our 'Price Promise' ensures no surprise charges - what you see is what you pay!"
      },
      {
        q: "Do I need to pay in advance when booking?",
        a: "Most bookings don't require advance payment - you pay at the salon after service completion. For premium packages, group bookings, or special occasions, some salons may request advance payment to secure your slot."
      },
      {
        q: "What payment methods do you accept?",
        a: "We support all major payment methods: cash at salon, credit/debit cards, mobile wallets (Dialog eZ Cash, Mobitel mCash), bank transfers, and even cryptocurrency for tech-savvy beauty lovers!"
      },
      {
        q: "Are there any hidden fees or charges?",
        a: "Never! We believe in complete transparency. The only additional charge is our 5% service fee, clearly shown before confirmation. No hidden booking fees, cancellation charges (within policy), or surprise add-ons."
      },
      {
        q: "Do you offer discounts and promotional deals?",
        a: "Yes! Enjoy regular customer loyalty discounts, first-time booking offers, birthday month specials, group booking discounts, and seasonal promotions. Our 'Beauty Rewards' program offers points for every booking that can be redeemed for future services."
      }
    ]
  },
  {
    section: "Quality & Safety",
    icon: <Shield className="w-5 h-5" />,
    color: "from-gray-700 to-black",
    faqs: [
      {
        q: "How do you ensure salon quality and hygiene standards?",
        a: "Every partner salon undergoes rigorous verification including hygiene audits, license verification, and mystery shopper visits. We maintain strict quality standards and regularly monitor customer feedback. Salons that don't meet our standards are immediately removed."
      },
      {
        q: "Are customer reviews and ratings reliable?",
        a: "100% authentic! Only verified customers who have completed bookings can leave reviews. We use advanced algorithms to detect fake reviews and maintain the integrity of our rating system. You can trust every review you read."
      },
      {
        q: "What if I'm not satisfied with the service I received?",
        a: "Your satisfaction is our priority! Report any issues through the app within 24 hours. We investigate immediately and can offer solutions including service credits, complimentary rebookings, or refunds depending on the situation."
      },
      {
        q: "How do you handle customer data and privacy?",
        a: "We use bank-level security encryption and never share your personal data with third parties. Your information is used solely to enhance your SalonDora experience. You have full control over your data and can request deletion anytime."
      }
    ]
  },
  {
    section: "For Salon Owners",
    icon: <Store className="w-5 h-5" />,
    color: "from-black to-gray-700",
    faqs: [
      {
        q: "How can I join SalonDora as a salon partner?",
        a: "Getting started is simple! Click 'Partner With Us', provide your salon details, upload required documents (business registration, health certificates), and our team will verify and activate your profile within 48 hours. No upfront costs or lengthy paperwork!"
      },
    
      {
        q: "How does SalonDora help me grow my business?",
        a: "We're your digital growth partner! Get your personalized salon webpage, social media integration, customer analytics, automated appointment management, review management, promotional tools, and access to thousands of potential customers actively looking for your services."
      },
      {
        q: "Can I manage my staff and services through the platform?",
        a: "Absolutely! Our comprehensive salon dashboard lets you manage staff schedules, assign services to specific stylists, track performance metrics, update pricing, create promotional offers, and communicate directly with customers."
      },
      {
        q: "What support do you provide to salon partners?",
        a: "Dedicated account managers, 24/7 technical support, business growth consultations, marketing assistance, staff training on platform usage, and regular performance reviews. We're invested in your success!"
      },
      {
        q: "How quickly will I start receiving bookings?",
        a: "Most new salons receive their first booking within 72 hours of going live! Our algorithm promotes new partners, and our marketing team helps with initial visibility. Quality salons with good photos and complete profiles get bookings faster."
      }
    ]
  },
  {
    section: "Technical Support",
    icon: <Phone className="w-5 h-5" />,
    color: "from-gray-600 to-gray-900",
    faqs: [
      {
        q: "What if the app crashes or I face technical issues?",
        a: "Our 24/7 technical support team is here to help! Contact us through in-app chat, WhatsApp, email, or phone. Most issues are resolved within minutes, and we'll keep you updated throughout the process."
      },
      {
        q: "Is SalonDora available in all areas of Sri Lanka?",
        a: "We're rapidly expanding across Sri Lanka! Currently active in Colombo, Gampaha, Kalutara, Kandy, Galle, and Negombo with more cities added monthly. Can't find salons in your area? Let us know and we'll prioritize expansion there!"
      },
      {
        q: "Can I use SalonDora offline or with poor internet?",
        a: "The app works optimally with internet connection, but you can view your booking history and salon details offline. For booking or real-time updates, you'll need internet connectivity."
      },
      {
        q: "How do I contact SalonDora customer service?",
        a: "Multiple ways to reach us: In-app live chat (fastest), WhatsApp at +9471 572 9105 email contact@salondora.lk, or call our hotline 070 244 3978. Average response time is under 5 minutes during business hours!"
      }
    ]
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQData = faqData.map(section => ({
    ...section,
    faqs: section.faqs.filter(faq => 
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.faqs.length > 0);

  const floatingElements = Array.from({ length: 4 }, (_, i) => (
    <div
      key={i}
      className="absolute opacity-5"
      style={{
        left: `${15 + (i * 20)}%`,
        top: `${10 + (i * 25)}%`,
        transform: `translateY(${Math.sin(scrollY * 0.01 + i) * 15}px)`,
        animation: `float-${i} ${4 + i * 0.3}s ease-in-out infinite`
      }}
    >
      <HelpCircle className="w-8 h-8 text-gray-300" />
    </div>
  ));

  return (
    <div>
        <Header />
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements}
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-black text-white px-8 py-3 rounded-full mb-8 shadow-2xl">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="font-semibold tracking-wide">FAQ</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-black to-gray-700 bg-clip-text text-transparent">
              Got Questions?
            </span>
            <br />
            <span className="text-gray-600">We've Got Answers</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Everything you need to know about SalonDora. Can't find what you're looking for? 
            Our support team is always ready to help!
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <HelpCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {filteredFAQData.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
              onMouseEnter={() => setActiveSection(sectionIndex)}
              onMouseLeave={() => setActiveSection(null)}
            >
              {/* Section Header */}
              <div className={`bg-gradient-to-r ${section.color} p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                <div className="relative flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {section.section}
                  </h3>
                  <div className="ml-auto text-white/70 text-sm font-medium">
                    {section.faqs.length} questions
                  </div>
                </div>
              </div>

              {/* FAQ Items */}
              <div className="divide-y divide-gray-100">
                {section.faqs.map((faq, index) => {
                  const globalIndex = `${sectionIndex}-${index}`;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div key={index} className="group">
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full flex justify-between items-start px-8 py-6 text-left hover:bg-gray-50 transition-all duration-300"
                      >
                        <div className="flex-1 mr-4">
                          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors leading-relaxed">
                            {faq.q}
                          </h4>
                        </div>
                        <div className={`transform transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          {isOpen ? (
                            <ChevronUp className="w-6 h-6 text-gray-900" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-gray-500 group-hover:text-gray-900" />
                          )}
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-8 pb-8">
                          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border-l-4 border-gray-900">
                            <p className="text-gray-700 leading-relaxed text-lg">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results State */}
        {filteredFAQData.length === 0 && searchTerm && (
          <div className="text-center py-16">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No matching questions found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or browse all categories</p>
            <button
              onClick={() => setSearchTerm("")}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-black transition-colors"
            >
              Show All Questions
            </button>
          </div>
        )}

        {/* Contact Support Section */}
        <div className="text-center bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white rounded-3xl p-12 shadow-2xl relative overflow-hidden mt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          <div className="relative">
            <Phone className="w-12 h-12 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">
              Still Have Questions?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our friendly support team is here to help you 24/7. Get instant answers to your questions!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="tel:+94715729105" target="_blank" rel="noopener noreferrer" >
              <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call Support
              </button>
</a>
<a href="https://wa.me/+94715729105" target="_blank" rel="noopener noreferrer">
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Live Chat
              </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float-0 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes float-1 { 0%, 100% { transform: translateY(-8px); } 50% { transform: translateY(-25px); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(-12px); } 50% { transform: translateY(-20px); } }
        @keyframes float-3 { 0%, 100% { transform: translateY(-5px); } 50% { transform: translateY(-18px); } }
      `}</style>
    </section>
    <Footer />
    </div>
  );
}