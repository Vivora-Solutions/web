import React from 'react';
import Header from './Header';

const teamMembers = [
  {
    name: 'ISHARA DILSHAN',
    position: 'Chief Executive Officer (CEO) – Director',
    role: 'Leads company vision, strategy, fundraising, partnerships, business registration, and legal compliance.',
    image: '/8.jpeg',
  },
  {
    name: 'SITHUM BIMSARA',
    position: 'Chief Technology Officer (CTO) – Director',
    role: 'Heads development team, product roadmap, and provides technical leadership.',
    image: '/3.jpeg',
  },
  {
    name: 'INDUWARA BANDARA',
    position: 'Chief Operating Officer (COO) – Director',
    role: 'Oversees daily operations, salon onboarding, and business execution through outreach and partnerships.',
    image: '/7.jpeg',
  },
  {
    name: 'KAVEESHA KAPURUGE',
    position: 'Creative Lead',
    role: 'Designs video content, flyers, graphics, and manages digital marketing & social media.',
    image: '/10.jpeg',
  },
  {
    name: 'DULITHA PERERA',
    position: 'Mobile Developer',
    role: 'Builds and maintains iOS/Android mobile applications and database systems.',
    image: '/5.jpeg',
  },
  {
    name: 'DAMINDU THAMODYA',
    position: 'Backend Developer',
    role: 'Manages server-side logic and system integrations.',
    image: '/1.jpeg',
  },
  {
    name: 'THEMIYA YASITH WIJESINGHE',
    position: 'Content Planner',
    role: 'Plans and creates engaging digital content, including scripts and captions.',
    image: '/4.jpeg',
  },
  {
    name: 'NIPUN SANGEETH',
    position: 'Frontend Developer',
    role: 'Builds and maintains the web platform (customer & salon dashboards) and supports salon onboarding.',
    image: '/9.jpeg',
  },
  {
    name: 'SASMITHA JAYASINGHE',
    position: 'Mobile Developer',
    role: 'Builds mobile applications and contributes to salon onboarding through outreach.',
    image: '/6.jpeg',
  },
  {
    name: 'DHANANJAYA WEERAKOON',
    position: 'Business Development Executive',
    role: 'Identifies, contacts, and onboards salons to the platform through calls, DMs, emails, and in-person visits.',
    image: '/2.jpeg',
  },
];

const About = () => {
  return (
    <div className="bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-16">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            About Vivora
          </h1>
          <p className="text-gray-700 text-lg lg:text-xl mt-4 max-w-3xl mx-auto">
            Your one-stop solution for discovering and booking the best salon experiences in your city.
          </p>
        </div>

        {/* About Us Story */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Us</h2>
          <p className="text-gray-600 mb-4">
            SalonDora was born out of a late-night discussion among friends who shared a simple but powerful idea:
            <span className="italic"> “What if busy people could book a salon appointment easily and walk in without waiting?”</span>
          </p>
          <p className="text-gray-600 mb-4">
            That thought grew into a software solution, and soon after, our team came together under the name <span className="font-semibold">Vivora Solutions</span>.
          </p>
          <p className="text-gray-600 mb-4">
            We are a group of 10 founders from diverse engineering backgrounds – Computer Science, Electronics, Mechanical, and Materials Engineering – united by a passion for solving real problems with technology. Our combined skills in engineering and business allowed us to quickly turn a small idea into a complete platform.
          </p>
          <p className="text-gray-600 mb-4">
            Our vision and mission is simple: <span className="font-semibold">to make everyday life easier through smart and accessible technology.</span>
          </p>
          <p className="text-gray-600 mb-4">
            In a very short time, SalonDora has seen rapid growth and adoption. We’ve improved the platform quickly, collaborated with leading salon chains, and onboarded many salons across the country.
          </p>
          <p className="text-gray-600">
            SalonDora is more than just an app – it’s the first step in our journey of building solutions that bring convenience and innovation into daily life.
          </p>
        </div>

        {/* Mission */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At Vivora, our mission is to bridge the gap between talented salon professionals and clients seeking quality beauty services. We believe that booking a salon appointment should be as easy and seamless as possible. Our platform empowers users to find the perfect salon, browse services, and book appointments with just a few clicks.
          </p>
          <p className="text-gray-600">
            We are committed to supporting local businesses by providing them with the tools they need to showcase their work, manage their schedules, and connect with a wider audience. For our users, we strive to offer a curated selection of top-rated salons, ensuring a high-quality experience every time.
          </p>
        </div>

        {/* Team */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
                  <img
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    src={member.image}
                    alt={member.name}
                  />
                  <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-gray-500">{member.position}</p>
                  <p className="text-gray-600 mt-2 text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
