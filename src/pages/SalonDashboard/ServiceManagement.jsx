// import { useState, useEffect } from 'react';
// import { ProtectedAPI } from '../../utils/api';
// import LoadingSpinner from '../../components/LoadingSpinner';

// const ServiceManagement = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [isAdding, setIsAdding] = useState(false);
//   const DURATION_OPTIONS = Array.from({ length: 16 }, (_, i) => (i + 1) * 15); // 15..240

//   const [formData, setFormData] = useState({
//     service_name: '',
//     service_description: '',
//     service_image_link: '',
//     price: 0,
//     duration_minutes: 30,
//     is_available: true,
//     service_category: 'unisex',
//     show_price: false
//   });

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const fetchServices = async () => {
//     setLoading(true);
//     try {
//       const response = await ProtectedAPI.get('/salon-admin/services');
//       setServices(response.data);
//     } catch (error) {
//       console.error('Error fetching services:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddNewClick = () => {
//     setIsAdding(true);
//     setEditingId(null);
//     setFormData({
//       service_name: '',
//       service_description: '',
//       service_image_link: '',
//       price: 0,
//       duration_minutes: 30,
//       is_available: true,
//       service_category: 'unisex',
//       show_price: false
//     });
//   };

//   const handleEditClick = (service) => {
//     setIsAdding(false);
//     setEditingId(service.service_id);
//     setFormData({
//       ...service,
//       price: service?.price ?? 0,
//       duration_minutes: service?.duration_minutes ?? 0
//     });
//   };

//   const handleCancel = () => {
//     setIsAdding(false);
//     setEditingId(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleAddService = async () => {
//     try {
//       const payload = {
//         ...formData,
//         price: Number(formData.price),
//         duration_minutes: Number(formData.duration_minutes)
//       };
//       await ProtectedAPI.post('/salon-admin/services', payload);
//       await fetchServices(); 
//       setIsAdding(false);
//       alert('Service added successfully!');
//     } catch (error) {
//       console.error('Error adding service:', error);
//       alert('Failed to add service');
//     }
//   };

//   const handleUpdateService = async (serviceId) => {
//     try {
//       const payload = {
//         ...formData,
//         price: Number(formData.price),
//         duration_minutes: Number(formData.duration_minutes)
//       };
//       console.log('Updating service with payload:', payload);
//       await ProtectedAPI.put(`/salon-admin/services/${serviceId}`, payload);
//       await fetchServices(); // <<< refresh the table after update too
//       setEditingId(null);
//       alert('Service updated successfully!');
//     } catch (error) {
//       console.error('Error updating service:', error);
//       alert('Failed to update service');
//     }
//   };

//   if (loading) return <LoadingSpinner message="Loading services..." />;

//   return (
//     <div className="max-w-8xl mx-auto p-1">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold">Service Management</h2>
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
//           onClick={handleAddNewClick}
//           disabled={isAdding || editingId !== null}
//         >
//           Add New Service
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300">
//           <thead className="bg-gray-400">
//             <tr>
//               <th className="px-4 py-2 text-left">Name</th>
//               <th className="px-4 py-2 text-left">Description</th>
//               <th className="px-4 py-2 text-left">Price</th>
//               <th className="px-4 py-2 text-left">Duration</th>
//               <th className="px-4 py-2 text-left">Category</th>
//               <th className="px-4 py-2 text-left">Available</th>
//               <th className="px-4 py-2 text-left">Show Price</th>
//               <th className="px-4 py-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* ADD NEW */}
//             {isAdding && (
//               <tr className="bg-green-50">
//                 {['service_name', 'service_description'].map((field) => (
//                   <td className="px-4 py-2" key={field}>
//                     <input
//                       type="text"
//                       name={field}
//                       value={formData[field]}
//                       onChange={handleInputChange}
//                       className="w-full border rounded p-2"
//                     />
//                   </td>
//                 ))}
//                 <td className="px-4 py-2">
//                   <input
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2"
//                   />
//                 </td>
//                 <td className="px-4 py-2">
//                   <input
//                     type="number"
//                     name="duration_minutes"
//                     value={formData.duration_minutes}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2"
//                   />
//                 </td>
//                 <td className="px-4 py-2">
//                   <select
//                     name="service_category"
//                     value={formData.service_category}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2"
//                   >
//                     <option value="unisex">Unisex</option>
//                     <option value="men">Men</option>
//                     <option value="women">Women</option>
//                   </select>
//                 </td>
//                 <td className="px-4 py-2 text-center">
//                   <input
//                     type="checkbox"
//                     name="is_available"
//                     checked={formData.is_available}
//                     onChange={handleInputChange}
//                     className="scale-125"
//                   />
//                 </td>
//                 <td className="px-4 py-2 text-center">
//                   <input
//                     type="checkbox"
//                     name="show_price"
//                     checked={formData.show_price}
//                     onChange={handleInputChange}
//                     className="scale-125"
//                   />
//                 </td>
//                 <td className="px-4 py-2">
//                   <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={handleAddService}>Save</button>
//                   <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={handleCancel}>Cancel</button>
//                 </td>
//               </tr>
//             )}

//             {/* EXISTING */}
//             {services.map((service) => (
//               <tr key={service.service_id} className="hover:bg-gray-50">
//                 {['service_name', 'service_description'].map((field) => (
//                   <td className="px-4 py-2" key={field}>
//                     {editingId === service.service_id ? (
//                       <input
//                         type="text"
//                         name={field}
//                         value={formData[field]}
//                         onChange={handleInputChange}
//                         className="w-full border rounded p-2"
//                       />
//                     ) : (
//                       service[field] ?? ''
//                     )}
//                   </td>
//                 ))}
//                 <td className="px-4 py-2">
//                   {editingId === service.service_id ? (
//                     <input
//                       type="number"
//                       name="price"
//                       value={formData.price}
//                       onChange={handleInputChange}
//                       className="w-full border rounded p-2"
//                     />
//                   ) : (
//                     service.price ?? 0
//                   )}
//                 </td>
//                 <td className="px-4 py-2">
//                   {editingId === service.service_id ? (
//                     <select
//                       name="duration_minutes"
//                       value={String(formData.duration_minutes)}
//                       onChange={handleInputChange}
//                       className="w-full border rounded p-2"
//                     >
//                       {DURATION_OPTIONS.map((min) => (
//                         <option key={min} value={String(min)}>
//                           {min} mins
//                         </option>
//                       ))}
//                     </select>
//                   ) : (
//                     `${service.duration_minutes ?? 0} mins`
//                   )}
//                 </td>

//                 <td className="px-4 py-2">{editingId === service.service_id ? (
//                   <select
//                     name="service_category"
//                     value={formData.service_category}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2"
//                   >
//                     <option value="unisex">Unisex</option>
//                     <option value="men">Men</option>
//                     <option value="women">Women</option>
//                   </select>
//                 ) : (
//                   service.service_category ?? ''
//                 )}
//                 </td>
//                 <td className="px-4 py-2 text-center">
//                   {editingId === service.service_id ? (
//                     <input
//                       type="checkbox"
//                       name="is_available"
//                       checked={formData.is_available}
//                       onChange={handleInputChange}
//                       className="scale-125"
//                     />
//                   ) : (
//                     service.is_available ? 'Yes' : 'No'
//                   )}
//                 </td>
//                 <td className="px-4 py-2 text-center">
//                   {editingId === service.service_id ? (
//                     <input
//                       type="checkbox"
//                       name="show_price"
//                       checked={formData.show_price}
//                       onChange={handleInputChange}
//                       className="scale-125"
//                     />
//                   ) : (
//                     service.show_price ? 'Yes' : 'No'
//                   )}
//                 </td>
//                 <td className="px-4 py-2">
//                   {editingId === service.service_id ? (
//                     <>
//                       <button className="bg-green-500 text-white px-2 py-1 rounded mr-2"
//                         onClick={() => handleUpdateService(service.service_id)}>Save</button>
//                       <button className="bg-red-500 text-white px-2 py-1 rounded"
//                         onClick={handleCancel}>Cancel</button>
//                     </>
//                   ) : (
//                     <button
//                       className="bg-blue-500 text-white px-2 py-1 rounded"
//                       onClick={() => handleEditClick(service)}
//                       disabled={isAdding}
//                     >
//                       Edit
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}

//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ServiceManagement;


import { useState, useEffect } from 'react';
import { ProtectedAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const DURATION_OPTIONS = Array.from({ length: 16 }, (_, i) => (i + 1) * 15);

  const [formData, setFormData] = useState({
    service_name: '',
    service_description: '',
    service_image_link: '',
    price: 0,
    duration_minutes: 30,
    is_available: true,
    service_category: 'unisex',
    show_price: false
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await ProtectedAPI.get('/salon-admin/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      service_name: '',
      service_description: '',
      service_image_link: '',
      price: 0,
      duration_minutes: 30,
      is_available: true,
      service_category: 'unisex',
      show_price: false
    });
  };

  const handleAddNewClick = () => {
    setIsAdding(true);
    setEditingId(null);
    resetForm();
  };

  const handleEditClick = (service) => {
    setIsAdding(false);
    setEditingId(service.service_id);
    setFormData({
      ...service,
      price: service?.price ?? 0,
      duration_minutes: service?.duration_minutes ?? 0
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddService = async () => {
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration_minutes: Number(formData.duration_minutes)
      };
      await ProtectedAPI.post('/salon-admin/services', payload);
      await fetchServices();
      setIsAdding(false);
      alert('Service added successfully!');
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service');
    }
  };

  const handleUpdateService = async (serviceId) => {
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration_minutes: Number(formData.duration_minutes)
      };
      await ProtectedAPI.put(`/salon-admin/services/${serviceId}`, payload);
      await fetchServices();
      setEditingId(null);
      alert('Service updated successfully!');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service');
    }
  };

  if (loading) return <LoadingSpinner message="Loading services..." />;

  return (
    <div className="max-w-7xl mx-auto p-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold">Service Management</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400 text-sm sm:text-base"
          onClick={handleAddNewClick}
          disabled={isAdding || editingId !== null}
        >
          Add New Service
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-center">Available</th>
              <th className="px-4 py-2 text-center">Show Price</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Add Row */}
            {isAdding && (
              <tr className="bg-green-50">
                <td className="px-4 py-2">
                  <input name="service_name" value={formData.service_name} onChange={handleInputChange} className="w-full border rounded p-2" />
                </td>
                <td className="px-4 py-2">
                  <input name="service_description" value={formData.service_description} onChange={handleInputChange} className="w-full border rounded p-2" />
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border rounded p-2" />
                </td>
                <td className="px-4 py-2">
                  <select name="duration_minutes" value={formData.duration_minutes} onChange={handleInputChange} className="w-full border rounded p-2">
                    {DURATION_OPTIONS.map((min) => (
                      <option key={min} value={min}>{min} mins</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select name="service_category" value={formData.service_category} onChange={handleInputChange} className="w-full border rounded p-2">
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-center">
                  <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleInputChange} className="scale-125" />
                </td>
                <td className="px-4 py-2 text-center">
                  <input type="checkbox" name="show_price" checked={formData.show_price} onChange={handleInputChange} className="scale-125" />
                </td>
                <td className="px-4 py-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={handleAddService}>Save</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={handleCancel}>Cancel</button>
                </td>
              </tr>
            )}

            {/* Existing Rows */}
            {services.map((service) => (
              <tr key={service.service_id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  {editingId === service.service_id ? (
                    <input name="service_name" value={formData.service_name} onChange={handleInputChange} className="w-full border rounded p-2" />
                  ) : service.service_name}
                </td>
                <td className="px-4 py-2">
                  {editingId === service.service_id ? (
                    <input name="service_description" value={formData.service_description} onChange={handleInputChange} className="w-full border rounded p-2" />
                  ) : service.service_description}
                </td>
                <td className="px-4 py-2">
                  {editingId === service.service_id ? (
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border rounded p-2" />
                  ) : service.price}
                </td>
                <td className="px-4 py-2">
                  {editingId === service.service_id ? (
                    <select name="duration_minutes" value={formData.duration_minutes} onChange={handleInputChange} className="w-full border rounded p-2">
                      {DURATION_OPTIONS.map((min) => (
                        <option key={min} value={min}>{min} mins</option>
                      ))}
                    </select>
                  ) : `${service.duration_minutes} mins`}
                </td>
                <td className="px-4 py-2">
                  {editingId === service.service_id ? (
                    <select name="service_category" value={formData.service_category} onChange={handleInputChange} className="w-full border rounded p-2">
                      <option value="unisex">Unisex</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                    </select>
                  ) : service.service_category}
                </td>
                <td className="px-4 py-2 text-center">
                  {editingId === service.service_id ? (
                    <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleInputChange} className="scale-125" />
                  ) : service.is_available ? 'Yes' : 'No'}
                </td>
                <td className="px-4 py-2 text-center">
                  {editingId === service.service_id ? (
                    <input type="checkbox" name="show_price" checked={formData.show_price} onChange={handleInputChange} className="scale-125" />
                  ) : service.show_price ? 'Yes' : 'No'}
                </td>
                <td className="px-4 py-2">
                  {editingId === service.service_id ? (
                    <>
                      <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleUpdateService(service.service_id)}>Save</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEditClick(service)} disabled={isAdding}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 sm:hidden">
        {isAdding && (
          <div className="border rounded-lg p-4 bg-green-50">
            <input name="service_name" placeholder="Name" value={formData.service_name} onChange={handleInputChange} className="w-full border rounded p-2 mb-2" />
            <input name="service_description" placeholder="Description" value={formData.service_description} onChange={handleInputChange} className="w-full border rounded p-2 mb-2" />
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} className="w-full border rounded p-2 mb-2" />
            <select name="duration_minutes" value={formData.duration_minutes} onChange={handleInputChange} className="w-full border rounded p-2 mb-2">
              {DURATION_OPTIONS.map((min) => (
                <option key={min} value={min}>{min} mins</option>
              ))}
            </select>
            <select name="service_category" value={formData.service_category} onChange={handleInputChange} className="w-full border rounded p-2 mb-2">
              <option value="unisex">Unisex</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
            <div className="flex gap-3 mb-3">
              <label><input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleInputChange}/> Available</label>
              <label><input type="checkbox" name="show_price" checked={formData.show_price} onChange={handleInputChange}/> Show Price</label>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleAddService}>Save</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        )}

        {services.map((service) => (
          <div key={service.service_id} className="border rounded-lg p-4 shadow-sm bg-white">
            {editingId === service.service_id ? (
              <>
                <input name="service_name" value={formData.service_name} onChange={handleInputChange} className="w-full border rounded p-2 mb-2" />
                <input name="service_description" value={formData.service_description} onChange={handleInputChange} className="w-full border rounded p-2 mb-2" />
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border rounded p-2 mb-2" />
                <select name="duration_minutes" value={formData.duration_minutes} onChange={handleInputChange} className="w-full border rounded p-2 mb-2">
                  {DURATION_OPTIONS.map((min) => (
                    <option key={min} value={min}>{min} mins</option>
                  ))}
                </select>
                <select name="service_category" value={formData.service_category} onChange={handleInputChange} className="w-full border rounded p-2 mb-2">
                  <option value="unisex">Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
                <div className="flex gap-3 mb-3">
                  <label><input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleInputChange}/> Available</label>
                  <label><input type="checkbox" name="show_price" checked={formData.show_price} onChange={handleInputChange}/> Show Price</label>
                </div>
                <div className="flex gap-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleUpdateService(service.service_id)}>Save</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{service.service_name}</h3>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs" onClick={() => handleEditClick(service)}>Edit</button>
                </div>
                <p className="text-gray-600 text-sm mt-1">{service.service_description}</p>
                <div className="mt-2 text-sm space-y-1">
                  <p><span className="font-medium">Price:</span> Rs. {service.price}</p>
                  <p><span className="font-medium">Duration:</span> {service.duration_minutes} mins</p>
                  <p><span className="font-medium">Category:</span> {service.service_category}</p>
                  <p><span className="font-medium">Available:</span> {service.is_available ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Show Price:</span> {service.show_price ? 'Yes' : 'No'}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceManagement;
