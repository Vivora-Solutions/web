import { Edit, Settings, Users } from "lucide-react";

const WorkstationCard = ({
  station,
  stationServices,
  onEdit,
  onManageServices,
}) => {
  return (
    <div className="relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-xl"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-800">
            {station.workstation_name}
          </h4>
          <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
            <Users size={14} />
            <span>
              {stationServices.length} service
              {stationServices.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(station)}
            className="w-8 h-8 bg-blue-100 text-blue-500 rounded-md flex items-center justify-center hover:bg-blue-200"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onManageServices(station)}
            className="w-8 h-8 bg-gray-100 text-gray-600 rounded-md flex items-center justify-center hover:bg-purple-200"
            title="Manage Services"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-slate-700">
          Available Services:
        </h5>
        {stationServices.length > 0 ? (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {stationServices.map((serviceData) => (
              <div
                key={serviceData.service.service_id}
                className="bg-slate-50 rounded-lg p-3 text-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="font-medium text-slate-800">
                      {serviceData.service.service_name}
                    </h6>
                    <p className="text-slate-500 text-xs mt-1">
                      Rs. {serviceData.service.price} •{" "}
                      {serviceData.service.duration_minutes} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400">
            <Settings size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No services assigned</p>
            <button
              onClick={() => onManageServices(station)}
              className="text-gray-600 hover:text-purple-600 text-xs mt-1"
            >
              Add services
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkstationCard;
