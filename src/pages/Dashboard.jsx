import { useState, useMemo } from "react";
import TaskForm from "../components/task/TaskForm";
import TaskList from "../components/task/TaskList";
import useTaskStore from "../store/useTaskStore";
import { motion } from "framer-motion";
import { FaFire, FaCalendar, FaClipboardList, FaClock   } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { toast } from "react-toast";
import usePageTitle from "../hooks/usePageTitle";

function Dashboard() {
  const tasks = useTaskStore((s) => s.tasks);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingTask, setEditingTask] = useState(null);

  // Memoize stats calculations to prevent infinite re-renders
  const completionStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed, percentage: total === 0 ? 0 : (completed / total) * 100 };
  }, [tasks]);

  const todayTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter((t) => new Date(t.createdAt).toDateString() === today);
  }, [tasks]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Category configuration
  const categoryConfig = {
    general: { icon: "📝", color: "text-gray-400" },
    work: { icon: "💼", color: "text-blue-400" },
    personal: { icon: "🎯", color: "text-green-400" },
    health: { icon: "💪", color: "text-red-400" },
    coding: { icon: "💻", color: "text-purple-400" },
    learning: { icon: "📚", color: "text-yellow-400" },
  };

  // Get unique categories for filter
  const categories = useMemo(() => {
    const predefinedCategories = ["general", "work", "personal", "health", "coding", "learning"];
    const taskCategories = new Set(tasks.map((t) => t.category));
    return Array.from(new Set([...predefinedCategories, ...taskCategories]));
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filterCategory !== "all") {
      result = result.filter((t) => t.category === filterCategory);
    }
    if (filterStatus !== "all") {
      result = result.filter((t) => filterStatus === "completed" ? t.completed : !t.completed);
    }
    return result.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });
  }, [tasks, filterCategory, filterStatus]);

  usePageTitle("Dashboard");

  // Get stats
  const totalTodayTasks = todayTasks.length;
  const completedTodayTasks = todayTasks.filter((t) => t.completed).length;

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <FaClipboardList className="text-purple-400" />
                My Tasks
              </h1>
              <p className="text-gray-300">
                {completionStats.percentage.toFixed(0)}% complete • {completionStats.completed}/{completionStats.total} tasks
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Today Tasks */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:border-blue-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Today's Tasks</p>
                <h3 className="text-2xl font-bold text-white mt-1">{todayTasks.length}</h3>
              </div>
              <FaCalendar className="text-3xl text-blue-400 opacity-50" />
            </div>
          </div>

          {/* Total Pomodoro */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:border-orange-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Pomodoros</p>
                <h3 className="text-2xl font-bold text-orange-400 mt-1">
                  {tasks.reduce((acc, t) => acc + (t.pomodoroSessions || 0), 0)}
                </h3>
              </div>
              <span className="text-3xl">🍅</span>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:border-green-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Progress</p>
                <h3 className="text-2xl font-bold text-green-400 mt-1">
                  {completionStats.percentage.toFixed(0)}%
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add Task Form */}
        <motion.div variants={itemVariants} className="mb-8">
          <TaskForm editingTask={editingTask} setEditingTask={setEditingTask} />
        </motion.div>

        {/* Status Filter */}
        <motion.div variants={itemVariants} className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              filterStatus === "all"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              filterStatus === "pending"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              filterStatus === "completed"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Completed
          </button>
        </motion.div>

        {/* Category Filter */}
        <motion.div variants={itemVariants} className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              filterCategory === "all"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const config = categoryConfig[cat] || { icon: "📝", color: "text-gray-400" };
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full font-semibold transition-all capitalize flex items-center gap-2 ${
                  filterCategory === cat
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <span>{config.icon}</span>
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Tasks List */}
        <motion.div variants={itemVariants}>
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              {filteredTasks.length === 0 ? " No tasks yet!" : "Tasks"}
            </h2>
            <div className="space-y-4">
              <TaskList tasks={filteredTasks} setEditingTask={setEditingTask} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default Dashboard;
