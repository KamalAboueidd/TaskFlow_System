import { motion } from 'framer-motion';
import useTaskStore from '../store/useTaskStore';
import { FaCheckCircle, FaTrophy } from 'react-icons/fa';
import TaskCard from '../components/task/TaskCard';
import { useMemo } from 'react';
import usePageTitle from '../hooks/usePageTitle';

function History() {
  const tasks = useTaskStore((s) => s.tasks);

  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  const completionStats = useMemo(() => {
    const total = tasks.length;
    const completed = completedTasks.length;
    return { total, completed, percentage: total === 0 ? 0 : (completed / total) * 100 };
  }, [tasks, completedTasks]);

  usePageTitle("History");

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8"
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <FaCheckCircle className="text-green-400" />
          Completed Tasks
        </h1>
        <p className="text-gray-300">Your achievement history and progress</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-green-400/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Completed</p>
              <h3 className="text-3xl font-bold text-green-400 mt-2">{completedTasks.length}</h3>
            </div>
            <FaCheckCircle className="text-4xl text-green-400 opacity-50" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-blue-400/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Completion Rate</p>
              <h3 className="text-3xl font-bold text-blue-400 mt-2">{completionStats.percentage.toFixed(0)}%</h3>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-yellow-400/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Achievement Level</p>
              <h3 className="text-3xl font-bold text-yellow-400 mt-2">
                {completionStats.completed >= 10 ? "🏆 Master" : completionStats.completed >= 5 ? "⭐ Pro" : "🌟 Starter"}
              </h3>
            </div>
            <FaTrophy className="text-4xl text-yellow-400 opacity-50" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">📈 Achievements by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(tasksByCategory).length > 0 ? (
            Object.entries(tasksByCategory).map(([category, categoryTasks]) => {
              const completed = categoryTasks.filter((t) => t.completed).length;
              return (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
                >
                  <p className="text-gray-300 text-sm capitalize font-semibold">{category}</p>
                  <div className="mt-3 flex items-end gap-2">
                    <h3 className="text-2xl font-bold text-purple-400">{completed}</h3>
                    <p className="text-gray-400 text-sm">/ {categoryTasks.length}</p>
                  </div>
                  <div className="mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(completed / categoryTasks.length) * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-gray-400 col-span-full text-center">No tasks yet</p>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-bold text-white mb-4">✓ All Completed Tasks</h2>
        {completedTasks.length > 0 ? (
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            <p className="text-gray-400 text-lg">🎯 No completed tasks yet</p>
            <p className="text-gray-500 text-sm mt-2">Start completing tasks to see them here!</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default History;
