import DaySelectionView from "./DaySelectionView";
import CalendarView from "./CalendarView";
import AppointmentPanel from "./AppointmentPanel";
import AppointmentDetailsPanel from "./AppointmentDetailsPanel";
import { ApiService } from "./services/apiService";
import { COLORS } from "./utils/colors";
import SelectionInfo from "./SelectionInfo";
import ScheduleManagementPanel from "./ScheduleManagementPanel";
import Notification from "./Notification";
import Header from "./Header";
import FiltersRow from "./FiltersRow";
import LoadingSpinner from "./LoadingSpinner";
import FloatingActionButton from "./FloatingActionButton";
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { Coffee, Plane, CheckCircle } from "lucide-react";

import { ProtectedAPI } from "../../../../utils/api";

// Memoize child components to prevent unnecessary re-renders
const MemoizedDaySelectionView = memo(DaySelectionView);
const MemoizedCalendarView = memo(CalendarView);
const MemoizedHeader = memo(Header);
const MemoizedFiltersRow = memo(FiltersRow);
const MemoizedSelectionInfo = memo(SelectionInfo);
const MemoizedAppointmentPanel = memo(AppointmentPanel);
const MemoizedAppointmentDetailsPanel = memo(AppointmentDetailsPanel);
const MemoizedScheduleManagementPanel = memo(ScheduleManagementPanel);
const MemoizedFloatingActionButton = memo(FloatingActionButton);

const SchedulingInterface = () => {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [selectedStylists, setSelectedStylists] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedBreakSlots, setSelectedBreakSlots] = useState([]);
  const [selectedLeaveDays, setSelectedLeaveDays] = useState([]);
  const [scheduleType, setScheduleType] = useState("available");
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maxDays, setMaxDays] = useState(1);
  const [salonId, setSalonId] = useState("");

  // Mobile touch handling states
  const [touchHoldTimer, setTouchHoldTimer] = useState(null);
  const [initialTouchPosition, setInitialTouchPosition] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [selectionActive, setSelectionActive] = useState(false);
  const [inHoldPeriod, setInHoldPeriod] = useState(false);

  // Data states - using real API structure
  const [stylists, setStylists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [services, setServices] = useState([]);
  const [salonOpeningHours, setSalonOpeningHours] = useState([]);

  // Panel states
  const [showAddAppointmentPanel, setShowAddAppointmentPanel] = useState(false);
  const [showAppointmentDetailsPanel, setShowAppointmentDetailsPanel] =
    useState(false);
  const [showScheduleManagementPanel, setShowScheduleManagementPanel] =
    useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditingAppointment, setIsEditingAppointment] = useState(false);
  const [selectedLeavesToDelete, setSelectedLeavesToDelete] = useState([]);

  // Form states
  const [newAppointment, setNewAppointment] = useState({
    id: "",
    clientName: "",
    clientPhone: "",
    services: [],
    stylistId: "",
    date: "",
    startTime: "",
    endTime: "",
    isWalkIn: false,
    notes: "",
    status: "confirmed",
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Refs and constants
  const gridRef = useRef(null);

  // Use constants outside of render cycle
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const dayFilters = useMemo(() => [1, 2, 3, 5], []);
  const scheduleTypes = useMemo(
    () => [
      {
        value: "available",
        label: "Available",
        icon: CheckCircle,
        color: COLORS.available,
      },
      { value: "break", label: "Break", icon: Coffee, color: COLORS.break },
      { value: "leave", label: "Leave", icon: Plane, color: COLORS.leave },
    ],
    []
  );

  // Memoize selected stylists data to avoid recalculation on each render
  const selectedStylistsData = useMemo(
    () => stylists.filter((s) => selectedStylists.includes(s.id)),
    [stylists, selectedStylists]
  );

  // Memoize display hours calculation which is expensive
  const displayHours = useMemo(
    () => getDisplayHours(),
    [salonOpeningHours, weekDates]
  );

  // Notification system - use useCallback to avoid recreation
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Initialize data
  useEffect(() => {
    loadData();
  }, []);

  // Cleanup touch timer on unmount
  useEffect(() => {
    return () => {
      if (touchHoldTimer) {
        clearTimeout(touchHoldTimer);
      }
      document.body.classList.remove("selection-mode");
    };
  }, [touchHoldTimer]);

  // Manage body scroll lock based on selection state
  useEffect(() => {
    if (selectionActive || isDragging) {
      document.body.classList.add("selection-mode");
    } else {
      document.body.classList.remove("selection-mode");
    }

    return () => {
      document.body.classList.remove("selection-mode");
    };
  }, [selectionActive, isDragging]);

  // Global mouse and touch event listeners - use cleanup properly
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();
    const handleGlobalTouchMove = (e) => handleTouchMove(e);
    const handleGlobalTouchEnd = (e) => handleTouchEnd(e);

    if (isDragging || initialTouchPosition || inHoldPeriod || selectionActive) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.addEventListener("touchmove", handleGlobalTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleGlobalTouchEnd, {
        passive: false,
      });
      document.addEventListener("touchcancel", handleGlobalTouchEnd, {
        passive: false,
      });
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
      document.removeEventListener("touchcancel", handleGlobalTouchEnd);
    };
  }, [
    isDragging,
    dragStart,
    initialTouchPosition,
    selectionActive,
    inHoldPeriod,
  ]);

  // Generate week dates effect
  useEffect(() => {
    generateWeekDates();
  }, [selectedDate, maxDays]);

  // Convert expensive functions to useCallback to prevent recreation
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Use single API call to get all schedule overview data
      const overviewResponse = await ApiService.getScheduleOverview();
      // console.log("🔍 Overview API response:", overviewResponse);
      // console.log("🔍 Bookings from overview:", overviewResponse.data.bookings);
      if (
        overviewResponse.data.bookings &&
        overviewResponse.data.bookings.length > 0
      ) {
        // console.log(
        //   "🔍 Sample booking structure:",
        //   overviewResponse.data.bookings[0]
        // );
      }
      const {
        stylists: stylistsData,
        services: servicesData,
        openingHours,
        bookings,
      } = overviewResponse.data;

      // Transform appointments from the overview data
      if (bookings && bookings.length > 0) {
        const transformedAppointments = bookings.map((appointment) => ({
          id: appointment.booking_id,
          clientName: appointment.customer
            ? `${appointment.customer.first_name} ${appointment.customer.last_name}`
            : appointment.non_online_customer?.non_online_customer_name ||
              "Walk-in Customer",
          clientPhone:
            appointment.customer?.contact_number ||
            appointment.non_online_customer
              ?.non_online_customer_mobile_number ||
            "",
          stylistId: appointment.stylist?.stylist_id || appointment.stylist_id,
          stylistName: appointment.stylist?.stylist_name || "Unknown Stylist",
          date: appointment.booking_start_datetime.split("T")[0],
          startTime: appointment.booking_start_datetime
            .split("T")[1]
            .substring(0, 5),
          endTime: appointment.booking_end_datetime
            .split("T")[1]
            .substring(0, 5),
          services:
            appointment.booking_services?.map((bs) => {
              // console.log("🔧 Processing booking service:", bs);
              return bs.service?.service_id || bs.service_id;
            }) || [],
          isWalkIn: !appointment.user_id,
          notes: appointment.notes || "",
          status: appointment.status,
          workstation: appointment.workstation,
          originalData: appointment,
        }));

        setAppointments(transformedAppointments);
      } else {
        setAppointments([]);
      }

      // Set opening hours from overview data
      if (openingHours && openingHours.length > 0) {
        setSalonOpeningHours(openingHours);
      } else {
        // Set default opening hours
        const defaultHours = Array(7)
          .fill()
          .map((_, index) => ({
            day_of_week: index,
            is_open: true,
            opening_time: "09:00",
            closing_time: "18:00",
          }));
        setSalonOpeningHours(defaultHours);
      }

      setSalonId(stylistsData[0]?.salon_id || "");

      // Transform API data to internal format
      const transformedStylists = stylistsData.map((stylist, index) => ({
        id: stylist.stylist_id,
        name: stylist.stylist_name,
        color: COLORS.stylists[index % COLORS.stylists.length],
        avatar: stylist.profile_pic_link || "👤",
        isActive: stylist.is_active,
        contactNumber: stylist.stylist_contact_number,
        email: stylist.stylist_email,
        bio: stylist.bio,
        schedule: stylist.schedule,
      }));

      // Set default stylist selection only if needed
      if (selectedStylists.length === 0) {
        const firstActiveStylist = transformedStylists.find(
          (stylist) => stylist.isActive
        );

        if (firstActiveStylist) {
          setSelectedStylists([firstActiveStylist.id]);
        }
      } else {
        // Validate currently selected stylists
        const validSelectedStylists = selectedStylists.filter((stylistId) => {
          const stylist = transformedStylists.find((s) => s.id === stylistId);
          return stylist && stylist.isActive;
        });

        if (validSelectedStylists.length !== selectedStylists.length) {
          if (validSelectedStylists.length > 0) {
            setSelectedStylists(validSelectedStylists);
          } else {
            const firstActiveStylist = transformedStylists.find(
              (stylist) => stylist.isActive
            );
            if (firstActiveStylist) {
              setSelectedStylists([firstActiveStylist.id]);
            }
          }
        }
      }

      const transformedServices = servicesData.map((service) => ({
        id: service.service_id,
        name: service.service_name,
        duration: service.duration_minutes,
        price: service.price,
        category: service.service_category,
        description: service.service_description,
      }));

      setStylists(transformedStylists);
      setServices(transformedServices);
      setLeaves(overviewResponse.data.leaves || []);
      generateWeekDates();
    } catch (error) {
      console.error("🚨 Error loading data with overview API:", error);
      console.error("🚨 Error details:", JSON.stringify(error, null, 2));
      showNotification("Error loading data. Please try again.", "error");

      // Fallback to individual API calls if overview fails
      try {
        // console.log("🔄 Falling back to individual API calls...");
        const [appointmentsData, stylistsData, servicesData, leavesData] =
          await Promise.all([
            ApiService.getAppointments(),
            ApiService.getStylists(),
            ApiService.getServices(),
            ApiService.getLeaves(),
          ]);

        // Transform appointments
        if (appointmentsData && appointmentsData.length > 0) {
          const transformedAppointments = appointmentsData.map(
            (appointment) => ({
              id: appointment.booking_id,
              clientName: appointment.customer
                ? `${appointment.customer.first_name} ${appointment.customer.last_name}`
                : appointment.non_online_customer?.non_online_customer_name ||
                  "Walk-in Customer",
              clientPhone:
                appointment.customer?.contact_number ||
                appointment.non_online_customer
                  ?.non_online_customer_mobile_number ||
                "",
              stylistId:
                appointment.stylist?.stylist_id || appointment.stylist_id,
              stylistName:
                appointment.stylist?.stylist_name || "Unknown Stylist",
              date: appointment.booking_start_datetime.split("T")[0],
              startTime: appointment.booking_start_datetime
                .split("T")[1]
                .substring(0, 5),
              endTime: appointment.booking_end_datetime
                .split("T")[1]
                .substring(0, 5),
              services:
                appointment.booking_services?.map(
                  (bs) => bs.service.service_id
                ) || [],
              isWalkIn: !appointment.user_id,
              notes: appointment.notes || "",
              status: appointment.status,
              workstation: appointment.workstation,
              originalData: appointment,
            })
          );
          setAppointments(transformedAppointments);
        } else {
          setAppointments([]);
        }

        // Transform stylists
        const transformedStylists = stylistsData.map((stylist, index) => ({
          id: stylist.stylist_id,
          name: stylist.stylist_name,
          color: COLORS.stylists[index % COLORS.stylists.length],
          avatar: stylist.profile_pic_link || "👤",
          isActive: stylist.is_active,
          contactNumber: stylist.stylist_contact_number,
          email: stylist.stylist_email,
          bio: stylist.bio,
          schedule: stylist.schedule,
        }));

        // Transform services
        const transformedServices = servicesData.map((service) => ({
          id: service.service_id,
          name: service.service_name,
          duration: service.duration_minutes,
          price: service.price,
          category: service.service_category,
          description: service.service_description,
        }));

        setStylists(transformedStylists);
        setServices(transformedServices);
        setLeaves(leavesData);

        // Set default stylist selection
        if (selectedStylists.length === 0) {
          const firstActiveStylist = transformedStylists.find(
            (stylist) => stylist.isActive
          );
          if (firstActiveStylist) {
            setSelectedStylists([firstActiveStylist.id]);
          }
        }

        // Fetch salon opening hours
        try {
          const openingHoursResponse = await ApiService.getOpeningHours();
          setSalonOpeningHours(openingHoursResponse.days || []);
        } catch (error) {
          console.error("Error fetching opening hours:", error);
          // Set default opening hours
          const defaultHours = Array(7)
            .fill()
            .map((_, index) => ({
              day_of_week: index,
              is_open: true,
              opening_time: "09:00",
              closing_time: "18:00",
            }));
          setSalonOpeningHours(defaultHours);
        }

        generateWeekDates();
        showNotification("Data loaded successfully (fallback mode)", "success");
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        showNotification(
          "Failed to load data. Please refresh the page.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [selectedStylists, showNotification]);

  // Helper functions - convert to useCallback to prevent recreation
  const generateWeekDates = useCallback(() => {
    const startDate = new Date(selectedDate);
    const dates = [];
    for (let i = 0; i < maxDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    setWeekDates(dates);
  }, [selectedDate, maxDays]);

  const formatDateToString = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const formatTime = useCallback((hour, minute = 0) => {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const formatDate = useCallback((date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, []);

  // Helper functions for salon opening hours
  const getSalonHoursForDate = useCallback(
    (date) => {
      const dayOfWeek = date.getDay();
      const dayHours = salonOpeningHours.find(
        (h) => h.day_of_week === dayOfWeek
      );

      if (!dayHours || !dayHours.is_open) {
        return null;
      }

      return {
        openingTime: dayHours.opening_time,
        closingTime: dayHours.closing_time,
      };
    },
    [salonOpeningHours]
  );

  function getDisplayHours() {
    if (salonOpeningHours.length === 0) {
      return Array.from({ length: 24 }, (_, i) => i);
    }

    if (weekDates.length === 0) {
      return Array.from({ length: 24 }, (_, i) => i);
    }

    const hoursSet = new Set();

    weekDates.forEach((date) => {
      const dayOfWeek = date.getDay();
      const dayHours = salonOpeningHours.find(
        (h) => h.day_of_week === dayOfWeek
      );

      if (
        dayHours &&
        dayHours.is_open &&
        dayHours.opening_time &&
        dayHours.closing_time
      ) {
        try {
          const openTime = parseInt(dayHours.opening_time.split(":")[0]);
          const closeTime = parseInt(dayHours.closing_time.split(":")[0]);

          if (!isNaN(openTime) && !isNaN(closeTime) && openTime <= closeTime) {
            for (let hour = openTime; hour <= closeTime; hour++) {
              hoursSet.add(hour);
            }
          }
        } catch (err) {
          console.error(`Error parsing times for day ${dayOfWeek}:`, err);
        }
      }
    });

    if (hoursSet.size === 0) {
      return [];
    }

    return Array.from(hoursSet).sort((a, b) => a - b);
  }

  const getDisplayHoursForDate = useCallback(
    (date) => {
      if (salonOpeningHours.length === 0) {
        return Array.from({ length: 24 }, (_, i) => i);
      }

      const dayOfWeek = date.getDay();
      const dayHours = salonOpeningHours.find(
        (h) => h.day_of_week === dayOfWeek
      );

      if (!dayHours || !dayHours.is_open) {
        return [];
      }

      const openTime = parseInt(dayHours.opening_time.split(":")[0]);
      const closeTime = parseInt(dayHours.closing_time.split(":")[0]);

      const hours = [];
      for (let hour = openTime; hour <= closeTime; hour++) {
        hours.push(hour);
      }

      return hours;
    },
    [salonOpeningHours]
  );

  const parseTimeToMinutes = useCallback((timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }, []);

  const calculateSlotPosition = useCallback(
    (startTime, endTime) => {
      const startMinutes = parseTimeToMinutes(startTime);
      const endMinutes = parseTimeToMinutes(endTime);
      const duration = endMinutes - startMinutes;
      const hourHeight = 64;

      const firstDisplayHour = displayHours.length > 0 ? displayHours[0] : 0;
      const adjustedStartMinutes = startMinutes - firstDisplayHour * 60;

      const top = Math.max(0, (adjustedStartMinutes / 60) * hourHeight);
      const height = (duration / 60) * hourHeight;
      return { top, height };
    },
    [parseTimeToMinutes, displayHours]
  );

  // Drag and selection functions
  const getCellPosition = useCallback(
    (e) => {
      if (!gridRef.current) return null;
      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const headerHeight = 100;
      const timeColumnWidth = 80;

      if (y < headerHeight || x < timeColumnWidth) return null;

      const availableWidth = rect.width - timeColumnWidth;
      const cellWidth =
        availableWidth / (weekDates.length * selectedStylists.length);
      const cellHeight = 64;
      const totalCellIndex = Math.floor((x - timeColumnWidth) / cellWidth);
      const hourIndex = Math.floor((y - headerHeight) / cellHeight);
      const dateIndex = Math.floor(totalCellIndex / selectedStylists.length);
      const stylistIndex = totalCellIndex % selectedStylists.length;
      const minuteInHour = Math.floor(
        (((y - headerHeight) % cellHeight) / cellHeight) * 60
      );
      const minute = Math.floor(minuteInHour / 15) * 15;

      if (
        dateIndex < 0 ||
        dateIndex >= weekDates.length ||
        stylistIndex < 0 ||
        stylistIndex >= selectedStylists.length ||
        hourIndex < 0 ||
        hourIndex >= displayHours.length
      ) {
        return null;
      }

      const actualHour = displayHours[hourIndex];

      return {
        dateIndex,
        stylistIndex,
        hourIndex: actualHour,
        minute,
        stylistId: selectedStylists[stylistIndex],
        date: weekDates[dateIndex],
      };
    },
    [displayHours, weekDates, selectedStylists]
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (scheduleType === "leave") return;
      const position = getCellPosition(e);
      if (!position) return;

      setIsDragging(true);
      setDragStart(position);
      setDragEnd(position);
      setSelectedTimeSlots([]);

      updateSelection(position, position);
      document.body.classList.add("selection-mode");

      e.preventDefault();
    },
    [scheduleType, getCellPosition]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !dragStart || scheduleType === "leave") return;
      const position = getCellPosition(e);
      if (!position) return;

      setDragEnd(position);
      updateSelection(dragStart, position);
    },
    [isDragging, dragStart, scheduleType, getCellPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.classList.remove("selection-mode");
  }, []);

  const handleTouchStart = useCallback(
    (e) => {
      if (scheduleType === "leave") return;

      const touch = e.touches[0];
      const mockEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
      };

      const position = getCellPosition(mockEvent);
      if (!position) return;

      setInitialTouchPosition({
        x: touch.clientX,
        y: touch.clientY,
        position,
      });
      setTouchStartTime(Date.now());
      setIsHolding(false);
      setSelectionActive(false);
      setInHoldPeriod(true);

      if (touchHoldTimer) {
        clearTimeout(touchHoldTimer);
      }

      const timer = setTimeout(() => {
        setIsHolding(true);
        setSelectionActive(true);
        setIsDragging(true);
        setDragStart(position);
        setDragEnd(position);
        setSelectedTimeSlots([]);
        setInHoldPeriod(false);

        updateSelection(position, position);
        document.body.classList.add("selection-mode");

        if (navigator.vibrate) {
          navigator.vibrate([50]);
        }
      }, 400);

      setTouchHoldTimer(timer);
    },
    [scheduleType, getCellPosition]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!initialTouchPosition) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - initialTouchPosition.x);
      const deltaY = Math.abs(touch.clientY - initialTouchPosition.y);
      const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (selectionActive && isDragging && dragStart) {
        const mockEvent = {
          clientX: touch.clientX,
          clientY: touch.clientY,
        };

        const position = getCellPosition(mockEvent);
        if (position) {
          setDragEnd(position);
          updateSelection(dragStart, position);
        }

        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (inHoldPeriod && totalMovement > 25) {
        if (touchHoldTimer) {
          clearTimeout(touchHoldTimer);
          setTouchHoldTimer(null);
        }
        setInitialTouchPosition(null);
        setIsHolding(false);
        setInHoldPeriod(false);
        return;
      }

      if (inHoldPeriod) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [
      initialTouchPosition,
      selectionActive,
      isDragging,
      dragStart,
      inHoldPeriod,
      touchHoldTimer,
      getCellPosition,
    ]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchHoldTimer) {
        clearTimeout(touchHoldTimer);
        setTouchHoldTimer(null);
      }

      const wasInSelectionMode = selectionActive;

      setIsDragging(false);
      setInitialTouchPosition(null);
      setIsHolding(false);
      setSelectionActive(false);
      setInHoldPeriod(false);

      document.body.classList.remove("selection-mode");

      if (wasInSelectionMode) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [touchHoldTimer, selectionActive]
  );

  const updateSelection = useCallback(
    (start, end) => {
      const slots = [];
      const breakSlots = [];

      // Calculate selection boundaries
      const minDateIndex = Math.min(start.dateIndex, end.dateIndex);
      const maxDateIndex = Math.max(start.dateIndex, end.dateIndex);
      const minStylistIndex = Math.min(start.stylistIndex, end.stylistIndex);
      const maxStylistIndex = Math.max(start.stylistIndex, end.stylistIndex);
      const minTime = Math.min(
        start.hourIndex * 60 + start.minute,
        end.hourIndex * 60 + end.minute
      );
      const maxTime = Math.max(
        start.hourIndex * 60 + start.minute,
        end.hourIndex * 60 + end.minute
      );

      // Helper function to format time consistently
      const formatDateTime = (date, totalMinutes) => {
        const hour = Math.floor(totalMinutes / 60);
        const minute = totalMinutes % 60;
        return `${date}T${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}:00Z`;
      };

      // Group time slots by stylist and date for break slot creation
      const groupedSlots = new Map();

      // Generate all selected slots
      for (let dateIdx = minDateIndex; dateIdx <= maxDateIndex; dateIdx++) {
        for (
          let stylistIdx = minStylistIndex;
          stylistIdx <= maxStylistIndex;
          stylistIdx++
        ) {
          const stylistId = selectedStylists[stylistIdx];
          const date = formatDateToString(weekDates[dateIdx]);
          const groupKey = `${stylistId}-${date}`;

          // Initialize group if not exists
          if (!groupedSlots.has(groupKey)) {
            groupedSlots.set(groupKey, {
              stylistId,
              date,
              timeSlots: [],
            });
          }

          // Add all 15-minute slots in the time range
          for (
            let totalMinutes = minTime;
            totalMinutes <= maxTime;
            totalMinutes += 15
          ) {
            const hour = Math.floor(totalMinutes / 60);
            const minute = totalMinutes % 60;

            // Create slot ID for individual slot tracking
            const slotId = `${stylistId}-${date}-${hour}-${minute}`;
            slots.push(slotId);

            // Add to group for break slot creation
            groupedSlots.get(groupKey).timeSlots.push(totalMinutes);
          }
        }
      }

      // Create break slots by combining consecutive time periods
      groupedSlots.forEach((group) => {
        if (group.timeSlots.length === 0) return;

        // Sort and combine consecutive slots
        const sortedTimes = [...group.timeSlots].sort((a, b) => a - b);
        let blockStart = sortedTimes[0];
        let blockEnd = sortedTimes[0] + 15;

        for (let i = 1; i < sortedTimes.length; i++) {
          const currentTime = sortedTimes[i];

          if (currentTime <= blockEnd) {
            // Extend current block
            blockEnd = currentTime + 15;
          } else {
            // Save current block and start new one
            breakSlots.push([
              formatDateTime(group.date, blockStart),
              formatDateTime(group.date, blockEnd),
              group.date,
            ]);

            blockStart = currentTime;
            blockEnd = currentTime + 15;
          }
        }

        // Add the final block
        breakSlots.push([
          formatDateTime(group.date, blockStart),
          formatDateTime(group.date, blockEnd),
          group.date,
        ]);
      });

      setSelectedBreakSlots(breakSlots);
      setSelectedTimeSlots(slots);
    },
    [selectedStylists, weekDates, formatDateToString]
  );

  const isSlotSelected = useCallback(
    (stylistId, date, hour, minute = 0) => {
      const slotId = `${stylistId}-${formatDateToString(
        date
      )}-${hour}-${minute}`;
      return selectedTimeSlots.includes(slotId);
    },
    [selectedTimeSlots, formatDateToString]
  );

  const isTimeSlotAvailable = useCallback(
    (stylistId, date, hour, minute = 0) => {
      // First check if salon is open at this time for this date
      const dayOfWeek = date.getDay();
      const salonHours = salonOpeningHours.find(
        (h) => h.day_of_week === dayOfWeek
      );

      if (
        !salonHours ||
        !salonHours.is_open ||
        !salonHours.opening_time ||
        !salonHours.closing_time
      ) {
        return false;
      }

      // Check if time falls within salon opening hours
      const currentTimeMinutes = hour * 60 + minute;
      try {
        const openingTimeParts = salonHours.opening_time.split(":");
        const closingTimeParts = salonHours.closing_time.split(":");
        const salonOpenMinutes =
          parseInt(openingTimeParts[0]) * 60 +
          parseInt(openingTimeParts[1] || "0");
        const salonCloseMinutes =
          parseInt(closingTimeParts[0]) * 60 +
          parseInt(closingTimeParts[1] || "0");

        if (
          currentTimeMinutes < salonOpenMinutes ||
          currentTimeMinutes >= salonCloseMinutes
        ) {
          return false;
        }
      } catch (err) {
        console.error("Error parsing salon hours:", err);
        return false;
      }

      // Then check stylist availability
      const stylist = stylists.find((s) => s.id === stylistId);
      if (!stylist || !stylist.schedule || stylist.schedule.length === 0) {
        return true;
      }

      // Check if the stylist has any schedule for this day of week
      const daySchedules = stylist.schedule.filter(
        (schedule) => schedule.day_of_week === dayOfWeek
      );

      if (daySchedules.length === 0) {
        return false;
      }

      // Check if current time falls within any of the stylist's scheduled time ranges for this day
      return daySchedules.some((schedule) => {
        try {
          const startTimeParts = schedule.start_time_daily.split(":");
          const endTimeParts = schedule.end_time_daily.split(":");
          const startMinutes =
            parseInt(startTimeParts[0]) * 60 +
            parseInt(startTimeParts[1] || "0");
          const endMinutes =
            parseInt(endTimeParts[0]) * 60 + parseInt(endTimeParts[1] || "0");

          return (
            currentTimeMinutes >= startMinutes &&
            currentTimeMinutes < endMinutes
          );
        } catch (err) {
          console.error("Error parsing stylist schedule times:", err);
          return false;
        }
      });
    },
    [salonOpeningHours, stylists]
  );

  // Leave day selection
  const handleDayClick = useCallback(
    (date) => {
      if (scheduleType !== "leave") return;
      const dateStr = formatDateToString(date);
      setSelectedLeaveDays((prev) => {
        if (prev.includes(dateStr)) {
          return prev.filter((d) => d !== dateStr);
        } else {
          return [...prev, dateStr];
        }
      });
    },
    [scheduleType, formatDateToString]
  );

  const isDaySelected = useCallback(
    (date) => {
      const dateStr = formatDateToString(date);
      return selectedLeaveDays.includes(dateStr);
    },
    [selectedLeaveDays, formatDateToString]
  );

  // Check if stylist has leave on a specific date
  const hasLeaveOnDate = useCallback(
    (stylistId, date) => {
      const dateStr = formatDateToString(date);
      return leaves.some(
        (leave) => leave.stylist_id === stylistId && leave.date === dateStr
      );
    },
    [leaves, formatDateToString]
  );

  // Check if stylist has leave on a specific time slot
  const hasLeaveAtTimeSlot = useCallback(
    (stylistId, date, hour, minute = 0) => {
      const currentSlotStart = `${formatDateToString(date)}T${hour
        .toString()
        .padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00+00:00`;
      let endHour = hour;
      let endMinute = minute + 15;
      if (endMinute >= 60) {
        endHour += 1;
        endMinute -= 60;
      }
      const currentSlotEnd = `${formatDateToString(date)}T${endHour
        .toString()
        .padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}:00+00:00`;

      return leaves.some((leave) => {
        if (leave.stylist_id !== stylistId) return false;

        const leaveStart = new Date(leave.leave_start_time).getTime();
        const leaveEnd = new Date(leave.leave_end_time).getTime();
        const slotStart = new Date(currentSlotStart).getTime();
        const slotEnd = new Date(currentSlotEnd).getTime();

        // Check if there's any overlap between leave period and current time slot
        return leaveStart < slotEnd && leaveEnd > slotStart;
      });
    },
    [leaves, formatDateToString]
  );

  // Stylist management
  const handleStylistToggle = useCallback((stylistId) => {
    setSelectedStylists((prev) => {
      if (prev.includes(stylistId)) {
        return prev.filter((id) => id !== stylistId);
      } else {
        return [...prev, stylistId];
      }
    });
  }, []);

  // Appointment management
  const handleAppointmentClick = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetailsPanel(true);
    setIsEditingAppointment(false);
  }, []);

  const handleAddAppointment = useCallback(() => {
    const today = new Date();
    const localDate = formatDateToString(today);
    setNewAppointment({
      id: "",
      clientName: "",
      clientPhone: "",
      services: [],
      stylistId: selectedStylists[0] || "",
      date: localDate,
      startTime: "09:00",
      endTime: "10:00",
      isWalkIn: false,
      notes: "",
      status: "confirmed",
    });
    setAvailableTimeSlots([]);
    setShowAddAppointmentPanel(true);
    setIsEditingAppointment(false);
  }, [selectedStylists, formatDateToString]);

  // Check availability function
  const handleCheckAvailability = useCallback(async () => {
    if (
      !newAppointment.stylistId ||
      !newAppointment.date ||
      newAppointment.services.length === 0
    ) {
      showNotification(
        "Please select stylist, date, and services first",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      // Prepare the API request data
      const requestData = {
        service_ids: newAppointment.services,
        stylist_id: newAppointment.stylistId,
        salon_id: salonId,
        date: newAppointment.date,
      };

      // Call the backend API to get available time slots
      const response = await ProtectedAPI.post(
        "/salons/available-time-slots-sithum",
        requestData
      );

      if (response.data.success && response.data.data) {
        const slots = response.data.data.map((slot) => ({
          startTime: slot.start,
          endTime: slot.end,
        }));

        setAvailableTimeSlots(slots);

        if (slots.length === 0) {
          showNotification(
            "No available time slots found for the selected date and services",
            "error"
          );
        } else {
          showNotification(
            `Found ${slots.length} available time slots`,
            "success"
          );
        }
      } else {
        showNotification("No available time slots found", "error");
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error("Error checking availability:", error);

      if (error.response?.status === 400) {
        showNotification(
          error.response.data.error || "Invalid request data",
          "error"
        );
      } else if (error.response?.status === 500) {
        showNotification(
          error.response.data.details || "Server error",
          "error"
        );
      } else {
        showNotification(
          "Failed to check availability. Please try again.",
          "error"
        );
      }

      setAvailableTimeSlots([]);
    } finally {
      setLoading(false);
    }
  }, [newAppointment, salonId, showNotification]);

  const handleSaveAppointment = useCallback(async () => {
    try {
      setLoading(true);

      // Validate form
      if (
        !newAppointment.clientName ||
        !newAppointment.stylistId ||
        !newAppointment.date ||
        !newAppointment.startTime ||
        !newAppointment.endTime
      ) {
        showNotification("Please fill in all required fields", "error");
        return;
      }

      if (newAppointment.services.length === 0) {
        showNotification("Please select at least one service", "error");
        return;
      }

      // Check for time conflicts
      const conflictingAppointment = appointments.find(
        (apt) =>
          apt.id !== newAppointment.id &&
          apt.stylistId === newAppointment.stylistId &&
          apt.date === newAppointment.date &&
          ((parseTimeToMinutes(newAppointment.startTime) >=
            parseTimeToMinutes(apt.startTime) &&
            parseTimeToMinutes(newAppointment.startTime) <
              parseTimeToMinutes(apt.endTime)) ||
            (parseTimeToMinutes(newAppointment.endTime) >
              parseTimeToMinutes(apt.startTime) &&
              parseTimeToMinutes(newAppointment.endTime) <=
                parseTimeToMinutes(apt.endTime)))
      );

      if (conflictingAppointment) {
        showNotification(
          "Time slot conflicts with existing appointment",
          "error"
        );
        return;
      }

      let result;
      if (isEditingAppointment) {
        result = await ApiService.updateAppointment(
          newAppointment.id,
          newAppointment
        );
        showNotification("Appointment updated successfully!");
      } else {
        newAppointment.isWalkIn = true;
        result = await ApiService.createAppointment(newAppointment);
        showNotification("Appointment created successfully!");
      }

      setShowAddAppointmentPanel(false);
      resetAppointmentForm();

      // Reload data to reflect changes and fix any display issues
      await loadData();
    } catch (error) {
      console.error("Error saving appointment:", error);

      if (error.response?.data?.error) {
        showNotification(error.response.data.error, "error");
      } else if (error.response?.data?.message) {
        showNotification(error.response.data.message, "error");
      } else if (error.message) {
        showNotification(error.message, "error");
      } else {
        showNotification(
          "Error saving appointment. Please try again.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [
    newAppointment,
    isEditingAppointment,
    appointments,
    parseTimeToMinutes,
    loadData,
    showNotification,
  ]);

  const handleDeleteAppointment = useCallback(
    async (appointmentId) => {
      if (!confirm("Are you sure you want to delete this appointment?")) return;

      try {
        setLoading(true);
        await ApiService.deleteAppointment(appointmentId);
        setShowAppointmentDetailsPanel(false);
        setSelectedAppointment(null);
        showNotification("Appointment deleted successfully!");

        // Reload data to reflect changes
        await loadData();
      } catch (error) {
        console.error("Error deleting appointment:", error);
        showNotification(
          "Error deleting appointment. Please try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
    [loadData, showNotification]
  );

  const handleCompleteAppointment = useCallback(
    async (appointmentId) => {
      try {
        await ApiService.completeAppointment(appointmentId);
        setShowAppointmentDetailsPanel(false);
        setSelectedAppointment(null);
        showNotification("Appointment completed successfully!");

        // Reload data to reflect changes
        await loadData();
      } catch (error) {
        console.error("Error completing appointment:", error);
        showNotification(
          "Error completing appointment. Please try again.",
          "error"
        );
      }
    },
    [loadData, showNotification]
  );

  const resetAppointmentForm = useCallback(() => {
    setNewAppointment({
      id: "",
      clientName: "",
      clientPhone: "",
      services: [],
      stylistId: "",
      date: "",
      startTime: "",
      endTime: "",
      isWalkIn: false,
      notes: "",
      status: "confirmed",
    });
  }, []);

  // Cancel selection function
  const handleCancelSelection = useCallback(() => {
    setSelectedTimeSlots([]);
    setSelectedBreakSlots([]);
    setSelectedLeaveDays([]);
    setIsDragging(false);
    setSelectionActive(false);
    document.body.classList.remove("selection-mode");
  }, []);

  // Quick action functions for inline break and leave creation
  const handleQuickAddBreak = useCallback(async () => {
    if (selectedTimeSlots.length === 0 || selectedStylists.length === 0) {
      showNotification("Please select time slots and staff members", "error");
      return;
    }

    try {
      setLoading(true);

      // Create break slots for each selected stylist
      for (const stylistId of selectedStylists) {
        for (const breakSlot of selectedBreakSlots) {
          const data = {
            stylist_id: stylistId,
            date: breakSlot[2],
            leave_start_time: breakSlot[0],
            leave_end_time: breakSlot[1],
          };
          await ApiService.createLeave(data);
        }
      }

      showNotification(
        `Break added successfully! ${selectedBreakSlots.length} break slot(s) scheduled for ${selectedStylists.length} staff member(s).`,
        "success"
      );

      // Clear selections
      setSelectedTimeSlots([]);
      setSelectedBreakSlots([]);

      // Reload data to reflect changes
      await loadData();
    } catch (error) {
      console.error("Error adding break:", error);
      let errorMessage = "Error adding break. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [
    selectedTimeSlots,
    selectedStylists,
    selectedBreakSlots,
    showNotification,
    loadData,
  ]);

  const handleQuickAddLeave = useCallback(async () => {
    if (selectedLeaveDays.length === 0 || selectedStylists.length === 0) {
      showNotification("Please select leave days and staff members", "error");
      return;
    }

    try {
      setLoading(true);

      // Create leave days for each selected stylist
      for (const dateStr of selectedLeaveDays) {
        for (const stylistId of selectedStylists) {
          await ApiService.createLeave({
            stylist_id: stylistId,
            date: dateStr,
            leave_start_time: `${dateStr}T00:00:00Z`,
            leave_end_time: `${dateStr}T23:59:59Z`,
          });
        }
      }

      showNotification(
        `Leave added successfully! ${selectedLeaveDays.length} day(s) marked for leave for ${selectedStylists.length} staff member(s).`,
        "success"
      );

      // Clear selections
      setSelectedLeaveDays([]);

      // Reload data to reflect changes
      await loadData();
    } catch (error) {
      console.error("Error adding leave:", error);
      let errorMessage = "Error adding leave. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [selectedLeaveDays, selectedStylists, showNotification, loadData]);

  // Schedule management
  const handleSaveSchedule = useCallback(async () => {
    try {
      setLoading(true);

      if (scheduleType === "leave") {
        // Save leave days
        for (const dateStr of selectedLeaveDays) {
          for (const stylistId of selectedStylists) {
            await ApiService.createLeave({
              stylist_id: stylistId,
              date: dateStr,
              leave_start_time: `${dateStr}T00:00:00Z`,
              leave_end_time: `${dateStr}T23:59:59Z`,
            });
          }
        }
        showNotification(
          `Leave saved! ${selectedLeaveDays.length} day(s) marked for leave.`
        );
        setSelectedLeaveDays([]);
      } else if (scheduleType === "break") {
        for (const stylistId of selectedStylists) {
          for (const dateStr of selectedBreakSlots) {
            const data = {
              stylist_id: stylistId,
              date: dateStr[2],
              leave_start_time: dateStr[0],
              leave_end_time: dateStr[1],
            };
            await ApiService.createLeave(data);
          }
        }
        showNotification(
          `Break saved! ${selectedBreakSlots.length} break(s) scheduled.`
        );
        setSelectedBreakSlots([]);
      } else {
        // Save schedule slots
        await ApiService.updateStylistSchedule(selectedStylists, {
          type: scheduleType,
          slots: selectedTimeSlots,
        });
        showNotification(
          `Schedule saved! ${selectedTimeSlots.length} time slot(s) marked as ${scheduleType}.`
        );
        setSelectedTimeSlots([]);
      }

      // Reload data to reflect changes
      await loadData();
    } catch (error) {
      let errorMessage = "Error saving schedule. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [
    scheduleType,
    selectedLeaveDays,
    selectedStylists,
    selectedBreakSlots,
    selectedTimeSlots,
    loadData,
    showNotification,
  ]);

  // Navigation
  const navigateDateRange = useCallback(
    (direction) => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + direction * maxDays);
      setSelectedDate(newDate);
    },
    [selectedDate, maxDays]
  );

  // Get appointments for display
  const getAppointmentsForDate = useCallback(
    (date, stylistId) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      return appointments.filter(
        (apt) => apt.date === dateStr && apt.stylistId === stylistId
      );
    },
    [appointments]
  );

  const getStylistById = useCallback(
    (id) => {
      return (
        stylists.find((s) => s.id === id) || {
          id,
          name: `Stylist ${id}`,
          color: COLORS.stylists[0],
          avatar: "👤",
        }
      );
    },
    [stylists]
  );

  const getServiceById = useCallback(
    (id) => {
      return (
        services.find((s) => s.id === id) || {
          id,
          name: "Unknown Service",
          duration: 30,
          price: 0,
        }
      );
    },
    [services]
  );

  // Helper function to get upcoming leaves
  const getUpcomingLeaves = useCallback(() => {
    const today = new Date();
    const localToday = formatDateToString(today);
    return leaves.filter((leave) => leave.date >= localToday);
  }, [leaves, formatDateToString]);

  // Helper function to handle leave selection for deletion
  const handleLeaveSelection = useCallback((leaveId) => {
    setSelectedLeavesToDelete((prev) => {
      if (prev.includes(leaveId)) {
        return prev.filter((id) => id !== leaveId);
      } else {
        return [...prev, leaveId];
      }
    });
  }, []);

  // Helper function to handle bulk leave deletion
  const handleDeleteSelectedLeaves = useCallback(async () => {
    if (selectedLeavesToDelete.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedLeavesToDelete.length} leave(s)?`
      )
    )
      return;

    try {
      setLoading(true);

      for (const leaveId of selectedLeavesToDelete) {
        const leave = leaves.find((l) => l.leave_id === leaveId);
        if (leave) {
          await ApiService.deleteLeave({
            stylist_id: leave.stylist_id,
            leave_id: leaveId,
          });
        }
      }

      setLeaves((prev) =>
        prev.filter((leave) => !selectedLeavesToDelete.includes(leave.leave_id))
      );
      setSelectedLeavesToDelete([]);
      showNotification(
        `Successfully deleted ${selectedLeavesToDelete.length} leave(s)!`
      );
    } catch (error) {
      console.error("Error deleting leaves:", error);
      showNotification("Error deleting leaves. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedLeavesToDelete, leaves, showNotification]);

  // Create stable props objects for child components
  const headerProps = useMemo(
    () => ({
      title: "Salon Scheduler",
      subtitle:
        "Unified scheduling system for appointments and staff schedules",
      COLORS,
      navigateDateRange,
      weekDates,
      maxDays,
      formatDate,
      setShowScheduleManagementPanel,
      setSelectedLeavesToDelete,
      handleAddAppointment,
    }),
    [navigateDateRange, weekDates, maxDays, formatDate, handleAddAppointment]
  );

  const filtersRowProps = useMemo(
    () => ({
      maxDays,
      setMaxDays,
      dayFilters,
      scheduleType,
      setScheduleType,
      setSelectedTimeSlots,
      setSelectedLeaveDays,
      scheduleTypes,
      stylists,
      selectedStylists,
      setSelectedStylists,
      handleStylistToggle,
      COLORS,
    }),
    [
      maxDays,
      dayFilters,
      scheduleType,
      scheduleTypes,
      stylists,
      selectedStylists,
      handleStylistToggle,
    ]
  );

  const selectionInfoProps = useMemo(
    () => ({
      selectedTimeSlots,
      selectedLeaveDays,
      scheduleType,
      COLORS,
      selectedStylists,
      stylists,
      onQuickAddBreak: handleQuickAddBreak,
      onQuickAddLeave: handleQuickAddLeave,
      loading,
    }),
    [
      selectedTimeSlots,
      selectedLeaveDays,
      scheduleType,
      selectedStylists,
      stylists,
      handleQuickAddBreak,
      handleQuickAddLeave,
      loading,
    ]
  );

  const daySelectionViewProps = useMemo(
    () => ({
      weekDates,
      isDaySelected,
      handleDayClick,
      COLORS,
      selectedLeaveDays,
      selectedStylists,
      onQuickAddLeave: handleQuickAddLeave,
      loading,
    }),
    [
      weekDates,
      isDaySelected,
      handleDayClick,
      selectedLeaveDays,
      selectedStylists,
      handleQuickAddLeave,
      loading,
    ]
  );

  const calendarViewProps = useMemo(
    () => ({
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
      displayHours,
      getSalonHoursForDate,
    }),
    [
      selectedStylists,
      selectedStylistsData,
      weekDates,
      stylists,
      appointments,
      isDragging,
      selectionActive,
      inHoldPeriod,
      handleMouseDown,
      handleTouchStart,
      isSlotSelected,
      hasLeaveOnDate,
      hasLeaveAtTimeSlot,
      isTimeSlotAvailable,
      getAppointmentsForDate,
      calculateSlotPosition,
      handleAppointmentClick,
      formatTime,
      formatDateToString,
      displayHours,
      getSalonHoursForDate,
    ]
  );

  const appointmentPanelProps = useMemo(
    () => ({
      showAddAppointmentPanel,
      setShowAddAppointmentPanel,
      isEditingAppointment,
      newAppointment,
      setNewAppointment,
      availableTimeSlots,
      setAvailableTimeSlots,
      loading,
      stylists,
      services,
      handleCheckAvailability,
      handleSaveAppointment,
      COLORS,
    }),
    [
      showAddAppointmentPanel,
      isEditingAppointment,
      newAppointment,
      availableTimeSlots,
      loading,
      stylists,
      services,
      handleCheckAvailability,
      handleSaveAppointment,
    ]
  );

  const appointmentDetailsPanelProps = useMemo(
    () => ({
      show: showAppointmentDetailsPanel,
      onClose: () => setShowAppointmentDetailsPanel(false),
      appointment: selectedAppointment,
      COLORS,
      getStylistById,
      getServiceById,
      handleDeleteAppointment,
      handleCompleteAppointment,
      loading,
    }),
    [
      showAppointmentDetailsPanel,
      selectedAppointment,
      getStylistById,
      getServiceById,
      handleDeleteAppointment,
      handleCompleteAppointment,
      loading,
    ]
  );

  const scheduleManagementPanelProps = useMemo(
    () => ({
      showScheduleManagementPanel,
      setShowScheduleManagementPanel,
      scheduleType,
      setScheduleType,
      scheduleTypes,
      selectedTimeSlots,
      selectedLeaveDays,
      selectedBreakSlots,
      selectedLeavesToDelete,
      setSelectedLeavesToDelete,
      selectedStylists,
      handleSaveSchedule,
      handleDeleteSelectedLeaves,
      handleLeaveSelection,
      getStylistById,
      getUpcomingLeaves,
      loading,
    }),
    [
      showScheduleManagementPanel,
      scheduleType,
      scheduleTypes,
      selectedTimeSlots,
      selectedLeaveDays,
      selectedBreakSlots,
      selectedLeavesToDelete,
      selectedStylists,
      handleSaveSchedule,
      handleDeleteSelectedLeaves,
      handleLeaveSelection,
      getStylistById,
      getUpcomingLeaves,
      loading,
    ]
  );

  const floatingActionButtonProps = useMemo(
    () => ({
      scheduleType,
      selectedTimeSlots,
      selectedLeaveDays,
      selectedStylists,
      onQuickAddBreak: handleQuickAddBreak,
      onQuickAddLeave: handleQuickAddLeave,
      onCancel: handleCancelSelection,
      loading,
      COLORS,
    }),
    [
      scheduleType,
      selectedTimeSlots,
      selectedLeaveDays,
      selectedStylists,
      handleQuickAddBreak,
      handleQuickAddLeave,
      handleCancelSelection,
      loading,
    ]
  );

  return (
    <div className="flex flex-col h-screen font-sans bg-gradient-to-br from-[#f0f4ff] to-[#e2e8ff]">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          COLORS={COLORS}
        />
      )}

      <div className="flex-1 flex flex-col bg-[#fcfcff] z-10 w-full">
        <div className="p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-lg border-b border-[#e0e0e8] shadow-sm shrink-0 w-full">
          <MemoizedHeader {...headerProps} />

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mt-6 w-full overflow-x-auto">
            <MemoizedFiltersRow {...filtersRowProps} />
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-[#fcfcff] z-10">
          <div className="bg-gray-50 border-b border-[#e0e0e8] p-5 md:p-8 shrink-0">
            <div className="flex justify-between items-center">
              <MemoizedSelectionInfo {...selectionInfoProps} />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <LoadingSpinner COLORS={COLORS} />
            ) : scheduleType === "leave" ? (
              <MemoizedDaySelectionView {...daySelectionViewProps} />
            ) : (
              <MemoizedCalendarView {...calendarViewProps} />
            )}
          </div>
        </div>

        <MemoizedAppointmentPanel {...appointmentPanelProps} />
        <MemoizedAppointmentDetailsPanel {...appointmentDetailsPanelProps} />
        <MemoizedScheduleManagementPanel {...scheduleManagementPanelProps} />
        <MemoizedFloatingActionButton {...floatingActionButtonProps} />
      </div>
    </div>
  );
};

export default SchedulingInterface;
