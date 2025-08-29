// services/apiService.js
import { ProtectedAPI } from "../../../../../utils/api";

export const ApiService = {
  // Stylists
  async getStylists() {
    const stylists = await ProtectedAPI.get('/salon-admin/schedule/stylists');
    return stylists.data.data;
  },

  async updateStylistSchedule(stylistId, schedule) {
    return await ProtectedAPI.put(`/salon-admin/schedule/stylists/${stylistId}/${schedule.id}`, schedule);
  },

  // Appointments
  async getAppointments(startDate, endDate) {
    const response = await ProtectedAPI.get(`/salon-admin/booking`);
    console.log("Appointments fetched:", response.data);
    return response.data;
  },

  async createAppointment(appointment) {
    const apiData = {
      stylist_id: appointment.stylistId,
      booking_start_datetime: appointment.startTime,
      booking_end_datetime: appointment.endTime,
      booked_mode: appointment.isWalkIn ? "walking" : "online",
      service_ids: appointment.services,
      notes: appointment.notes || "",
      non_online_customer_name: appointment.clientName,
      non_online_customer_mobile_number: appointment.clientPhone,
    };
    const response = await ProtectedAPI.post('/salon-admin/booking', apiData);
    return response.data;
  },

  async updateAppointment(appointmentId, appointment) {
    const apiData = {
      stylist_id: appointment.stylistId,
      booking_start_datetime: appointment.startTime,
      booking_end_datetime: appointment.endTime,
      notes: appointment.notes || "",
    };
    const response = await ProtectedAPI.put(`/salon-admin/booking/${appointmentId}`, apiData);
    return response.data;
  },

  async deleteAppointment(appointmentId) {
    const response = await ProtectedAPI.delete(`/salon-admin/bookings/${appointmentId}`);
    return response.data;
  },

  async completeAppointment(appointmentId) {
    const response = await ProtectedAPI.put(`/salon-admin/bookings/c/${appointmentId}`);
    return response.data;
  },

  // Services
  async getServices() {
    const response = await ProtectedAPI.get('/salon-admin/services');
    return response.data;
  },

  // Leaves
  async getLeaves(startDate, endDate) {
    const response = await ProtectedAPI.get(`/salon-admin/schedule/leaves`);
    return response.data.data;
  },

  async createLeave(leave) {
    const response = await ProtectedAPI.post(`/salon-admin/schedule/stylists/${leave.stylist_id}/leave`, leave);
    return response.data;
  },

  async deleteLeave(leaveData) {
    const response = await ProtectedAPI.delete(`/salon-admin/schedule/stylists/${leaveData.stylist_id}/leave/${leaveData.leave_id}`);
    return response.data;
  },

  // Salon Opening Hours
  async getOpeningHours() {
    const response = await ProtectedAPI.get('/salon-admin/opening-hours');
    return response.data;
  },
};
