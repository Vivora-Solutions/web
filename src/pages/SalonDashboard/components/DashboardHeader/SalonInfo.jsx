"use client"

import { useEffect, useState } from "react"
import EditableField from "./EditableField"
import API from "../../../../utils/api"

const SalonInfo = () => {
  const [salon, setSalon] = useState(null)
  const [formData, setFormData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalon = async () => {
      setLoading(true)
      try {
        const res = await API.get("/salon-admin/my")
        setSalon(res.data)
        setFormData(res.data)
      } catch (err) {
        console.error("Failed to fetch salon info:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSalon()
  }, [])

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleUpdate = async () => {
    try {
      const payload = {
        salon_id: formData.salon_id,
        salon_name: formData.salon_name,
        salon_description: formData.salon_description,
        salon_address: formData.salon_address,
        salon_contact_number: formData.salon_contact_number,
        salon_logo_link: formData.salon_logo_link,
      }
      await API.put("/salon-admin/update", payload)
      setSalon((prev) => ({ ...prev, ...payload }))
      setIsEditing(false)
      alert("Salon updated successfully!")
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message)
      alert("Failed to update salon")
    }
  }

  const handleLogoUpload = async (base64Image) => {
    const updated = { ...formData, salon_logo_link: base64Image }
    setFormData(updated)
    await handleUpdate(updated)
  }

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading salon information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="mx-auto p-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">Salon Management</h1>
                <p className="text-indigo-100 text-lg">Manage your salon's public profile and information</p>
              </div>
              <div className="flex gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="group px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg
                      className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-slate-500 text-white rounded-xl font-semibold shadow-lg hover:bg-slate-600 transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="group px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:bg-emerald-600 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                    >
                      <svg
                        className="h-5 w-5 group-hover:scale-110 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="grid gap-8">
              {/* Logo Section */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div className="flex-shrink-0">
                  {formData.salon_logo_link ? (
                    <div className="relative group">
                      <img
                        src={formData.salon_logo_link || "/placeholder.svg"}
                        alt="Salon Logo"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-indigo-100"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center border-4 border-white shadow-lg">
                      <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Salon Logo</label>
                  <EditableField
                    value={formData.salon_logo_link}
                    onSave={(v) => handleChange("salon_logo_link", v)}
                    disabled={!isEditing}
                    placeholder="Paste image URL here"
                    className="text-sm text-slate-600"
                  />
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Recommended size: 200x200px, square format
                  </p>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid gap-6">
                {/* Salon Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Salon Name
                  </label>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200 group-hover:border-indigo-200 transition-colors duration-200">
                    <EditableField
                      value={formData.salon_name}
                      onSave={(v) => handleChange("salon_name", v)}
                      disabled={!isEditing}
                      className="text-xl font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Description
                  </label>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200 group-hover:border-indigo-200 transition-colors duration-200">
                    <EditableField
                      value={formData.salon_description}
                      onSave={(v) => handleChange("salon_description", v)}
                      disabled={!isEditing}
                      multiline
                      className="text-slate-700 leading-relaxed"
                    />
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Tell customers what makes your salon special
                    </p>
                  </div>
                </div>

                {/* Address and Contact Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Address */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Address
                    </label>
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200 group-hover:border-indigo-200 transition-colors duration-200">
                      <EditableField
                        value={formData.salon_address}
                        onSave={(v) => handleChange("salon_address", v)}
                        disabled={!isEditing}
                        className="text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Contact Number
                    </label>
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200 group-hover:border-indigo-200 transition-colors duration-200">
                      <EditableField
                        value={formData.salon_contact_number}
                        onSave={(v) => handleChange("salon_contact_number", v)}
                        disabled={!isEditing}
                        className="text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Profile information is automatically saved
              </div>
              <div className="text-xs text-slate-500">Last updated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalonInfo
