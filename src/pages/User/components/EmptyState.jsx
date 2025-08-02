const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
      <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No salons found</h3>
    <p className="text-gray-500 max-w-sm mx-auto">
      We couldn't find any salons matching your search. Try adjusting your search terms or browse all available salons.
    </p>
  </div>
)

export default EmptyState
