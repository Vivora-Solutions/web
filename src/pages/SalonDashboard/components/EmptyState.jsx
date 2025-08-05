import { User } from "lucide-react"

const EmptyState = () => {
  return (
    <div className="text-center py-12 text-gray-500">
      <User size={48} className="mx-auto mb-4 text-gray-300" />
      <p className="text-lg font-semibold text-gray-700 mb-2">No employees found</p>
      <span className="text-sm">Add your first employee to get started</span>
    </div>
  )
}

export default EmptyState
