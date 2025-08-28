
// import Header from "./Header"
// import Footer from "./Footer"   

// const teamMembers = [
//   {
//     name: "ISHARA DILSHAN",
//     position: "Chief Executive Officer (CEO) – Director",
//     role: "Leads company vision, strategy, fundraising, partnerships, business registration, and legal compliance.",
//     image: "/8.jpeg",
//   },
//   {
//     name: "SITHUM BIMSARA",
//     position: "Chief Technology Officer (CTO) – Director",
//     role: "Heads development team, product roadmap, and provides technical leadership.",
//     image: "/3.jpeg",
//   },
//   {
//     name: "INDUWARA BANDARA",
//     position: "Chief Operating Officer (COO) – Director",
//     role: "Oversees daily operations, salon onboarding, and business execution through outreach and partnerships.",
//     image: "/7.jpeg",
//   },
//   {
//     name: "KAVEESHA KAPURUGE",
//     position: "Creative Lead",
//     role: "Designs video content, flyers, graphics, and manages digital marketing & social media.",
//     image: "/10.jpeg",
//   },
//   {
//     name: "DULITHA PERERA",
//     position: "Mobile Developer",
//     role: "Builds and maintains iOS/Android mobile applications and database systems.",
//     image: "/5.jpeg",
//   },
//   {
//     name: "DAMINDU THAMODYA",
//     position: "Backend Developer",
//     role: "Manages server-side logic and system integrations.",
//     image: "/1.jpeg",
//   },
//   {
//     name: "THEMIYA YASITH WIJESINGHE",
//     position: "Content Planner",
//     role: "Plans and creates engaging digital content, including scripts and captions.",
//     image: "/4.jpeg",
//   },
//   {
//     name: "NIPUN SANGEETH",
//     position: "Frontend Developer",
//     role: "Builds and maintains the web platform (customer & salon dashboards) and supports salon onboarding.",
//     image: "/9.jpeg",
//   },
//   {
//     name: "SASMITHA JAYASINGHE",
//     position: "Mobile Developer",
//     role: "Builds mobile applications and contributes to salon onboarding through outreach.",
//     image: "/6.jpeg",
//   },
//   {
//     name: "DHANANJAYA WEERAKOON",
//     position: "Business Development Executive",
//     role: "Identifies, contacts, and onboards salons to the platform through calls, DMs, emails, and in-person visits.",
//     image: "/2.jpeg",
//   },
// ]

// const About = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
//         <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
//       </div>

//       <Header />

//       <div className="relative py-20 overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400">
//         <div className="absolute inset-0 bg-black/10"></div>
//         <div className="relative container mx-auto px-4">
//           <div className="text-center text-white max-w-4xl mx-auto">
//             <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in-up">
//               About{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 animate-gradient-x">
//                 Vivora
//               </span>
//             </h1>
//             <p className="text-xl md:text-2xl opacity-90 mb-12 animate-fade-in-up animation-delay-300 leading-relaxed">
//               Your one-stop solution for discovering and booking the best salon experiences in your city.
//             </p>

//             <div className="absolute inset-0 overflow-hidden">
//               <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-float"></div>
//               <div className="absolute top-32 right-20 w-3 h-3 bg-pink-300 rounded-full animate-float animation-delay-1000"></div>
//               <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float animation-delay-2000"></div>
//               <div className="absolute bottom-32 right-1/3 w-4 h-4 bg-purple-300 rounded-full animate-float animation-delay-500"></div>

//               <div className="absolute top-16 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
//               <div className="absolute top-20 right-1/4 w-72 h-72 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
//               <div className="absolute bottom-10 left-1/5 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>
//             </div>
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 w-full overflow-hidden">
//           <svg
//             className="relative block w-full h-20"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 1200 120"
//             preserveAspectRatio="none"
//           >
//             <path
//               d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
//               opacity=".25"
//               fill="currentColor"
//               className="text-slate-50 animate-wave"
//             ></path>
//             <path
//               d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
//               opacity=".5"
//               fill="currentColor"
//               className="text-slate-50 animate-wave animation-delay-1000"
//             ></path>
//             <path
//               d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
//               fill="currentColor"
//               className="text-slate-50 animate-wave animation-delay-2000"
//             ></path>
//           </svg>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-20 relative z-10">
        

        

//         <div className="text-center mb-16 animate-fade-in-up animation-delay-400">
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-balance">Meet Our Team</h2>
//           <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mx-auto mb-6"></div>
//           <p className="text-gray-600 max-w-3xl mx-auto mb-16 text-xl leading-relaxed">
//             A diverse team of passionate individuals working together to revolutionize the salon experience.
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {teamMembers.map((member, index) => (
//               <div
//                 key={index}
//                 className={`group animate-fade-in-up ${
//                   index === teamMembers.length - 1 && teamMembers.length % 3 === 1 ? "lg:col-start-2" : ""
//                 }`}
//                 style={{ animationDelay: `${index * 100 + 600}ms` }}
//               >
//                 <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 transform transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl group-hover:bg-white relative overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

//                   <div className="relative mb-6">
//                     <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl relative">
//                       <img
//                         className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-3"
//                         src={member.image || "/placeholder.svg"}
//                         alt={member.name}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//                     </div>

//                     <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/3 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-6 w-6 text-white"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                   </div>

//                   <div className="relative">
//                     <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors duration-300">
//                       {member.name}
//                     </h3>
//                     <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full mx-auto mb-4 group-hover:w-20 transition-all duration-300"></div>
//                     <p className="text-purple-600 font-semibold mb-4 text-sm">{member.position}</p>
//                     <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
//                       {member.role}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>



//         <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 md:p-12 mb-20 transition-all duration-500 hover:shadow-3xl hover:bg-white/90 group animate-fade-in-up">
//           <div className="flex items-center mb-8">
//             <div className="h-12 w-1.5 bg-gradient-to-b from-pink-500 via-rose-500 to-orange-400 rounded-full mr-6 group-hover:scale-110 transition-transform duration-300"></div>
//             <h2 className="text-4xl font-bold text-gray-800 group-hover:text-rose-600 transition-colors duration-300">
//               Our Story
//             </h2>
//           </div>

//           <div className="space-y-6 text-lg leading-relaxed">
//             <p className="text-gray-700 animate-fade-in-up animation-delay-100">
//               SalonDora was born out of a late-night discussion among friends who shared a simple but powerful idea:
//               <span className="italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
//                 {" "}
//                 "What if busy people could book a salon appointment easily and walk in without waiting?"
//               </span>
//             </p>
//             <p className="text-gray-700 animate-fade-in-up animation-delay-200">
//               That thought grew into a software solution, and soon after, our team came together under the name{" "}
//               <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
//                 Vivora Solutions
//               </span>
//               .
//             </p>
//             <p className="text-gray-700 animate-fade-in-up animation-delay-300">
//               We are a group of 10 founders from diverse engineering backgrounds – Computer Science, Electronics,
//               Mechanical, and Materials Engineering – united by a passion for solving real problems with technology.
//             </p>
//             <p className="text-gray-700 animate-fade-in-up animation-delay-400">
//               Our vision and mission is simple:{" "}
//               <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
//                 to make everyday life easier through smart and accessible technology.
//               </span>
//             </p>
//             <p className="text-gray-700 animate-fade-in-up animation-delay-500">
//               In a very short time, SalonDora has seen rapid growth and adoption. We've improved the platform quickly,
//               collaborated with leading salon chains, and onboarded many salons across the country.
//             </p>
//             <p className="text-gray-700 animate-fade-in-up animation-delay-600">
//               SalonDora is more than just an app – it's the first step in our journey of building solutions that bring
//               convenience and innovation into daily life.
//             </p>
//           </div>
//         </div>

//       <Footer />        
        
//       </div>

//       <style jsx>{`
//         @keyframes fade-in-up {
//           0% {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes blob {
//           0% {
//             transform: translate(0px, 0px) scale(1) rotate(0deg);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1) rotate(120deg);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9) rotate(240deg);
//           }
//           100% {
//             transform: translate(0px, 0px) scale(1) rotate(360deg);
//           }
//         }
        
//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-20px) rotate(180deg);
//           }
//         }
        
//         @keyframes gradient-x {
//           0%, 100% {
//             background-size: 200% 200%;
//             background-position: left center;
//           }
//           50% {
//             background-size: 200% 200%;
//             background-position: right center;
//           }
//         }
        
//         @keyframes wave {
//           0% {
//             transform: translateX(0);
//           }
//           50% {
//             transform: translateX(-25%);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }
        
//         .animate-fade-in-up {
//           animation: fade-in-up 0.8s ease-out forwards;
//         }
        
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
        
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
        
//         .animate-gradient-x {
//           animation: gradient-x 3s ease infinite;
//         }
        
//         .animate-wave {
//           animation: wave 10s ease-in-out infinite;
//         }
        
//         .animation-delay-100 { animation-delay: 100ms; }
//         .animation-delay-200 { animation-delay: 200ms; }
//         .animation-delay-300 { animation-delay: 300ms; }
//         .animation-delay-400 { animation-delay: 400ms; }
//         .animation-delay-500 { animation-delay: 500ms; }
//         .animation-delay-600 { animation-delay: 600ms; }
//         .animation-delay-1000 { animation-delay: 1s; }
//         .animation-delay-2000 { animation-delay: 2s; }
//         .animation-delay-4000 { animation-delay: 4s; }
        
//         .shadow-3xl {
//           box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
//         }
//       `}</style>
//     </div>
//   )
// }

// export default About





import Header from "./components/Header"
import Footer from "./components/Footer"   

const teamMembers = [
  {
    name: "ISHARA DILSHAN",
    position: "Chief Executive Officer (CEO) – Director",
    role: "Leads company vision, strategy, fundraising, partnerships, business registration, and legal compliance.",
    image: "/8.jpeg",
  },
  {
    name: "SITHUM BIMSARA",
    position: "Chief Technology Officer (CTO) – Director",
    role: "Heads development team, product roadmap, and provides technical leadership.",
    image: "/3.jpeg",
  },
  {
    name: "INDUWARA BANDARA",
    position: "Chief Operating Officer (COO) – Director",
    role: "Oversees daily operations, salon onboarding, and business execution through outreach and partnerships.",
    image: "/7.jpeg",
  },
  {
    name: "KAVEESHA KAPURUGE",
    position: "Creative Lead",
    role: "Designs video content, flyers, graphics, and manages digital marketing & social media.",
    image: "/10.jpeg",
  },
  {
    name: "DULITHA PERERA",
    position: "Mobile Developer",
    role: "Builds and maintains iOS/Android mobile applications and database systems.",
    image: "/5.jpeg",
  },
  {
    name: "DAMINDU THAMODYA",
    position: "Backend Developer",
    role: "Manages server-side logic and system integrations.",
    image: "/1.jpeg",
  },
  {
    name: "THEMIYA YASITH WIJESINGHE",
    position: "Content Planner",
    role: "Plans and creates engaging digital content, including scripts and captions.",
    image: "/4.jpeg",
  },
  {
    name: "NIPUN SANGEETH",
    position: "Frontend Developer",
    role: "Builds and maintains the web platform (customer & salon dashboards) and supports salon onboarding.",
    image: "/9.jpeg",
  },
  {
    name: "SASMITHA JAYASINGHE",
    position: "Mobile Developer",
    role: "Builds mobile applications and contributes to salon onboarding through outreach.",
    image: "/6.jpeg",
  },
  {
    name: "DHANANJAYA WEERAKOON",
    position: "Business Development Executive",
    role: "Identifies, contacts, and onboards salons to the platform through calls, DMs, emails, and in-person visits.",
    image: "/2.jpeg",
  },
]

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <Header />

      <div className="flex-grow">
        <div className="relative py-20 overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container mx-auto px-4">
            <div className="text-center text-white max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in-up">
                About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 animate-gradient-x">
                  Vivora
                </span>
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-12 animate-fade-in-up animation-delay-300 leading-relaxed">
                Your one-stop solution for discovering and booking the best salon experiences in your city.
              </p>

              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-float"></div>
                <div className="absolute top-32 right-20 w-3 h-3 bg-pink-300 rounded-full animate-float animation-delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float animation-delay-2000"></div>
                <div className="absolute bottom-32 right-1/3 w-4 h-4 bg-purple-300 rounded-full animate-float animation-delay-500"></div>

                <div className="absolute top-16 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
                <div className="absolute top-20 right-1/4 w-72 h-72 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-10 left-1/5 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full overflow-hidden">
            <svg
              className="relative block w-full h-20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                opacity=".25"
                fill="currentColor"
                className="text-slate-50 animate-wave"
              ></path>
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
                fill="currentColor"
                className="text-slate-50 animate-wave animation-delay-1000"
              ></path>
              <path
                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                fill="currentColor"
                className="text-slate-50 animate-wave animation-delay-2000"
              ></path>
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up animation-delay-400">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-balance">Meet Our Team</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto mb-16 text-xl leading-relaxed">
              A diverse team of passionate individuals working together to revolutionize the salon experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className={`group animate-fade-in-up ${
                    index === teamMembers.length - 1 && teamMembers.length % 3 === 1 ? "lg:col-start-2" : ""
                  }`}
                  style={{ animationDelay: `${index * 100 + 600}ms` }}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 transform transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl group-hover:bg-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative mb-6">
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl relative">
                        <img
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-3"
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/3 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full mx-auto mb-4 group-hover:w-20 transition-all duration-300"></div>
                      <p className="text-purple-600 font-semibold mb-4 text-sm">{member.position}</p>
                      <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 md:p-12 mb-20 transition-all duration-500 hover:shadow-3xl hover:bg-white/90 group animate-fade-in-up">
            <div className="flex items-center mb-8">
              <div className="h-12 w-1.5 bg-gradient-to-b from-pink-500 via-rose-500 to-orange-400 rounded-full mr-6 group-hover:scale-110 transition-transform duration-300"></div>
              <h2 className="text-4xl font-bold text-gray-800 group-hover:text-rose-600 transition-colors duration-300">
                Our Story
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-gray-700 animate-fade-in-up animation-delay-100">
                SalonDora was born out of a late-night discussion among friends who shared a simple but powerful idea:
                <span className="italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                  {" "}
                  "What if busy people could book a salon appointment easily and walk in without waiting?"
                </span>
              </p>
              <p className="text-gray-700 animate-fade-in-up animation-delay-200">
                That thought grew into a software solution, and soon after, our team came together under the name{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                  Vivora Solutions
                </span>
                .
              </p>
              <p className="text-gray-700 animate-fade-in-up animation-delay-300">
                We are a group of 10 founders from diverse engineering backgrounds – Computer Science, Electronics,
                Mechanical, and Materials Engineering – united by a passion for solving real problems with technology.
              </p>
              <p className="text-gray-700 animate-fade-in-up animation-delay-400">
                Our vision and mission is simple:{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                  to make everyday life easier through smart and accessible technology.
                </span>
              </p>
              <p className="text-gray-700 animate-fade-in-up animation-delay-500">
                In a very short time, SalonDora has seen rapid growth and adoption. We've improved the platform quickly,
                collaborated with leading salon chains, and onboarded many salons across the country.
              </p>
              <p className="text-gray-700 animate-fade-in-up animation-delay-600">
                SalonDora is more than just an app – it's the first step in our journey of building solutions that bring
                convenience and innovation into daily life.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9) rotate(240deg);
          }
          100% {
            transform: translate(0px, 0px) scale(1) rotate(360deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-wave {
          animation: wave 10s ease-in-out infinite;
        }
        
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}

export default About