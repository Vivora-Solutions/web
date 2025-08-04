import React, { useState } from 'react';
import { FaRegEdit, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import EditableField from '../../../components/EditableField/EditableField';

const ServicesEditor = () => {
  const [services, setServices] = useState([
    { name: 'Hair Cutting and Shaving', price: 1400, time: 15, category: 'men' },
    { name: 'Hair Cutting and Shaving', price: 1400, time: 15, category: 'women' },
    { name: 'Hair Cutting and Shaving', price: 1400, time: 15, category: 'unisex' },
  ]);

  const [showPrices, setShowPrices] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', time: '', category: 'unisex' });
  const [editingIndex, setEditingIndex] = useState(-1);

  const categoryOptions = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'unisex', label: 'Unisex' },
  ];

  const handleDelete = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const addNewService = () => {
    setIsAdding(true);
    setNewService({ name: '', price: '', time: '', category: 'unisex' });
  };

  const handleSaveNewService = () => {
    if (newService.name && newService.price && newService.time) {
      setServices([...services, {
        name: newService.name,
        price: parseFloat(newService.price),
        time: newService.time,
        category: newService.category,
      }]);
      setIsAdding(false);
      setNewService({ name: '', price: '', time: '', category: 'unisex' });
    }
  };

  const handleCancelNewService = () => {
    setIsAdding(false);
    setNewService({ name: '', price: '', time: '', category: 'unisex' });
  };

  const handleNewServiceChange = (field, value) => {
    setNewService((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditService = (index) => {
    setEditingIndex(index);
  };

  const handleSaveService = (index, field, value) => {
    const updated = [...services];
    updated[index] = {
      ...updated[index],
      [field]: field === 'price' ? parseFloat(value) : value,
    };
    setServices(updated);
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
  };

  const handleCategoryChange = (index, category) => {
    handleSaveService(index, 'category', category);
  };

  return (
    <div className="bg-white max-w-4xl mx-auto p-6 rounded-lg border border-gray-300 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Services</h3>
        <label className="flex items-center text-sm gap-2">
          <input
            type="checkbox"
            checked={showPrices}
            onChange={() => setShowPrices(!showPrices)}
          />
          Show Prices
        </label>
      </div>

      <table className="w-full table-auto mb-6 border-collapse">
        <thead>
          <tr className="border-b border-gray-300 text-left">
            <th className="py-2 px-2">Service</th>
            <th className="py-2 px-2">Price</th>
            <th className="py-2 px-2">Time</th>
            <th className="py-2 px-2">Category</th>
            <th className="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="pt-4">
              <button
                className="bg-transparent text-gray-600 font-medium rounded px-4 py-2 hover:bg-black hover:text-white transition disabled:opacity-50"
                onClick={addNewService}
                disabled={isAdding}
              >
                + Add Service
              </button>
            </td>
          </tr>

          {isAdding && (
            <tr className="bg-gray-100">
              <td><input type="text" placeholder="Service name" value={newService.name} onChange={(e) => handleNewServiceChange('name', e.target.value)} className="w-full px-3 py-2 border rounded text-sm" /></td>
              <td><input type="number" placeholder="Price" value={newService.price} onChange={(e) => handleNewServiceChange('price', e.target.value)} className="w-full px-3 py-2 border rounded text-sm" /></td>
              <td><input type="text" placeholder="Time in minutes" value={newService.time} onChange={(e) => handleNewServiceChange('time', e.target.value)} className="w-full px-3 py-2 border rounded text-sm" /></td>
              <td>
                <select value={newService.category} onChange={(e) => handleNewServiceChange('category', e.target.value)} className="w-full px-3 py-2 border rounded text-sm">
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </td>
              <td className="flex justify-end gap-2 py-2">
                <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700" onClick={handleSaveNewService}><FaCheck /></button>
                <button className="bg-red-600 text-white p-2 rounded hover:bg-red-700" onClick={handleCancelNewService}><FaTimes /></button>
              </td>
            </tr>
          )}

          {services.map((service, index) => (
            <tr key={index} className={`${editingIndex === index ? 'bg-gray-100' : ''}`}>
              <td>
                <EditableField
                  value={service.name}
                  onSave={(value) => handleSaveService(index, 'name', value)}
                  className={`relative text-sm ${editingIndex === index ? '' : 'pointer-events-none opacity-60'}`}
                />
              </td>
              <td>
                <EditableField
                  value={`Rs. ${service.price}`}
                  onSave={(value) => handleSaveService(index, 'price', value.replace('Rs. ', ''))}
                  className={`relative text-sm ${editingIndex === index ? '' : 'pointer-events-none opacity-60'}`}
                />
              </td>
              <td>
                <EditableField
                  value={`${service.time} minutes`}
                  onSave={(value) => handleSaveService(index, 'time', value.replace(' minutes', ''))}
                  className={`relative text-sm ${editingIndex === index ? '' : 'pointer-events-none opacity-60'}`}
                />
              </td>
              <td>
                <select
                  value={service.category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  disabled={editingIndex !== -1 && editingIndex !== index}
                  className="w-full px-3 py-2 border rounded text-sm bg-white disabled:bg-gray-100 disabled:opacity-70"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </td>
              <td className="flex justify-end gap-2">
                {editingIndex === index ? (
                  <button className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700" onClick={handleCancelEdit}><FaTimes /></button>
                ) : (
                  <>
                    <button className="bg-gray-100 p-2 rounded hover:bg-gray-200" onClick={() => handleEditService(index)}><FaRegEdit /></button>
                    <button className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200" onClick={() => handleDelete(index)}><FaTrashAlt /></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="bg-zinc-800 text-white px-6 py-2 rounded hover:bg-black transition font-medium" onClick={() => console.log("Services saved")}>Save and Update</button>
    </div>
  );
};

export default ServicesEditor;
