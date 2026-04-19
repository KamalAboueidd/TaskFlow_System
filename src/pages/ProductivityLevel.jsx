import { motion } from 'framer-motion';
import { useMemo } from 'react';
import useTaskStore from '../store/useTaskStore';
import { FaTrophy, FaStar, FaMedal, FaAward, FaCheckCircle, FaFire } from 'react-icons/fa';
import TaskCard from '../components/task/TaskCard';
import usePageTitle from '../hooks/usePageTitle';

function ProductivityLevel() {
  usePageTitle('Productivity Level');

  const tasks = useTaskStore((s) => s.tasks);

  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  const productivityStats = useMemo(() => {
    const total = tasks.length;
    const completed = completedTasks.length;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Calculate productivity score based on various factors
    const baseScore = completionRate;
    const highPriorityBonus = tasks.filter((t) => t.priority === 'high' && t.completed).length * 10;
    const recentBonus = tasks.filter((t) => {
      const taskDate = new Date(t.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return taskDate >= weekAgo && t.completed;
    }).length * 5;

    const productivityScore = Math.min(100, baseScore + highPriorityBonus + recentBonus);

    let level = 'Starter';
    let levelColor = 'text-gray-400';
    let levelIcon = FaStar;

    if (productivityScore >= 90) {
      level = 'Master';
      levelColor = 'text-yellow-400';
      levelIcon = FaTrophy;
    } else if (productivityScore >= 75) {
      level = 'Expert';
      levelColor = 'text-purple-400';
      levelIcon = FaAward;
    } else if (productivityScore >= 60) {
      level = 'Pro';
      levelColor = 'text-blue-400';
      levelIcon = FaMedal;
    } else if (productivityScore >= 40) {
      level = 'Good';
      levelColor = 'text-green-400';
      levelIcon = FaFire;
    }

    return {
      total,
      completed,
      completionRate,
      productivityScore,
      level,
      levelColor,
      levelIcon,
      highPriorityCompleted: tasks.filter((t) => t.priority === 'high' && t.completed).length,
      recentCompleted: tasks.filter((t) => {
        const taskDate = new Date(t.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return taskDate >= weekAgo && t.completed;
      }).length
    };
  }, [tasks, completedTasks]);

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <productivityStats.levelIcon className={`text-4xl ${productivityStats.levelColor}`} />
          Productivity Level
        </h1>
        <p className="text-gray-300">Track your productivity journey and achievements</p>
      </motion.div>

      {/* Level Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8"
      >
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4`}>
            <productivityStats.levelIcon className="text-4xl text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${productivityStats.levelColor}`}>
            {productivityStats.level}
          </h2>
          <p className="text-gray-300 mb-4">Productivity Score: {productivityStats.productivityScore}/100</p>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{productivityStats.productivityScore}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${productivityStats.productivityScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Tasks</p>
              <h3 className="text-3xl font-bold text-white mt-2">{productivityStats.total}</h3>
            </div>
            <FaCheckCircle className="text-4xl text-blue-400 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Completed</p>
              <h3 className="text-3xl font-bold text-green-400 mt-2">{productivityStats.completed}</h3>
              <p className="text-xs text-gray-400 mt-1">{productivityStats.completionRate}% rate</p>
            </div>
            <FaTrophy className="text-4xl text-green-400 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">High Priority</p>
              <h3 className="text-3xl font-bold text-red-400 mt-2">{productivityStats.highPriorityCompleted}</h3>
              <p className="text-xs text-gray-400 mt-1">Completed</p>
            </div>
            <FaFire className="text-4xl text-red-400 opacity-50" />
          </div>
        </motion.div>
      </div>

      {/* Recent Achievements */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productivityStats.recentCompleted > 0 && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-400 text-2xl" />
                <div>
                  <h3 className="text-white font-semibold">Weekly Warrior</h3>
                  <p className="text-green-300 text-sm">Completed {productivityStats.recentCompleted} tasks this week</p>
                </div>
              </div>
            </div>
          )}

          {productivityStats.completionRate >= 50 && (
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <FaMedal className="text-blue-400 text-2xl" />
                <div>
                  <h3 className="text-white font-semibold">Consistency King</h3>
                  <p className="text-blue-300 text-sm">{productivityStats.completionRate}% completion rate</p>
                </div>
              </div>
            </div>
          )}

          {productivityStats.highPriorityCompleted > 0 && (
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <FaAward className="text-purple-400 text-2xl" />
                <div>
                  <h3 className="text-white font-semibold">Priority Master</h3>
                  <p className="text-purple-300 text-sm">Completed {productivityStats.highPriorityCompleted} high-priority tasks</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Completed Tasks List */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-white mb-4">Your Completed Tasks</h2>
        {completedTasks.length > 0 ? (
          <div className="space-y-4">
            {completedTasks.slice(0, 10).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {completedTasks.length > 10 && (
              <p className="text-center text-gray-400 text-sm mt-4">
                And {completedTasks.length - 10} more completed tasks...
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaCheckCircle className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No completed tasks yet</h3>
            <p className="text-gray-500">Start completing tasks to see your productivity level grow!</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ProductivityLevel;