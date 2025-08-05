"use client"

import { X } from "lucide-react"

const AddStylistModal = ({ showAddForm, formData, setFormData, loading, onClose, onSubmit, onReset }) => {
  if (!showAddForm) return null

  const handleClose = () => {
    onClose()
    onReset()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleClose} />
      <div className="fixed right-0 top-0 h-screen w-[400px] bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in">
        <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Employee</h2>
          <button onClick={handleClose} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2 text-sm">Name</label>
            <input
              type="text"
              placeholder="Enter employee name"
              value={formData.stylist_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stylist_name: e.target.value,
                }))
              }
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2 text-sm">Contact Number</label>
            <input
              type="tel"
              placeholder="Enter contact number"
              value={formData.stylist_contact_number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stylist_contact_number: e.target.value,
                }))
              }
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2 text-sm">Profile Picture URL</label>
            <input
              type="url"
              placeholder="Enter profile picture URL (optional)"
              value={formData.profile_pic_link}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  profile_pic_link: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2 text-sm">Bio</label>
            <textarea
              placeholder="Enter bio (optional)"
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </div>
      </div>
    </>
  )
}

export default AddStylistModal
