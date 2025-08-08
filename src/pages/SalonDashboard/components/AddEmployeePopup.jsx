// import React, { useState } from 'react';

// const AddEmployeePopup = ({ onSave, onClose, defaultPic }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     contact_no: '',
//     profilePic: defaultPic,
//     email: '',
//     bio: '',
//   });

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         handleChange('profilePic', event.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = () => {
//     if (formData.name && formData.contact_no) {
//       onSave(formData);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center w-screen h-screen bg-black/80">
//       <div className="bg-gray-50 p-6 rounded-xl w-80 max-h-[95vh] overflow-y-auto shadow-lg">
//         <h3 className="text-base font-semibold mb-5">Add Employee</h3>

//         <div className="flex justify-center items-center relative mb-6">
//           <img
//             src={formData.profilePic}
//             alt="Profile"
//             className="w-[70px] h-[70px] rounded-full object-cover border-2 border-gray-300"
//           />
//           <label
//             htmlFor="add-profile-upload"
//             className="absolute bottom-1 right-[65px] bg-white border border-gray-300 rounded-full p-1 text-xs cursor-pointer"
//           >
//             📷
//           </label>
//           <input
//             id="add-profile-upload"
//             type="file"
//             className="hidden"
//             accept="image/*"
//             onChange={handleImageUpload}
//           />
//         </div>

//         <div className="flex flex-col mb-4">
//           <label className="text-xs text-gray-600 mb-1">Name</label>
//           <input
//             className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-200"
//             value={formData.name}
//             onChange={(e) => handleChange('name', e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col mb-4">
//           <label className="text-xs text-gray-600 mb-1">Contact Number</label>
//           <input
//             className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-200"
//             value={formData.contact_no}
//             onChange={(e) => handleChange('contact_no', e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col mb-4">
//           <label className="text-xs text-gray-600 mb-1">Email</label>
//           <input
//             className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-200"
//             value={formData.email}
//             onChange={(e) => handleChange('email', e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col mb-4">
//           <label className="text-xs text-gray-600 mb-1">Bio</label>
//           <textarea
//             className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-200"
//             value={formData.bio}
//             onChange={(e) => handleChange('bio', e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col mb-4">
//           <label className="text-xs text-gray-600 mb-1">Services Possible</label>
//           <div className="bg-gray-200 p-3 rounded-md max-h-[130px] overflow-y-auto text-sm space-y-2">
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> Hair Cutting and Shaving - M
//             </label>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> Oil Massage - U
//             </label>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> Beard Trimming - M
//             </label>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm rounded-md bg-gray-300"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 text-sm rounded-md bg-black text-white"
//           >
//             Save and Add
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEmployeePopup;
