import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useTaskStore from '../store/useTaskStore';
import { FaFire, FaCheckCircle, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import usePageTitle from '../hooks/usePageTitle';

function Analytics() {
  const tasks = useTaskStore((s) => s.tasks);

  // Memoize stats calculations to prevent infinite re-renders
  const completionStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed, percentage: total === 0 ? 0 : (completed / total) * 100 };
  }, [tasks]);

  const tasksByCategory = useMemo(() => {
    const categories = {};
    tasks.forEach((task) => {
      if (!categories[task.category]) {
        categories[task.category] = [];
      }
      categories[task.category].push(task);
    });
    return categories;
  }, [tasks]);

  // Prepare chart data
  const chartData = Object.entries(tasksByCategory).map(([category, tasks]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
  }));

  const pieData = [
    { name: 'Completed', value: completionStats.completed },
    { name: 'Pending', value: completionStats.total - completionStats.completed },
  ];

  const COLORS = ['#8b5cf6', '#ec4899'];

  // Weekly activity data (mock)
  const weeklyData = [
    { day: 'Mon', tasks: 5 },
    { day: 'Tue', tasks: 8 },
    { day: 'Wed', tasks: 3 },
    { day: 'Thu', tasks: 7 },
    { day: 'Fri', tasks: 9 },
    { day: 'Sat', tasks: 4 },
    { day: 'Sun', tasks: 2 },
  ];

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

  // Productivity score calculation
  usePageTitle("Analytics");

  const productivityScore = Math.round(
    (completionStats.completed / Math.max(completionStats.total, 1)) * 100 + 
    (tasks.filter((t) => t.priority === 'high' && t.completed).length * 10)
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">📊 Analytics Dashboard</h1>
        <p className="text-gray-300">Track your productivity and progress</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Tasks */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Tasks</p>
              <h3 className="text-3xl font-bold text-white mt-2">{completionStats.total}</h3>
            </div>
            <FaCalendarAlt className="text-4xl text-blue-400 opacity-50" />
          </div>
        </motion.div>

        {/* Completed */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Completed</p>
              <h3 className="text-3xl font-bold text-green-400 mt-2">{completionStats.completed}</h3>
              <p className="text-xs text-gray-400 mt-1">{Math.round(completionStats.percentage)}%</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-400 opacity-50" />
          </div>
        </motion.div>

        {/* Productivity Score */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Productivity Score</p>
              <h3 className="text-3xl font-bold text-purple-400 mt-2">{productivityScore}%</h3>
            </div>
            <FaTrophy className="text-4xl text-purple-400 opacity-50" />
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Current Streak</p>
              <h3 className="text-3xl font-bold text-red-400 mt-2">{Math.floor(completionStats.completed / 3)}🔥</h3>
            </div>
            <FaFire className="text-4xl text-red-400 opacity-50" />
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Tasks by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff80" />
              <YAxis stroke="#ffffff80" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              />
              <Bar dataKey="completed" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="total" stackId="a" fill="#ec4899" opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Completion Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:col-span-2"
        >
          <h2 className="text-xl font-bold text-white mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="day" stroke="#ffffff80" />
              <YAxis stroke="#ffffff80" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Analytics;
