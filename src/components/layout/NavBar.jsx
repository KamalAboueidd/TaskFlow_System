import { motion } from 'framer-motion';
import useTaskStore from '../../store/useTaskStore';
import useUserStore from "../../store/useUserStore";
import { FaProjectDiagram, FaChartLine, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

function Navbar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const userName = useUserStore((s) => s.userName);
  const tasks = useTaskStore((s) => s.tasks);
  const [showProductivity, setShowProductivity] = useState(false);
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  const completed = tasks.filter((task) => task.completed).length;
  const total = tasks.length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  const baseScore = completionRate;
  const highPriorityBonus = tasks.filter((task) => task.priority === 'high' && task.completed).length * 10;
  const recentBonus = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return taskDate >= weekAgo && task.completed;
  }).length * 5;
  const productivityScore = Math.min(100, baseScore + highPriorityBonus + recentBonus);
  const productivityLevel = productivityScore >= 90 ? 'Master' : productivityScore >= 75 ? 'Expert' : productivityScore >= 60 ? 'Pro' : productivityScore >= 40 ? 'Good' : 'Starter';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-4 md:px-6 py-4 md:py-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-white/10 flex justify-between items-center sticky top-0 z-40"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 md:gap-3 flex-shrink-0"
        >
          <FaProjectDiagram className="hidden md:block text-2xl mb-3 md:text-3xl text-purple-400" />
          <div className="text-left md:text-center">
            <h1 className="font-bold text-lg md:text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-xs text-gray-400 hidden md:block">Smart Task Manager</p>
            {/* Mobile Menu Button */}
            <div className="md:hidden mt-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? <FaTimes className="text-white text-lg" /> : <FaBars className="text-white text-lg" />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-end gap-1"
        >
          <p className="text-white text-sm md:text-base font-semibold">
            Welcome, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{userName || "Guest"}</span>
          </p>
          <p className="text-xs md:text-sm text-gray-400">{today}</p>
        </motion.div>
      </motion.div>

      {/* Mobile Menu Overlay and Sidebar */}
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </>
      )}

      {/* Floating Productivity Level Badge - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden md:block fixed top-[5.5rem] right-4 z-40"
        onMouseEnter={() => setShowProductivity(true)}
        onMouseLeave={() => setShowProductivity(false)}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-2.5 py-2 text-[10px] sm:text-xs text-white hover:bg-white/25 transition-all shadow-lg backdrop-blur-xl"
          type="button"
        >
          <FaChartLine className="text-teal-300" />
          <span className="hidden sm:inline">{productivityLevel}</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={showProductivity ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`absolute right-0 mt-2 w-56 md:w-64 rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl ${
            showProductivity ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <p className="text-xs uppercase text-gray-400 tracking-[0.2em] mb-3">Productivity Overview</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Completion rate</span>
            <span className="text-white font-semibold">{completionRate}%</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Score</span>
            <span className="text-white font-semibold">{productivityScore}</span>
          </div>
          <div className="py-2 px-3 rounded-xl bg-white/5">
            <p className="text-xs text-gray-400">Level</p>
            <p className="text-white font-semibold">{productivityLevel}</p>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default Navbar;