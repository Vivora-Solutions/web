import { Clock, Save, X } from "lucide-react"

export default function AddEditAppointmentPanel({
  showAddAppointmentPanel,
  setShowAddAppointmentPanel,
  isEditingAppointment,
  newAppointment,
  setNewAppointment,
  stylists,
  services,
  availableTimeSlots,
  setAvailableTimeSlots,
  loading,
  handleSaveAppointment,
  handleCheckAvailability,
  COLORS,
}) {
  if (!showAddAppointmentPanel) return null

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: COLORS.overlay,
          backdropFilter: "blur(8px)",
          zIndex: 50,
        }}
        onClick={() => setShowAddAppointmentPanel(false)}
      />
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          width: "500px",
          background: COLORS.cardBg,
          boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.2)",
          zIndex: 51,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "28px 32px",
            borderBottom: `2px solid ${COLORS.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `linear-gradient(135deg, ${COLORS.success}, #38a169)`,
            color: "white",
          }}
        >
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", margin: 0, marginBottom: "4px" }}>
              {isEditingAppointment ? "Edit Appointment" : "New Appointment"}
            </h2>
            <p style={{ fontSize: "14px", opacity: 0.9, margin: 0 }}>
              {isEditingAppointment ? "Update appointment details" : "Schedule a new appointment"}
            </p>
          </div>
          <button
            onClick={() => setShowAddAppointmentPanel(false)}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              fontSize: "24px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Main Content */}
                 <div style={{ padding: "32px" }}>
                   {/* Client Information */}
                   <div style={{ marginBottom: "24px" }}>
                     <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>
                       Client Information
                     </h3>
                     <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                       <div>
                         <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                           Client Name *
                         </label>
                         <input
                           type="text"
                           value={newAppointment.clientName}
                           onChange={(e) => setNewAppointment({ ...newAppointment, clientName: e.target.value })}
                           placeholder="Enter client name"
                           disabled={isEditingAppointment}
                           style={{
                             width: "100%",
                             padding: "12px 16px",
                             border: `2px solid ${COLORS.border}`,
                             borderRadius: "8px",
                             fontSize: "14px",
                             fontFamily: "inherit",
                             outline: "none",
                             transition: "border-color 0.2s ease",
                             backgroundColor: isEditingAppointment ? "#f5f5f5" : "white",
                             cursor: isEditingAppointment ? "not-allowed" : "text",
                           }}
                           onFocus={(e) => !isEditingAppointment && (e.target.style.borderColor = COLORS.info)}
                           onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                         />
                       </div>
                       <div>
                         <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                           Phone Number
                         </label>
                         <input
                           type="tel"
                           value={newAppointment.clientPhone}
                           onChange={(e) => setNewAppointment({ ...newAppointment, clientPhone: e.target.value })}
                           placeholder="Enter phone number"
                           disabled={isEditingAppointment}
                           style={{
                             width: "100%",
                             padding: "12px 16px",
                             border: `2px solid ${COLORS.border}`,
                             borderRadius: "8px",
                             fontSize: "14px",
                             fontFamily: "inherit",
                             outline: "none",
                             transition: "border-color 0.2s ease",
                             backgroundColor: isEditingAppointment ? "#f5f5f5" : "white",
                             cursor: isEditingAppointment ? "not-allowed" : "text",
                           }}
                           onFocus={(e) => !isEditingAppointment && (e.target.style.borderColor = COLORS.info)}
                           onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                         />
                       </div>
                       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                         <input
                           type="checkbox"
                           id="walkIn"
                           checked={newAppointment.isWalkIn}
                           onChange={(e) => setNewAppointment({ ...newAppointment, isWalkIn: e.target.checked })}
                           disabled={isEditingAppointment}
                           style={{
                             accentColor: COLORS.info,
                             transform: "scale(1.2)",
                             cursor: isEditingAppointment ? "not-allowed" : "pointer",
                           }}
                         />
                         <label
                           htmlFor="walkIn"
                           style={{
                             fontWeight: "600",
                             color: isEditingAppointment ? COLORS.textLight : COLORS.text,
                             cursor: isEditingAppointment ? "not-allowed" : "pointer",
                           }}
                         >
                           Walk-in Customer
                         </label>
                       </div>
                     </div>
                   </div>
   
                   {/* Appointment Details */}
                   <div style={{ marginBottom: "24px" }}>
                     <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>
                       Appointment Details
                     </h3>
                     <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                       <div>
                         <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                           Stylist *
                         </label>
                         <select
                           value={newAppointment.stylistId}
                           onChange={(e) => {
                             // setNewAppointment({ ...newAppointment, stylistId: e.target.value })
                             newAppointment.stylistId = e.target.value
                             setAvailableTimeSlots([]) // Reset available slots when stylist changes
                             console.log(`Selected stylist: ${newAppointment.stylistId}`)
                           }}
                           style={{
                             width: "100%",
                             padding: "12px 16px",
                             border: `2px solid ${COLORS.border}`,
                             borderRadius: "8px",
                             fontSize: "14px",
                             fontFamily: "inherit",
                             outline: "none",
                             transition: "border-color 0.2s ease",
                             backgroundColor: "white",
                           }}
                           onFocus={(e) => (e.target.style.borderColor = COLORS.info)}
                           onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                         >
                           <option value="">Select a stylist</option>
                           {stylists
                             .filter((s) => s.isActive)
                             .map((stylist) => (
                               <option key={stylist.id} value={stylist.id}>
                                 {stylist.name}
                               </option>
                             ))}
                         </select>
                       </div>
                       <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                         <div>
                           <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                             Date *
                           </label>
                           <input
                             type="date"
                             value={newAppointment.date}
                             onChange={(e) => {
                               setNewAppointment({ ...newAppointment, date: e.target.value })
                               setAvailableTimeSlots([]) // Reset available slots when date changes
                             }}
                             style={{
                               width: "100%",
                               padding: "12px 16px",
                               border: `2px solid ${COLORS.border}`,
                               borderRadius: "8px",
                               fontSize: "14px",
                               fontFamily: "inherit",
                               outline: "none",
                               transition: "border-color 0.2s ease",
                             }}
                             onFocus={(e) => (e.target.style.borderColor = COLORS.info)}
                             onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                           />
                         </div>
                       </div>
   
                       {/* Available Time Slots - Only show after checking availability */}
                       {availableTimeSlots.length > 0 && (
                         <div>
                           <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                             Available Time Slots *
                           </label>
                           <select
                             value={newAppointment.startTime && newAppointment.endTime ? `${newAppointment.startTime}|${newAppointment.endTime}` : ""}
                             onChange={(e) => {
                               const [startTime, endTime] = e.target.value.split('|')
                               setNewAppointment({
                                 ...newAppointment,
                                 startTime,
                                 endTime
                               })
                               console.log(`Selected time slot: ${startTime} - ${endTime}`)
                             }}
                             style={{
                               width: "100%",
                               padding: "12px 16px",
                               border: `2px solid ${COLORS.border}`,
                               borderRadius: "8px",
                               fontSize: "14px",
                               fontFamily: "inherit",
                               outline: "none",
                               transition: "border-color 0.2s ease",
                               backgroundColor: "white",
                             }}
                             onFocus={(e) => (e.target.style.borderColor = COLORS.info)}
                             onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                           >
                             <option value="">Select available time slot</option>
                             {availableTimeSlots.map((slot, index) => {
                               return (
                                 <option key={index} value={`${slot.startTime}|${slot.endTime}`}>
                                   {slot.startTime.split('T')[1].split(":").slice(0, 2).join(":")} - {slot.endTime.split('T')[1].split(":").slice(0, 2).join(":")}
                                 </option>
                               )
                             })}
                           </select>
                         </div>
                       )}
   
                       {/* Manual Time Input - Only show if no available slots checked yet */}
                       {availableTimeSlots.length === 0 && (
                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                           <div>
                             <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                               Start Time *
                             </label>
                             <input
                               type="time"
                               value={newAppointment.startTime}
                               onChange={(e) => setNewAppointment({ ...newAppointment, startTime: e.target.value })}
                               disabled={true}
                               style={{
                                 width: "100%",
                                 padding: "12px 16px",
                                 border: `2px solid ${COLORS.border}`,
                                 borderRadius: "8px",
                                 fontSize: "14px",
                                 fontFamily: "inherit",
                                 outline: "none",
                                 transition: "border-color 0.2s ease",
                                 backgroundColor: "#f5f5f5",
                                 cursor: "not-allowed",
                               }}
                             />
                           </div>
                           <div>
                             <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                               End Time *
                             </label>
                             <input
                               type="time"
                               value={newAppointment.endTime}
                               onChange={(e) => setNewAppointment({ ...newAppointment, endTime: e.target.value })}
                               disabled={true}
                               style={{
                                 width: "100%",
                                 padding: "12px 16px",
                                 border: `2px solid ${COLORS.border}`,
                                 borderRadius: "8px",
                                 fontSize: "14px",
                                 fontFamily: "inherit",
                                 outline: "none",
                                 transition: "border-color 0.2s ease",
                                 backgroundColor: "#f5f5f5",
                                 cursor: "not-allowed",
                               }}
                             />
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
   
                   {/* Services */}
                   <div style={{ marginBottom: "24px" }}>
                     <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>
                       Services *
                     </h3>
                     <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                       {services.map((service) => (
                         <div
                           key={service.id}
                           style={{
                             display: "flex",
                             alignItems: "center",
                             padding: "12px 16px",
                             border: `2px solid ${newAppointment.services.includes(service.id) ? COLORS.info : COLORS.border}`,
                             borderRadius: "8px",
                             cursor: isEditingAppointment ? "not-allowed" : "pointer",
                             transition: "all 0.2s ease",
                             background: newAppointment.services.includes(service.id)
                               ? "rgba(66, 153, 225, 0.1)"
                               : isEditingAppointment
                                 ? "#f5f5f5"
                                 : "white",
                             opacity: isEditingAppointment ? 0.7 : 1,
                           }}
                           onClick={() => {
                             if (!isEditingAppointment) {
                               const updatedServices = newAppointment.services.includes(service.id)
                                 ? newAppointment.services.filter((id) => id !== service.id)
                                 : [...newAppointment.services, service.id]
                               setNewAppointment({ ...newAppointment, services: updatedServices })
                               setAvailableTimeSlots([]) // Reset available slots when services change
                             }
                           }}
                         >
                           <input
                             type="checkbox"
                             checked={newAppointment.services.includes(service.id)}
                             disabled={isEditingAppointment}
                             onChange={() => { }}
                             style={{
                               marginRight: "12px",
                               accentColor: COLORS.info,
                               transform: "scale(1.2)",
                               cursor: isEditingAppointment ? "not-allowed" : "pointer",
                             }}
                           />
                           <div style={{ flex: 1 }}>
                             <div style={{
                               fontWeight: "600",
                               color: isEditingAppointment ? COLORS.textLight : COLORS.text,
                               marginBottom: "4px"
                             }}>
                               {service.name}
                             </div>
                             <div style={{ fontSize: "12px", color: COLORS.textLight }}>
                               {service.duration} min • ${service.price}
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
   
                   {/* Notes */}
                   <div style={{ marginBottom: "32px" }}>
                     <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                       Notes
                     </label>
                     <textarea
                       value={newAppointment.notes}
                       onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                       placeholder="Add any special notes or requirements..."
                       rows={3}
                       disabled={isEditingAppointment}
                       style={{
                         width: "100%",
                         padding: "12px 16px",
                         border: `2px solid ${COLORS.border}`,
                         borderRadius: "8px",
                         fontSize: "14px",
                         fontFamily: "inherit",
                         outline: "none",
                         transition: "border-color 0.2s ease",
                         resize: "vertical",
                         backgroundColor: isEditingAppointment ? "#f5f5f5" : "white",
                         cursor: isEditingAppointment ? "not-allowed" : "text",
                       }}
                       onFocus={(e) => !isEditingAppointment && (e.target.style.borderColor = COLORS.info)}
                       onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                     />
                   </div>
   
                   {/* Action Buttons */}
                   <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                     {/* Check Availability Button - Show when required fields filled but no time slots available */}
                     {newAppointment.stylistId &&
                       newAppointment.date &&
                       newAppointment.services.length > 0 &&
                       availableTimeSlots.length === 0 && (
                         <button
                           onClick={handleCheckAvailability}
                           disabled={loading}
                           style={{
                             width: "100%",
                             padding: "14px 20px",
                             background: loading ? COLORS.textLight : `linear-gradient(135deg, ${COLORS.info}, #3182ce)`,
                             color: "white",
                             border: "none",
                             borderRadius: "8px",
                             fontWeight: "700",
                             cursor: loading ? "not-allowed" : "pointer",
                             transition: "all 0.2s ease",
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "center",
                             gap: "8px",
                           }}
                         >
                           <Clock size={16} />
                           {loading ? "Checking..." : "Check Availability"}
                         </button>
                       )}
   
                     {/* Create/Update Buttons - Show when time slot is selected or no availability check needed */}
                     {(availableTimeSlots.length > 0 && newAppointment.startTime && newAppointment.endTime) ||
                       (!newAppointment.stylistId || !newAppointment.date || newAppointment.services.length === 0) ? (
                       <div style={{ display: "flex", gap: "12px" }}>
                         <button
                           onClick={() => setShowAddAppointmentPanel(false)}
                           style={{
                             flex: 1,
                             padding: "14px 20px",
                             background: "transparent",
                             border: `2px solid ${COLORS.border}`,
                             color: COLORS.text,
                             borderRadius: "8px",
                             fontWeight: "600",
                             cursor: "pointer",
                             transition: "all 0.2s ease",
                           }}
                         >
                           Cancel
                         </button>
                         <button
                           onClick={handleSaveAppointment}
                           disabled={loading || !newAppointment.clientName || !newAppointment.stylistId ||
                             !newAppointment.date || !newAppointment.startTime || !newAppointment.endTime ||
                             newAppointment.services.length === 0}
                           style={{
                             flex: 2,
                             padding: "14px 20px",
                             background: loading || !newAppointment.clientName || !newAppointment.stylistId ||
                               !newAppointment.date || !newAppointment.startTime || !newAppointment.endTime ||
                               newAppointment.services.length === 0
                               ? COLORS.textLight
                               : `linear-gradient(135deg, ${COLORS.success}, #38a169)`,
                             color: "white",
                             border: "none",
                             borderRadius: "8px",
                             fontWeight: "700",
                             cursor: loading || !newAppointment.clientName || !newAppointment.stylistId ||
                               !newAppointment.date || !newAppointment.startTime || !newAppointment.endTime ||
                               newAppointment.services.length === 0
                               ? "not-allowed"
                               : "pointer",
                             transition: "all 0.2s ease",
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "center",
                             gap: "8px",
                           }}
                         >
                           <Save size={16} />
                           {loading ? "Saving..." : isEditingAppointment ? "Update Appointment" : "Create Appointment"}
                         </button>
                       </div>
                     ) : (
                       <button
                         onClick={() => setShowAddAppointmentPanel(false)}
                         style={{
                           width: "100%",
                           padding: "14px 20px",
                           background: "transparent",
                           border: `2px solid ${COLORS.border}`,
                           color: COLORS.text,
                           borderRadius: "8px",
                           fontWeight: "600",
                           cursor: "pointer",
                           transition: "all 0.2s ease",
                         }}
                       >
                         Cancel
                       </button>
                     )}
                   </div>
                 </div>
      </div>
    </>
  )
}
