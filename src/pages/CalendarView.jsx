import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTaskStore from "../store/useTaskStore";
import TaskCard from "../components/task/TaskCard";
import { FaChevronLeft, FaChevronRight, FaCalendar } from "react-icons/fa";
import usePageTitle from "../hooks/usePageTitle";

function CalendarView() {
  const tasks = useTaskStore((s) => s.tasks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get calendar days
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDaysArray = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [currentDate]);

  // Get tasks for selected date
  const tasksForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateString = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      selectedDate
    ).toDateString();
    return tasks.filter(
      (t) => new Date(t.createdAt).toDateString() === dateString
    );
  }, [selectedDate, currentDate, tasks]);

  // Get task count for each day
  const getTaskCountForDay = (day) => {
    if (!day) return 0;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toDateString();
    return tasks.filter((t) => new Date(t.createdAt).toDateString() === dateString).length;
  };

  const getCompletedCountForDay = (day) => {
    if (!day) return 0;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toDateString();
    return tasks.filter(
      (t) => new Date(t.createdAt).toDateString() === dateString && t.completed
    ).length;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  usePageTitle("Calendar");

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
          <FaCalendar className="text-purple-400" />
          Calendar View
        </h1>
        <p className="text-gray-300">View and manage your tasks by date</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
        >
          {/* Month Header */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <FaChevronLeft className="text-white text-xl" />
            </motion.button>

            <h2 className="text-2xl font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <FaChevronRight className="text-white text-xl" />
            </motion.button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-gray-400 font-semibold text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysArray.map((day, index) => {
              const taskCount = getTaskCountForDay(day);
              const completedCount = getCompletedCountForDay(day);
              const isSelected = selectedDate === day && day !== null;

              return (
                <motion.button
                  key={index}
                  whileHover={day !== null ? { scale: 1.05 } : {}}
                  whileTap={day !== null ? { scale: 0.95 } : {}}
                  onClick={() => day !== null && setSelectedDate(day)}
                  disabled={day === null}
                  className={`aspect-square rounded-xl font-semibold transition-all relative overflow-hidden ${
                    day === null
                      ? "cursor-default"
                      : isSelected
                      ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                      : taskCount > 0
                      ? "bg-white/20 hover:bg-white/30 text-white"
                      : "bg-white/5 hover:bg-white/10 text-gray-400"
                  }`}
                >
                  {day !== null && (
                    <>
                      <span className="text-lg font-bold">{day}</span>
                      {taskCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute bottom-1 right-1 flex gap-0.5"
                        >
                          {completedCount > 0 && (
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                          )}
                          {taskCount - completedCount > 0 && (
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                          )}
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-white/10 flex gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full" />
              <span>Pending</span>
            </div>
          </div>
        </motion.div>

        {/* Task Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-fit sticky top-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {selectedDate ? (
              <>
                📅 {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
              </>
            ) : (
              "Select a date"
            )}
          </h3>

          <AnimatePresence mode="wait">
            {selectedDate ? (
              tasksForSelectedDate.length > 0 ? (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 max-h-96 overflow-y-auto"
                >
                  {tasksForSelectedDate.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border transition-all ${
                        task.completed
                          ? "bg-green-500/20 border-green-500/30"
                          : "bg-white/10 border-white/20"
                      }`}
                    >
                      <p className={task.completed ? "line-through text-gray-400" : "text-white font-semibold"}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {task.category} • {task.priority}
                      </p>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <p className="text-gray-400">✨ No tasks for this day</p>
                  <p className="text-xs text-gray-500 mt-2">Great time to relax!</p>
                </motion.div>
              )
            ) : (
              <motion.div
                key="select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <p className="text-gray-400">👈 Select a date to view tasks</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CalendarView;
