import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const Sidebar = ({ items, activeIndex }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && !isMobileOpen && (
        <button
          className="fixed z-[60] top-4 left-4 bg-gray-700 text-white px-3 py-2 rounded-md text-xl"
          onClick={() => setIsMobileOpen(true)}
        >
          ☰
        </button>
      )}


      {/* Overlay */}
      <div
        className={`${isMobileOpen ? "block" : "hidden"} fixed inset-0 bg-black/40 z-[45]`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`
          ${isMobile
            ? "fixed top-0 left-0 h-full z-[50] transition-transform duration-300"
            : "sticky top-0 h-[calc(100vh-60px)]"}
          bg-white border-r shadow-sm flex flex-col
          ${isExpanded ? "w-[220px]" : "w-[60px]"}
          ${isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : ""}
        `}
      >
        <div className="flex justify-end px-2 py-2">
          {isMobile ? (
            <button onClick={() => setIsMobileOpen(false)} className="text-gray-600 p-1">
              <X size={22} />
            </button>
          ) : (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-600 p-1">
              {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 px-2 mt-2">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => isMobile && setIsMobileOpen(false)}
              title={!isExpanded && !isMobile ? item.label : ""}
              className={`
                flex items-center gap-3 cursor-pointer rounded-lg px-4 py-3
                transition-colors group
                ${activeIndex === index
                  ? "bg-gray-700 text-white"
                  : "text-gray-700 hover:bg-gray-700 hover:text-white"
                }
              `}
            >
              {item.icon}
              {isExpanded && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
