import { FaHome, FaHistory, FaChartLine, FaCalendar, FaCog, FaSignOutAlt, FaBars, FaTimes, FaTrophy, FaGamepad, FaClock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "../../store/useUserStore";
import { useToast } from "../Ui/ToastProvider";
import { useState } from "react";

function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const setUserName = useUserStore((s) => s.setUserName);
  const { showToast } = useToast();

  const menuItems = [
    { label: "Dashboard", icon: FaHome, path: "/app/dashboard", color: "from-blue-500 to-cyan-500" },
    { label: "Productivity Level", icon: FaTrophy, path: "/app/productivity", color: "from-yellow-500 to-orange-500" },
    { label: "Pomodoro Study", icon: FaClock, path: "/app/pomodoro", color: "from-red-500 to-orange-500" },
    { label: "Calendar", icon: FaCalendar, path: "/app/calendar", color: "from-purple-500 to-pink-500" },
    { label: "Analytics", icon: FaChartLine, path: "/app/analytics", color: "from-orange-500 to-red-500" },
     { label: "Games", icon: FaGamepad, path: "/app/games", color: "from-purple-500 to-pink-500" },
    { label: "History", icon: FaHistory, path: "/app/history", color: "from-green-500 to-emerald-500" },
    { label: "Settings", icon: FaCog, path: "/app/settings", color: "from-gray-500 to-slate-500" },
  ];

  const handleLogout = () => {
    setUserName("");
    navigate("/");
    showToast("Logged out successfully", "success");
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* Mobile Menu Button - Removed, using NavBar toggle */}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.3 }
        }}
        className={`w-72 md:w-64 bg-gradient-to-b from-purple-900/90 to-blue-900/90 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col ${
          isMobileMenuOpen
            ? 'fixed top-20 left-4 h-[calc(100vh-96px)] rounded-r-3xl shadow-2xl z-[100]'
            : 'hidden md:sticky md:top-20 md:h-[calc(100vh-80px)] md:flex'
        }`}
      >
        {/* Close Button for Mobile */}
        {isMobileMenuOpen && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="self-end mb-4 p-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
          >
            <FaTimes className="text-white text-lg" />
          </motion.button>
        )}
        {/* Menu Items */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2 flex-1"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.li key={item.path} variants={itemVariants}>
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMenuClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold whitespace-nowrap overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <Icon className="text-lg flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Divider */}
        <div className="my-4 border-t border-white/10" />

        {/* Bottom Menu */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
          <motion.button
            variants={itemVariants}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 transition-all font-semibold"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
}

export default Sidebar;