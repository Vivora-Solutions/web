import { ProtectedAPI } from "../../../../utils/api";

export const ApiService = {
  // Stylists
  async getStylists() {
    const stylists = await ProtectedAPI.get('/salon-admin/schedule/stylists');
    console.log("Fetching stylists:", stylists.data.data)
    return stylists.data.data
  },

  async updateStylistSchedule(stylistId, schedule) {
    // TODO: Replace with actual API call
    const response = await ProtectedAPI.put(`/salon-admin/schedule/stylists/${stylistId}/${schedule.id}`, schedule);
    console.log("Updating stylist schedule:", stylistId, schedule)
    return { success: true }
  },

  // Appointments
  async getAppointments(startDate, endDate) {
    // TODO: Replace with actual API call
    const response = await ProtectedAPI.get(`/salon-admin/booking`);
    console.log("Fetching appointments:", response.data)
    return response.data;
  },

  async createAppointment(appointment) {
    // Use direct string concatenation instead of Date conversion to avoid "Invalid time value"
    const startDateTime = appointment.startTime;
    const endDateTime = appointment.endTime;

    const apiData = {
      stylist_id: appointment.stylistId,
      booking_start_datetime: startDateTime,
      booking_end_datetime: endDateTime,
      booked_mode: appointment.isWalkIn ? "walking" : "online",
      service_ids: appointment.services, // Array of service IDs
      notes: appointment.notes || "",
      non_online_customer_name: appointment.clientName,
      non_online_customer_mobile_number: appointment.clientPhone,
    };

    console.log("Creating appointment with data:", apiData);

    const response = await ProtectedAPI.post('/salon-admin/booking', apiData);
    console.log("Appointment creation response:", response.data);

    return response.data;
  },

  async updateAppointment(appointmentId, appointment) {
    const startDateTime = appointment.startTime;
    const endDateTime = appointment.endTime;

    const apiData = {
      stylist_id: appointment.stylistId,
      booking_start_datetime: startDateTime,
      booking_end_datetime: endDateTime,
      notes: appointment.notes || "",
    };

    console.log("Updating appointment with data:", appointmentId, apiData);

    const response = await ProtectedAPI.put(`/salon-admin/booking/${appointmentId}`, apiData);
    console.log("Appointment update response:", response.data);

    return response.data;
  },

  async deleteAppointment(appointmentId) {
    const response = await ProtectedAPI.delete(`/salon-admin/bookings/${appointmentId}`);
    console.log("Deleting appointment:", appointmentId)
    return response.data;
  },

  async completeAppointment(appointmentId) {
    const response = await ProtectedAPI.put(`/salon-admin/bookings/c/${appointmentId}`);
    console.log("Completing appointment:", appointmentId)
    return response.data;
  },

  // Services
  async getServices() {
    const response = await ProtectedAPI.get('/salon-admin/services');
    console.log("Fetching services:", response.data)
    return response.data;
  },

  // Leaves
  async getLeaves(startDate, endDate) {
    const response = await ProtectedAPI.get(`/salon-admin/schedule/leaves`);
    console.log("Fetching leaves:", response.data.data)
    return response.data.data;
  },

  async createLeave(leave) {
    const response = await ProtectedAPI.post(`/salon-admin/schedule/stylists/${leave.stylist_id}/leave`, leave);
    console.log("Creating leave:", response.data);
    return response.data;
  },

  async deleteLeave(leaveData) {
    const response = await ProtectedAPI.delete(`/salon-admin/schedule/stylists/${leaveData.stylist_id}/leave/${leaveData.leave_id}`);
    console.log("Leave deletion response:", response.data);
    return response.data;
  },
}