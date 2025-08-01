import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const Sidebar = ({ items, activeIndex, setActiveIndex }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Listen to screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false); // close drawer on desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleItemClick = (index) => {
    setActiveIndex(index);
    if (isMobile) setIsMobileOpen(false); // auto-close on mobile
  };

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button className="mobile-sidebar-button" onClick={toggleMobileSidebar}>
          ☰
        </button>
      )}

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? "show" : ""}`}
        onClick={toggleMobileSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`sidebar-container ${
          isExpanded ? "expanded" : "collapsed"
        } ${isMobile ? "mobile" : ""} ${isMobileOpen ? "open" : ""}`}
      >
        <div className="sidebar-top">
          {isMobile ? (
            <button className="sidebar-toggle" onClick={toggleMobileSidebar}>
              <X size={22} />
            </button>
          ) : (
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              {isExpanded ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          )}
        </div>

        <div className="sidebar-items">
          {items.map((item, index) => (
            <div
              key={index}
              className={`sidebar-item ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => handleItemClick(index)}
              title={!isExpanded && !isMobile ? item.label : ""}
            >
              {item.icon}
              {isExpanded && <span>{item.label}</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
