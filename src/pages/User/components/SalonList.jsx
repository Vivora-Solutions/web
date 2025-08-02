import SalonCard from "./SalonCard"
import LoadingSpinner from "./LoadingSpinner"
import EmptyState from "./EmptyState"

const SalonList = ({ filteredSalons, isLoading, onSalonClick, onSalonHover }) => {
  return (
    <div className="lg:w-1/2 bg-gradient-to-br from-gray-50 to-white">
      <div className="p-6 lg:p-8 h-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Available Salons
            </h2>
            <p className="text-gray-600 mt-1">Choose from our curated selection</p>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2">
            <span className="text-sm font-semibold text-purple-700">{filteredSalons.length} results</span>
          </div>
        </div>

        <div className="h-full overflow-y-auto space-y-4 pb-20" style={{ maxHeight: "calc(100vh - 300px)" }}>
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredSalons.length === 0 ? (
            <EmptyState />
          ) : (
            filteredSalons.map((salon, index) => (
              <SalonCard
                key={salon.salon_id}
                salon={salon}
                index={index}
                onSalonClick={onSalonClick}
                onSalonHover={onSalonHover}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SalonList
