import TaskCard from "./TaskCard";
import useTaskStore from "../../store/useTaskStore";
import { motion } from "framer-motion";

function TaskList({ tasks = null, setEditingTask }) {
  const storeTasks = useTaskStore((s) => s.tasks);
  const taskList = tasks || storeTasks;

  if (taskList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-400 mt-10 py-8"
      >
        <p className="text-lg">🚀 No tasks... time to relax!</p>
        <p className="text-sm mt-2">Add your first task to get started</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-4 mt-6"
    >
      {taskList.map((task) => (
        <TaskCard key={task.id} task={task} setEditingTask={setEditingTask} />
      ))}
    </motion.div>
  );
}

export default TaskList;
