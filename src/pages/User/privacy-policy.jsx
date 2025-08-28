import Footer from "./components/Footer"
import Header from "./components/Header"

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          {/* <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl shadow-lg mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div> */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">SalonDora – Privacy Policy</h1>
          <p className="text-gray-500 text-sm sm:text-base">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all hover:shadow-xl">
            <p className="text-gray-700 leading-relaxed">
              At SalonDora, we respect your privacy and are committed to protecting your personal information. This
              Privacy Policy explains how we collect, use, store, and share data for both clients and salons, whether you
              use our website or mobile application. By using our services, you agree to the terms of this Privacy Policy.
            </p>
          </div>

          {[
            {
              title: "1. Information We Collect",
              subsections: [
                {
                  title: "1.1 Clients",
                  content: "We collect the following information from clients when using SalonDora:",
                  items: [
                    <><strong>Personal Information:</strong> Name, email address, phone number, and profile photo (optional).</>,
                    <><strong>Booking Data:</strong> History of appointments, no-show records, loyalty program activity, and preferences.</>,
                    <><strong>Location Data:</strong> Accessed from your mobile device only while using the app, to recommend nearby salons.</>
                  ]
                },
                {
                  title: "1.2 Salons",
                  content: "We collect the following information for salon accounts:",
                  items: [
                    "Business name, owner name, email address, phone number, services offered, and prices.",
                    "Booking history and analytics relevant to salon performance."
                  ],
                  note: "Important: This data is stored for internal use only and will not be shared with third parties."
                }
              ]
            },
            {
              title: "2. How We Use Your Information",
              items: [
                <><strong>Booking Management:</strong> To schedule and track appointments.</>,
                <><strong>No-Show Tracking:</strong> To record penalties and manage loyalty balances.</>,
                <><strong>Loyalty Programs:</strong> To provide rewards or discounts for frequent clients.</>,
                <><strong>Salon Analytics:</strong> To allow salons to view their own performance and booking trends.</>,
                <><strong>Recommendations:</strong> To suggest salons closest to you or suited to your preferences.</>,
                <><strong>Reminders & Promotions:</strong> To send notifications about upcoming bookings, promotions, or loyalty rewards. (Some features may be implemented in the future.)</>
              ]
            },
            {
              title: "3. Data Sharing",
              items: [
                <><strong>No Third-Party Sharing:</strong> Client and salon data is not shared with external third parties.</>,
                <><strong>Internal Use:</strong> Salons can access only their own analytics and booking history.</>,
                <><strong>Third-Party Services:</strong> SalonDora may use third-party services (e.g., hosting, database management).</>
              ]
            },
            {
              title: "4. Data Storage & Security",
              items: [
                <><strong>Retention:</strong> Booking history and account information is stored indefinitely for operational purposes.</>,
                <><strong>Security Measures:</strong> We aim to protect data via encryption and secure servers.</>
              ]
            },
            {
              title: "5. User Rights",
              content: "Clients and salons have the following rights regarding their personal data:",
              items: [
                <><strong>Access:</strong> Request a copy of your data.</>,
                <><strong>Correction:</strong> Update or correct inaccurate data.</>,
                <><strong>Deletion:</strong> Request deletion of your account and associated data.</>
              ],
              note: "Specify how users can exercise these rights, e.g., via app settings or contacting support"
            },
            {
              title: "6. Cookies & Tracking",
              content: <><strong>Cookies / Tracking:</strong> We will update this section once tracking practices are implemented.</>
            },
            {
              title: "7. Children's Privacy",
              items: [
                "SalonDora is intended for users 12 years and older.",
                "Some services (e.g., tattoos, piercings) may require parental consent.",
                "Parents or guardians are responsible for ensuring underage users comply with any applicable legal requirements.",
                "SalonDora does not assume responsibility for underage users accessing restricted services without parental consent."
              ]
            },
            {
              title: "8. Updates to This Privacy Policy",
              items: [
                "We may update this Privacy Policy periodically.",
                "Users will be notified via app notifications, emails, or website notices.",
                "Continued use of our services after updates indicates acceptance of the revised Privacy Policy."
              ]
            }
          ].map((section, index) => (
            <section key={index} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              
              {section.content && <p className="text-gray-700 mb-4">{section.content}</p>}
              
              {section.subsections ? (
                <div className="space-y-6 ml-2">
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">{subsection.title}</h3>
                      {subsection.content && <p className="text-gray-700 mb-3">{subsection.content}</p>}
                      {subsection.items && (
                        <ul className="space-y-3 text-gray-700 ml-2">
                          {subsection.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3">
                              <span className="w-2 h-2 bg-gray-500 rounded-full mt-3 flex-shrink-0"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {subsection.note && (
                        <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-4 rounded-r-lg">
                          <p className="text-gray-800">{subsection.note}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : section.items ? (
                <ul className="space-y-3 text-gray-700 ml-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mt-3 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              
              {section.note && (
                <div className="bg-gray--50 border-l-4 border-gray--400 p-4 mt-4 rounded-r-lg">
                  <p className="text-gray--800 text-sm italic">{section.note}</p>
                </div>
              )}
            </section>
          ))}

          <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
                9
              </span>
              Contact Us
            </h2>
            <p className="text-gray-700 mb-4">For any questions, concerns, or requests related to privacy:</p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-sm font-medium text-gray-600 min-w-[60px]">Email:</span>
                  <a href="mailto:vivorasolutions@gmail.com" className="text-gray-600 hover:text-gray-800 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    vivorasolutions@gmail.com
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-sm font-medium text-gray-600 min-w-[60px]">Phone:</span>
                  <a href="tel:0766787578" className="text-gray-600 hover:text-gray-800 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    0766787578
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PrivacyPolicy