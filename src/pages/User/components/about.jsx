
import React from 'react';
import Header from './Header';
const About = () => {
  return (
    <div className="bg-gray-100">
 
        <Header />
    
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            About SalonDora
          </h1>
          <p className="text-gray-700 text-lg lg:text-xl mt-4 max-w-3xl mx-auto">
            Your one-stop solution for discovering and booking the best salon experiences in your city.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At Vivora, our mission is to bridge the gap between talented salon professionals and clients seeking quality beauty services. We believe that booking a salon appointment should be as easy and seamless as possible. Our platform empowers users to find the perfect salon, browse services, and book appointments with just a few clicks.
          </p>
          <p className="text-gray-600">
            We are committed to supporting local businesses by providing them with the tools they need to showcase their work, manage their schedules, and connect with a wider audience. For our users, we strive to offer a curated selection of top-rated salons, ensuring a high-quality experience every time.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {/* Team Member 1 */}
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200"></div>
                <h3 className="text-xl font-semibold text-gray-800">John Doe</h3>
                <p className="text-gray-500">Co-Founder & CEO</p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200"></div>
                <h3 className="text-xl font-semibold text-gray-800">Jane Smith</h3>
                <p className="text-gray-500">Co-Founder & CTO</p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200"></div>
                <h3 className="text-xl font-semibold text-gray-800">Peter Jones</h3>
                <p className="text-gray-500">Lead Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
