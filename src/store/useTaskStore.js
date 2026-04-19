import { create } from "zustand";
import { persist } from "zustand/middleware";

// Smart task intelligence function
const analyzeTask = (title) => {
  const codingKeywords = ["code", "react", "javascript", "debug", "fix", "build", "develop"];
  const workKeywords = ["meeting", "email", "report", "presentation", "call", "review"];
  const healthKeywords = ["exercise", "gym", "run", "yoga", "walk", "diet", "sleep"];
  const personalKeywords = ["shopping", "clean", "cook", "buy", "laundry", "organize"];

  const lowerTitle = title.toLowerCase();

  let category = "general";
  let priority = "medium";
  let icon = "📝";
  let estimatedTime = "1h";

  if (codingKeywords.some((kw) => lowerTitle.includes(kw))) {
    category = "coding";
    icon = "💻";
    priority = lowerTitle.includes("fix") || lowerTitle.includes("bug") ? "high" : "medium";
    estimatedTime = lowerTitle.includes("project") ? "4h" : "2h";
  } else if (workKeywords.some((kw) => lowerTitle.includes(kw))) {
    category = "work";
    icon = "💼";
    priority = "high";
    estimatedTime = "1h";
  } else if (healthKeywords.some((kw) => lowerTitle.includes(kw))) {
    category = "health";
    icon = "💪";
    priority = "high";
    estimatedTime = "1h";
  } else if (personalKeywords.some((kw) => lowerTitle.includes(kw))) {
    category = "personal";
    icon = "🎯";
    priority = "low";
    estimatedTime = "30m";
  }

  // Priority detection
  if (lowerTitle.includes("urgent") || lowerTitle.includes("asap")) {
    priority = "high";
  } else if (lowerTitle.includes("later") || lowerTitle.includes("maybe")) {
    priority = "low";
  }

  return { category, priority, icon, estimatedTime };
};

const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task) => {
        const analyzed = analyzeTask(task.title);
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: Date.now(),
              completed: false,
              createdAt: new Date().toISOString(),
              pomodoroSessions: 0,
              pomodoroCompleted: 0,
              subtasks: [],
              ...analyzed,
              ...task,
            },
          ],
        }));
      },

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      editTask: (id, newData) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...newData } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      updatePomodoroSession: (id, sessions) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, pomodoroSessions: sessions } : t
          ),
        })),

      updateTaskPriority: (id, priority) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, priority } : t
          ),
        })),

      reorderTasks: (newOrder) => set({ tasks: newOrder }),

      getCompletionStats: () => {
        const state = get();
        const total = state.tasks.length;
        const completed = state.tasks.filter((t) => t.completed).length;
        return { total, completed, percentage: total === 0 ? 0 : (completed / total) * 100 };
      },

      getTasksByCategory: () => {
        const state = get();
        const categories = {};
        state.tasks.forEach((task) => {
          if (!categories[task.category]) {
            categories[task.category] = [];
          }
          categories[task.category].push(task);
        });
        return categories;
      },

      getTasksByDate: (date) => {
        const state = get();
        return state.tasks.filter(
          (t) => new Date(t.createdAt).toDateString() === new Date(date).toDateString()
        );
      },

      getTodayTasks: () => {
        const state = get();
        const today = new Date().toDateString();
        return state.tasks.filter((t) => new Date(t.createdAt).toDateString() === today);
      },

      getHighPriorityTasks: () => {
        const state = get();
        return state.tasks.filter((t) => !t.completed && t.priority === "high");
      },
    }),
    {
      name: "task-storage",
    }
  )
);

export default useTaskStore;