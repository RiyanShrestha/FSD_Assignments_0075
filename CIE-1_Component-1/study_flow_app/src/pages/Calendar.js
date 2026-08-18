import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FiChevronLeft, FiChevronRight, FiCalendar, FiClock, 
  FiCheckCircle, FiBookOpen, FiList
} from 'react-icons/fi';
import { tasksService, assignmentsService, coursesService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Calendar.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 18)); // August 2026 default
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 7, 18));

  const { showError } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, assignmentsData, coursesData] = await Promise.all([
        tasksService.getAll(),
        assignmentsService.getAll(),
        coursesService.getAll()
      ]);
      setTasks(tasksData);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      showError('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Combine tasks and assignments as calendar items
  const allEvents = useMemo(() => {
    const events = [];

    tasks.forEach(t => {
      if (t.dueDate) {
        events.push({
          id: `task-${t.id}`,
          title: t.title,
          type: 'task',
          date: new Date(t.dueDate),
          dateStr: t.dueDate.split('T')[0],
          completed: t.completed,
          priority: t.priority,
          courseId: t.courseId
        });
      }
    });

    assignments.forEach(a => {
      if (a.dueDate) {
        events.push({
          id: `assignment-${a.id}`,
          title: a.title,
          type: 'assignment',
          date: new Date(a.dueDate),
          dateStr: a.dueDate.split('T')[0],
          completed: a.completed || a.status === 'completed',
          priority: a.priority,
          courseId: a.courseId
        });
      }
    });

    return events;
  }, [tasks, assignments]);

  // Month navigation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date(2026, 7, 18);
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Calendar Days Grid Generation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const d = new Date(year, month - 1, dayNum);
      days.push({
        date: d,
        dayNum,
        isCurrentMonth: false,
        isPrevMonth: true,
        dateStr: d.toISOString().split('T')[0]
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        dayNum: i,
        isCurrentMonth: true,
        dateStr: d.toISOString().split('T')[0]
      });
    }

    // Next month padding to fill 6 rows (42 cells) or 35 cells
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        dayNum: i,
        isCurrentMonth: false,
        isNextMonth: true,
        dateStr: d.toISOString().split('T')[0]
      });
    }

    return days;
  }, [year, month]);

  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';

  const selectedDateEvents = useMemo(() => {
    if (!selectedDateStr) return [];
    return allEvents.filter(e => e.dateStr === selectedDateStr);
  }, [allEvents, selectedDateStr]);

  const getEventsForDate = (dateStr) => {
    return allEvents.filter(e => e.dateStr === dateStr);
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : null;
  };

  if (loading) return <LoadingSpinner fullPage text="Loading academic calendar..." />;

  return (
    <div className="calendar-page">
      <header className="page-header">
        <div>
          <h1>Academic Calendar</h1>
          <p className="page-subtitle">Interactive schedule for assignments, labs, milestones, and deadlines</p>
        </div>
      </header>

      <div className="calendar-container">
        {/* Main Calendar Month View */}
        <div className="calendar-main">
          <div className="calendar-header">
            <h2>{MONTH_NAMES[month]} {year}</h2>
            <div className="calendar-controls">
              <button className="btn-secondary today-btn" onClick={handleToday}>
                Today
              </button>
              <button className="nav-btn" onClick={handlePrevMonth} aria-label="Previous month">
                <FiChevronLeft />
              </button>
              <button className="nav-btn" onClick={handleNextMonth} aria-label="Next month">
                <FiChevronRight />
              </button>
            </div>
          </div>

          <div className="calendar-grid-header">
            {DAY_NAMES.map(day => (
              <div key={day} className="day-name">{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((item, idx) => {
              const dayEvents = getEventsForDate(item.dateStr);
              const isSelected = item.dateStr === selectedDateStr;
              const isToday = item.dateStr === '2026-08-18';

              return (
                <div
                  key={idx}
                  className={`calendar-cell ${!item.isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => setSelectedDate(item.date)}
                >
                  <div className="cell-header">
                    <span className={`day-number ${isToday ? 'today-badge' : ''}`}>{item.dayNum}</span>
                    {dayEvents.length > 0 && (
                      <span className="event-count-badge">{dayEvents.length}</span>
                    )}
                  </div>
                  <div className="cell-events">
                    {dayEvents.slice(0, 2).map((ev, eIdx) => (
                      <div
                        key={eIdx}
                        className={`event-tag event-type-${ev.type} ${ev.completed ? 'completed' : ''}`}
                        title={`${ev.title} (${ev.type})`}
                      >
                        <span className="event-dot"></span>
                        <span className="event-title-trunc">{ev.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="more-events">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Schedule for Selected Date */}
        <div className="calendar-sidebar">
          <div className="sidebar-date-header">
            <FiCalendar className="calendar-icon" />
            <div>
              <h3>
                {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'Select a date'}
              </h3>
              <span className="events-count-label">
                {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'Event' : 'Events'}
              </span>
            </div>
          </div>

          <div className="sidebar-events-list">
            {selectedDateEvents.length === 0 ? (
              <div className="no-events-day">
                <FiCheckCircle style={{ fontSize: '2rem', color: '#10b981', marginBottom: 8 }} />
                <p>No deadlines or tasks scheduled for this day.</p>
              </div>
            ) : (
              selectedDateEvents.map(event => {
                const courseName = getCourseName(event.courseId);
                return (
                  <div key={event.id} className={`sidebar-event-card ${event.completed ? 'completed' : ''}`}>
                    <div className="sidebar-event-type">
                      {event.type === 'task' ? <FiList /> : <FiBookOpen />}
                      <span>{event.type.toUpperCase()}</span>
                      <span className={`badge badge-priority-${event.priority || 'medium'}`} style={{ marginLeft: 'auto' }}>
                        {event.priority}
                      </span>
                    </div>

                    <h4 className="sidebar-event-title">{event.title}</h4>

                    {courseName && (
                      <span className="sidebar-event-course">{courseName}</span>
                    )}

                    <div className="sidebar-event-meta">
                      <FiClock />
                      <span>{event.completed ? 'Completed' : 'Pending deadline'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
