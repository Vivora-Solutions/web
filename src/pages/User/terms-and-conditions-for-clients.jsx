import Footer from "./components/Footer"
import Header from "./components/Header"

export default function TermsAndConditionsForClients() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <Header/>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-8 sm:mb-12 text-center">
          {/* <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-gray-500 to-gray--600 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
          </div> */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-balance">
            SalonDora – Terms and Conditions (Clients)
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">Last Updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all hover:shadow-xl">
            <p className="text-gray-700 leading-relaxed">
              Welcome to SalonDora! By accessing or using our website or mobile application, you agree to comply with
              these Terms and Conditions ("Terms"). These Terms apply to all users of our services, including booking
              appointments at salons, receiving promotions, and participating in loyalty programs.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4 font-medium bg-gray--50 p-3 rounded-lg border-l-4 border-gray--400">
              If you do not agree with these Terms, please do not use our services.
            </p>
          </div>

          {[
            {
              title: "1. Scope of Services",
              items: [
                "Booking salon appointments (instant or requested bookings).",
                "Access to promotions and loyalty programs (e.g., discounts for frequent visits).",
                "Viewing salon profiles, services, and pricing.",
                "Salons may promote themselves through the platform; these features may be added over time."
              ]
            },
            {
              title: "2. User Accounts",
              items: [
                "Clients must create an account to use SalonDora services.",
                "Required information: email address and phone number. Social logins are not supported.",
                "Accounts are intended for users aged 12+.",
                "Clients are responsible for maintaining the confidentiality of their account credentials."
              ]
            },
            {
              title: "3. Booking & Cancellation",
              items: [
                "Clients can make instant bookings or requested bookings depending on salon preference.",
                "All bookings are pay at the venue; SalonDora does not process payments directly.",
                "No booking fees or refunds are collected by SalonDora."
              ],
              subSection: {
                title: "No-shows:",
                items: [
                  "Missed appointments will incur a penalty recorded in the client's account balance.",
                  "This balance will be added to the next booking.",
                  "Repeated no-shows may result in account suspension or permanent ban."
                ]
              }
            },
            {
              title: "4. Payments",
              items: [
                "Payments are made directly to the salon at the venue.",
                "SalonDora currently does not support third-party payment processing."
              ]
            },
            {
              title: "5. Liability & Disclaimers",
              items: [
                "SalonDora is not responsible for the quality of services provided by salons.",
                "The platform is responsible for errors or technical issues within the app or website.",
                "SalonDora may use third-party services (e.g., hosting, database management); any liability related to these services is limited to what is required by law."
              ]
            },
            {
              title: "6. User Conduct",
              warning: true,
              items: [
                "Harass or threaten salon staff or other users.",
                "Submit fake reviews or fraudulent requests.",
                "Make illegal or inappropriate service requests.",
                "Misbehave in a manner that affects salon operations or other users."
              ],
              note: "Violations may result in immediate account suspension or permanent ban."
            },
            {
              title: "7. Intellectual Property",
              items: [
                "SalonDora's logo, branding, website content, and app are the intellectual property of SalonDora.",
                "Photos and content provided by salons remain the intellectual property of the respective salons.",
                "Users may not reproduce, distribute, or modify SalonDora's content without written permission."
              ]
            },
            {
              title: "8. Data & Privacy",
              items: [
                "SalonDora collects only booking history for operational purposes and tracking client account balances.",
                "No other personal data is collected unless voluntarily provided by the client.",
                "Booking data will not be shared with third parties.",
                "A separate Privacy Policy will provide more details about data handling."
              ]
            },
            {
              title: "9. Dispute Resolution",
              items: [
                "These Terms are governed by Sri Lankan law.",
                "Any disputes will be resolved through mediation or arbitration where possible. If necessary, disputes may be escalated to the competent courts in Sri Lanka."
              ]
            },
            {
              title: "10. Changes to Terms",
              items: [
                "SalonDora may update these Terms periodically.",
                "Clients will be notified via app notifications, email, or website announcements.",
                "Continued use of the platform after changes constitutes acceptance of the updated Terms."
              ]
            }
          ].map((section, index) => (
            <section key={index} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="bg-gradient-to-r from-gray-500 to-gray--600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              
              <ul className="space-y-3 text-gray-700">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-3 flex-shrink-0 ${section.warning ? 'bg-gray-500' : 'bg-gray--500'}`}></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              {section.subSection && (
                <div className="bg-gray-50 rounded-lg p-4 mt-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">{section.subSection.title}</h3>
                  <ul className="space-y-2 text-gray-600">
                    {section.subSection.items.map((item, subIndex) => (
                      <li key={subIndex} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {section.note && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-4 border-l-4 border-gray-400">
                  <strong>Note:</strong> {section.note}
                </p>
              )}
            </section>
          ))}

          <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <span className="bg-gradient-to-r from-gray-500 to-gray--600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
                11
              </span>
              Contact Information
            </h2>
            <p className="text-gray-600 mb-4">For questions about these Terms, please contact:</p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-sm font-medium text-gray-600 min-w-[60px]">Email:</span>
                  <a href="mailto:vivorasolutions@gmail.com" className="text-gray--600 hover:underline font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    vivorasolutions@gmail.com
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-sm font-medium text-gray-600 min-w-[60px]">Phone:</span>
                  <a href="tel:0766787578" className="text-gray--600 hover:underline font-medium flex items-center">
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

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  )
}