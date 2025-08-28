import Footer from "./components/Footer"

export default function TermsAndConditionsForSalons() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">SalonDora Terms and Conditions</h1>
          <p className="text-lg text-slate-600 font-medium">Client Agreement</p>
          {/* <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            Effective Date: [Insert Date]
          </div> */}
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <p className="text-slate-700 leading-relaxed text-pretty">
            Welcome to SalonDora! By accessing or using our website or mobile application, you agree to comply with
            these Terms and Conditions ("Terms"). These Terms apply to all users of our services, including booking
            appointments at salons, receiving promotions, and participating in loyalty programs.
          </p>
          <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <p className="text-amber-800 font-medium">
              If you do not agree with these Terms, please do not use our services.
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </span>
              Scope of Services
            </h2>
            <p className="text-slate-700 mb-4">SalonDora provides the following services to clients:</p>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Booking salon appointments (instant or requested bookings).
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Access to promotions and loyalty programs (e.g., discounts for frequent visits).
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Viewing salon profiles, services, and pricing.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Salons may promote themselves through the platform; these features may be added over time.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </span>
              User Accounts
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Clients must create an account to use SalonDora services.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Required information: email address and phone number. Social logins are not supported.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Accounts are intended for users aged 12+.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Clients are responsible for maintaining the confidentiality of their account credentials.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </span>
              Booking & Cancellation
            </h2>
            <ul className="space-y-3 text-slate-700 mb-6">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Clients can make instant bookings or requested bookings depending on salon preference.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                All bookings are pay at the venue; SalonDora does not process payments directly.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                No booking fees or refunds are collected by SalonDora.
              </li>
            </ul>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-bold text-red-900 mb-3">No-shows:</h3>
              <ul className="space-y-2 text-red-800">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Missed appointments will incur a penalty recorded in the client's account balance.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  This balance will be added to the next booking.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Repeated no-shows may result in account suspension or permanent ban.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                4
              </span>
              Payments
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Payments are made directly to the salon at the venue.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                SalonDora currently does not support third-party payment processing.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                5
              </span>
              Liability & Disclaimers
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                SalonDora is not responsible for the quality of services provided by salons.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                The platform is responsible for errors or technical issues within the app or website.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                SalonDora may use third-party services (e.g., hosting, database management); any liability related to
                these services is limited to what is required by law.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                6
              </span>
              User Conduct
            </h2>
            <p className="text-slate-700 mb-4">Clients agree not to:</p>
            <ul className="space-y-3 text-slate-700 mb-6">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Harass or threaten salon staff or other users.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Submit fake reviews or fraudulent requests.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Make illegal or inappropriate service requests.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Misbehave in a manner that affects salon operations or other users.
              </li>
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 font-medium">
                Violations may result in immediate account suspension or permanent ban.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                7
              </span>
              Intellectual Property
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                SalonDora's logo, branding, website content, and app are the intellectual property of SalonDora.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Photos and content provided by salons remain the intellectual property of the respective salons.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Users may not reproduce, distribute, or modify SalonDora's content without written permission.
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                8
              </span>
              Data & Privacy
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                SalonDora collects only booking history for operational purposes and tracking client account balances.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                No other personal data is collected unless voluntarily provided by the client.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Booking data will not be shared with third parties.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>A separate Privacy
                Policy will provide more details about data handling.
              </li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                9
              </span>
              Dispute Resolution
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                These Terms are governed by Sri Lankan law.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Any disputes will be resolved through mediation or arbitration where possible. If necessary, disputes
                may be escalated to the competent courts in Sri Lanka.
              </li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                10
              </span>
              Changes to Terms
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                SalonDora may update these Terms periodically.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Clients will be notified via app notifications, email, or website announcements.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Continued use of the platform after changes constitutes acceptance of the updated Terms.
              </li>
            </ul>
          </section>

          {/* Section 11 - Contact */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                11
              </span>
              Contact Information
            </h2>
            <p className="text-slate-700 mb-4">For questions about these Terms, please contact:</p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Email</p>
                  <a
                    href="mailto:vivorasolutions@gmail.com"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    vivorasolutions@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Phone</p>
                  <a href="tel:0766787578" className="text-blue-600 hover:text-blue-800 transition-colors">
                    0766787578
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white rounded-lg shadow-sm border border-slate-200 px-6 py-4">
            <p className="text-sm text-slate-600">© 2024 SalonDora. All rights reserved.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
