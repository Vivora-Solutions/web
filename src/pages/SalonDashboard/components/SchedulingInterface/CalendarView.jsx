import {
  Plane,
  PersonStandingIcon,
  Phone,
  Users,
  Clock,
  User,
  MapPin,
} from "lucide-react";
const CalendarView = ({
  selectedStylists,
  selectedStylistsData,
  weekDates,
  stylists,
  appointments,
  isDragging,
  selectionActive,
  inHoldPeriod,
  gridRef,
  handleMouseDown,
  handleTouchStart,
  isSlotSelected,
  hasLeaveOnDate,
  hasLeaveAtTimeSlot,
  isTimeSlotAvailable,
  getAppointmentsForDate,
  calculateSlotPosition,
  handleAppointmentClick,
  COLORS,
  formatTime,
  formatDateToString,
  displayHours = Array.from({ length: 24 }, (_, i) => i), // Default to 24 hours if not provided
  getSalonHoursForDate,
}) => {
  if (selectedStylists.length === 0) {
    return (
      <div
        style={{
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            background: COLORS.cardBg,
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            maxWidth: "500px",
          }}
        >
          <Users
            size={64}
            color={COLORS.textLight}
            style={{ marginBottom: "24px" }}
          />
          <h3
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: COLORS.text,
              marginBottom: "12px",
            }}
          >
            No Staff Selected
          </h3>
          <p
            style={{
              fontSize: "16px",
              color: COLORS.textLight,
              lineHeight: "1.6",
            }}
          >
            Please select one or more staff members from the sidebar to view
            their schedules and manage appointments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div
        ref={gridRef}
        style={{
          display: "flex",
          minHeight: "600px",
          background: COLORS.cardBg,
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          cursor: isDragging ? "grabbing" : "crosshair",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`scheduling-calendar ${
          selectionActive ? "selection-active" : ""
        } ${inHoldPeriod ? "hold-period" : ""}`}
      >
        {/* Time Column */}
        <div
          style={{
            width: "80px",
            background: COLORS.sidebarBg,
            borderRight: `2px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              color: COLORS.text,
              background: "#edf2f7",
              borderBottom: `2px solid ${COLORS.border}`,
              fontSize: "12px",
            }}
          >
            <Clock size={16} />
          </div>
          <div
            style={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              color: COLORS.text,
              background: "#edf2f7",
              borderBottom: `2px solid ${COLORS.border}`,
              fontSize: "12px",
            }}
          >
            <User size={16} />
          </div>
          {displayHours.map((hour) => (
            <div
              key={hour}
              style={{
                height: "64px",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: "8px",
                fontSize: "11px",
                fontWeight: "600",
                color: COLORS.textLight,
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              {formatTime(hour)}
            </div>
          ))}
        </div>

        {/* Date Columns */}
        {weekDates.map((date, dateIndex) => (
          <div
            key={dateIndex}
            style={{
              flex: 1,
              minWidth: "200px",
              borderRight: `1px solid ${COLORS.border}`,
            }}
          >
            {/* Date Header */}
            <div
              style={{
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${COLORS.info}, #3182ce)`,
                color: "white",
                fontWeight: "700",
                borderBottom: `2px solid ${COLORS.border}`,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    display: "block",
                  }}
                >
                  {date.getDate()}
                </span>
                <span
                  style={{ fontSize: "11px", opacity: 0.9, fontWeight: "600" }}
                >
                  {date
                    .toLocaleDateString("en-US", { month: "short" })
                    .toUpperCase()}
                </span>
              </div>
            </div>

            {/* Stylist Sub-headers */}
            <div
              style={{
                display: "flex",
                height: "50px",
                borderBottom: `2px solid ${COLORS.border}`,
              }}
            >
              {selectedStylistsData.map((stylist) => {
                const hasAnyLeave = hasLeaveOnDate(stylist.id, date);
                return (
                  <div
                    key={stylist.id}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "4px 8px",
                      borderRight: `1px solid ${COLORS.border}`,
                      borderTop: `4px solid ${
                        hasAnyLeave ? COLORS.leave : stylist.color
                      }`,
                      fontSize: "11px",
                      fontWeight: "700",
                      background: hasAnyLeave
                        ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: hasAnyLeave
                          ? COLORS.leave
                          : stylist.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        color: "white",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {hasAnyLeave ? <Plane size={12} /> : stylist.avatar}
                    </div>
                    <span style={{ color: COLORS.text }}>
                      {stylist.name.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ position: "relative", minHeight: "100%" }}>
              {/* Time slot grid */}
              {displayHours.map((hourIndex) => (
                <div
                  key={hourIndex}
                  style={{
                    display: "flex",
                    height: "64px",
                    borderBottom: `1px solid #f1f5f9`,
                  }}
                >
                  {selectedStylistsData.map((stylist) => {
                    return (
                      <div
                        key={`${hourIndex}-${stylist.id}`}
                        style={{
                          flex: 1,
                          borderRight: `1px solid #f1f5f9`,
                          transition: "background-color 0.2s ease",
                          position: "relative",
                        }}
                      >
                        {/* 15-minute subdivisions */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "grid",
                            gridTemplateRows: "repeat(4, 1fr)",
                          }}
                        >
                          {[0, 15, 30, 45].map((minute) => {
                            const minuteIsSelected = isSlotSelected(
                              stylist.id,
                              date,
                              hourIndex,
                              minute
                            );
                            const hasLeaveAtSlot = hasLeaveAtTimeSlot(
                              stylist.id,
                              date,
                              hourIndex,
                              minute
                            );
                            const isAvailable = isTimeSlotAvailable(
                              stylist.id,
                              date,
                              hourIndex,
                              minute
                            );

                            // Determine background color based on conditions
                            let backgroundColor = "transparent";
                            if (hasLeaveAtSlot) {
                              backgroundColor = "rgba(239, 68, 68, 0.3)"; // Red for leaves
                            } else if (minuteIsSelected) {
                              backgroundColor = COLORS.selection; // Selection color
                            } else if (!isAvailable) {
                              backgroundColor = "rgba(156, 163, 175, 0.2)"; // Gray for unavailable times
                            }

                            return (
                              <div
                                key={minute}
                                style={{
                                  borderTop:
                                    minute === 0
                                      ? "none"
                                      : "1px solid rgba(226, 232, 240, 0.5)",
                                  backgroundColor,
                                  opacity: minuteIsSelected
                                    ? 0.4
                                    : !isAvailable
                                    ? 0.6
                                    : 1,
                                  transition: "all 0.15s ease",
                                  position: "relative",
                                }}
                              >
                                {/* Leave indicator for specific time slot */}
                                {hasLeaveAtSlot && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      inset: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: COLORS.leave,
                                      fontSize: "8px",
                                      fontWeight: "600",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    <Plane size={8} />
                                  </div>
                                )}
                                {/* Unavailable time indicator */}
                                {!isAvailable && !hasLeaveAtSlot && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      inset: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "rgba(107, 114, 128, 0.7)",
                                      fontSize: "6px",
                                      fontWeight: "600",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    ✕
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Appointments positioned absolutely */}
              {selectedStylistsData.map((stylist, stylistIndex) => {
                const dayAppointments = getAppointmentsForDate(
                  date,
                  stylist.id
                );
                const columnWidth = 100 / selectedStylists.length;
                const leftPosition = stylistIndex * columnWidth;

                return dayAppointments.map((appointment) => {
                  const position = calculateSlotPosition(
                    appointment.startTime,
                    appointment.endTime
                  );
                  const statusColor =
                    appointment.status === "confirmed"
                      ? stylist.color
                      : appointment.status === "pending"
                      ? COLORS.warning
                      : appointment.status === "cancelled"
                      ? COLORS.danger
                      : stylist.color;

                  return (
                    <div
                      key={appointment.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAppointmentClick(appointment);
                      }}
                      style={{
                        position: "absolute",
                        backgroundColor: statusColor,
                        top: `${position.top}px`,
                        height: `${Math.max(position.height, 32)}px`,
                        left: `${leftPosition}%`,
                        width: `${columnWidth - 1}%`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        overflow: "hidden",
                        zIndex: 10,
                        margin: "1px",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.02)";
                        e.target.style.zIndex = "20";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.zIndex = "10";
                      }}
                    >
                      <div
                        style={{
                          padding: "8px 10px",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          color: "white",
                          textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "700",
                              fontSize: "12px",
                              flex: 1,
                              lineHeight: "1.2",
                            }}
                          >
                            {appointment.clientName}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {appointment.isWalkIn ? (
                              <PersonStandingIcon size={14} />
                            ) : (
                              <Phone size={14} />
                            )}
                            {appointment.workstation && <MapPin size={12} />}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            fontWeight: "600",
                            opacity: 0.9,
                          }}
                        >
                          <div>
                            {appointment.startTime} - {appointment.endTime}
                          </div>
                          {appointment.workstation && (
                            <div style={{ fontSize: "9px", opacity: 0.8 }}>
                              {appointment.workstation.workstation_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
