// import { User, Calendar, Settings, CheckCircle, Ban, Wrench } from "lucide-react"

// const StylistCard = ({ stylist, onManageSchedule, onManageServices, onManageProfile, onDisableStylist, onActivateStylist }) => {
//   return (
//     <div className="bg-white rounded-lg p-5 flex justify-between items-center shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           {stylist.profile_pic_link ? (
//             <img
//               src={stylist.profile_pic_link || "/placeholder.svg"}
//               alt={stylist.stylist_name}
//               className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white overflow-hidden"
//             />
//           ) : (
//             <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white">
//               <User size={24} />
//             </div>
//           )}
//           <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">{stylist.stylist_name}</h3>
//           <p className="text-sm text-gray-500">{stylist.stylist_contact_number}</p>
//           {stylist.bio && <p className="text-xs text-gray-400 max-w-xs">{stylist.bio}</p>}
//         </div>
//       </div>

//       {stylist.is_active ? (
//         <div className="flex gap-2">
//           <button
//             onClick={() => onManageSchedule(stylist)}
//             className="p-2.5 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 hover:scale-105 transition-all"
//             title="Manage Schedule"
//           >
//             <Calendar size={18} />
//             <span className="text-xs mt-1">Schedule</span>
//           </button>

//           <button
//             onClick={() => onManageProfile(stylist)}
//             className="p-2.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-purple-200 hover:scale-105 transition-all"
//             title="Manage Profile"
//           >
//             <Settings size={18} />
//             <span className="text-xs mt-1">Profile</span>
//           </button>


//           <button
//             onClick={() => onManageSchedule(stylist)}
//             className="p-2.5 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 hover:scale-105 transition-all"
//             title="Manage Schedule"
//           >
//             <Calendar size={18} />
//             <span className="text-xs mt-1">Schedule</span>
//           </button>

//           <button
//             onClick={() => onManageProfile(stylist)}
//             className="p-2.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-purple-200 hover:scale-105 transition-all"
//             title="Manage Profile"
//           >
//             <Settings size={18} />
//             <span className="text-xs mt-1">Profile</span>
//           </button>

//           <button
//             onClick={() => onManageServices(stylist)}
//             className="p-2.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 hover:scale-105 transition-all"
//             title="Manage Services"
//           >
//             <Wrench size={18} />
//             <span className="text-xs mt-1">Service</span>
//           </button>
//           <button
//             onClick={() => onDisableStylist(stylist.stylist_id)}
//             className="p-2.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:scale-105 transition-all"
//             title="Delete"
//           >
//             <Ban size={18} />
//             <span className="text-xs mt-1">Disable</span>
//           </button>
//         </div>
//       ) : (
//         <div>
//           <button
//             onClick={() => onActivateStylist(stylist.stylist_id)}
//             className="p-2.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 hover:scale-105 transition-all"
//             title="Activate Stylist"
//           >
//             <CheckCircle size={18} />
//             <span className="text-xs mt-1">Activate</span>
//           </button>


//         </div>
//       )}
//     </div>
//   )
// }

// export default StylistCard



import { User, Calendar, Settings, CheckCircle, Ban, Wrench } from "lucide-react";

const StylistCard = ({ stylist, onManageServices, onManageProfile, onDisableStylist, onActivateStylist, onManageWorkingSchedule }) => {
  return (
    <div className="bg-white rounded-lg p-5 flex justify-between items-center shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-center gap-4">
        <div className="relative">
          {stylist.profile_pic_link ? (
            <img
              src={stylist.profile_pic_link}
              alt={stylist.stylist_name}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white overflow-hidden"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white">
              <User size={24} />
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{stylist.stylist_name}</h3>
          <p className="text-sm text-gray-500">{stylist.stylist_contact_number}</p>
          {stylist.bio && <p className="text-xs text-gray-400 max-w-xs">{stylist.bio}</p>}
        </div>
      </div>

      {stylist.is_active ? (
        <div className="flex gap-2">
          {/* <button
            onClick={() => onManageSchedule(stylist)}
            className="p-2.5 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 hover:scale-105 transition-all"
            title="Calendar View"
          >
            <Calendar size={18} />
            <span className="text-xs mt-1">Calendar</span>
          </button> */}

          <button
            onClick={() => onManageWorkingSchedule(stylist)}
            className="p-2.5 rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-200 hover:scale-105 transition-all"
            title="Edit Weekly Schedule"
          >
            <Calendar size={18} />
            <span className="text-xs mt-1">Weekly</span>
          </button>

          <button
            onClick={() => onManageProfile(stylist)}
            className="p-2.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 transition-all"
            title="Profile"
          >
            <Settings size={18} />
            <span className="text-xs mt-1">Profile</span>
          </button>

          <button
            onClick={() => onManageServices(stylist)}
            className="p-2.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 hover:scale-105 transition-all"
            title="Services"
          >
            <Wrench size={18} />
            <span className="text-xs mt-1">Service</span>
          </button>

          <button
            onClick={() => onDisableStylist(stylist.stylist_id)}
            className="p-2.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:scale-105 transition-all"
            title="Disable"
          >
            <Ban size={18} />
            <span className="text-xs mt-1">Disable</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => onActivateStylist(stylist.stylist_id)}
          className="p-2.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 hover:scale-105 transition-all"
          title="Activate Stylist"
        >
          <CheckCircle size={18} />
          <span className="text-xs mt-1">Activate</span>
        </button>
      )}
    </div>
  );
};

export default StylistCard;
