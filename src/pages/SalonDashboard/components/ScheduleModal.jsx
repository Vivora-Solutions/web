import { useState } from "react";
import { X, Save, PlusCircle } from "lucide-react";
import { ProtectedAPI } from "../../../utils/api";

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const ScheduleModal = ({ stylist, onClose }) => {
  const existingScheduleList = Array.isArray(stylist.schedule) ? stylist.schedule : [];

  const schedulesMapped = daysOfWeek.map((day, index) => {
    const existing = existingScheduleList.find(
      (s) => Number(s.day_of_week) === Number(index)
    );

    return existing
      ? {
          ...existing,                             // keeps _id, schedule_id, etc
          day_of_week: index,                      // numeric value (0–6)
          day_name: day,                           // readable value for UI only
          start_time_daily: existing.start_time_daily?.slice(0, 5),
          end_time_daily: existing.end_time_daily?.slice(0, 5),
        }
      : {
          day_of_week: index,
          day_name: day,
          start_time_daily: "",
          end_time_daily: "",
        };
  });


  const [schedules, setSchedules] = useState(schedulesMapped);


  const [saving, setSaving] = useState(false);

  const handleInputChange = (index, field, value) => {
    setSchedules((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async (schedule) => {
    console.log("Saving schedule:", schedule);
    try {
      setSaving(true);
      //console.log("Saving schedule:", schedule);
      if (schedule.schedule_id) {
        await ProtectedAPI.put(`/salon-admin/schedule/stylists/${stylist.stylist_id}/${schedule.schedule_id}`, schedule);
      } else {
        console.log("Creating new schedule for stylist:", stylist.stylist_id);
      //       await ProtectedAPI.post(`/salon-admin/schedule/stylists/${stylist.stylist_id}`, {
      // stylist_id: stylist.stylist_id,
      // day_of_week: daysOfWeek.indexOf(schedule.day_of_week), // convert string to index
      // start_time_daily: schedule.start_time_daily,
      // end_time_daily: schedule.end_time_daily,
    //});

      }
      alert(`Schedule for ${schedule.day_of_week} saved!`);
    } catch (error) {
      console.error("Saving schedule:", schedule);
      console.error("Failed to save schedule", error);
      alert("Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  const handleBatchSetDefault = async () => {
    try {
      setSaving(true);
      const defaultStartTime = "09:00";
      const defaultEndTime = "17:00";

      const updates = schedules.map(async (s) => {
        if (!s.schedule_id) {
          return ProtectedAPI.post(`/salon-admin/schedule/stylists/${stylist.stylist_id}`, {
            stylist_id: stylist.stylist_id,
            day_of_week: daysOfWeek.indexOf(s.day_of_week),
            start_time_daily: defaultStartTime,
            end_time_daily: defaultEndTime,
          });
        }
        return null;
      });

      await Promise.all(updates);

      setSchedules((prev) =>
        prev.map((s) => ({
          ...s,
          start_time_daily: s.start_time_daily || defaultStartTime,
          end_time_daily: s.end_time_daily || defaultEndTime,
        }))
      );

      alert("Default weekly schedule set!");
    } catch (error) {
      console.error("Batch set failed", error);
      alert("Failed to batch set schedules");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Manage Schedules for {stylist.stylist_name}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {schedules.map((schedule, index) => (
            <div key={schedule.day_of_week} className="flex items-center gap-4">
              <span className="w-24 font-medium">{schedule.day_of_week}</span>
              <input
                type="time"
                className="border rounded px-2 py-1"
                value={schedule.start_time_daily}
                onChange={(e) => handleInputChange(index, "start_time_daily", e.target.value)}
              />
              <span>to</span>
              <input
                type="time"
                className="border rounded px-2 py-1"
                value={schedule.end_time_daily}
                onChange={(e) => handleInputChange(index, "end_time_daily", e.target.value)}
              />
              <button
                className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
                onClick={() => handleSave(schedule)}
                disabled={saving}
              >
                <Save size={16} /> Save
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition"
            onClick={handleBatchSetDefault}
            disabled={saving}
          >
            <PlusCircle size={18} /> Set Default Weekly Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
