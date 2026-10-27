
import { useState, useEffect } from "react";

const categories = ["School", "Personal", "Work"];
const priorities = ["High", "Medium", "Low"];
const priorityOrder = { High: 0, Medium: 1, Low: 2 };

const priorityStyles = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-emerald-50 text-emerald-700",
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function getDateFromToday(n) {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return formatDate(date);
}

function getDaysLeft(deadline) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline + "T00:00:00");
  return Math.round((due - today) / (1000 * 60 * 60 * 24));
}

function getDeadlineText(deadline) {
  const days = getDaysLeft(deadline);
  if (days < 0) return Math.abs(days) + " day(s) overdue";
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return days + " days left";
}

function prettyDate(deadline) {
  const date = new Date(deadline + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("School");
  const [priority, setPriority] = useState("Medium");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("deadline");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const resetForm = () => {
    setTitle("");
    setDeadline("");
    setCategory("School");
    setPriority("Medium");
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === "") {
      setError("Please enter a task title.");
      return;
    }
    if (deadline === "") {
      setError("Please choose a deadline.");
      return;
    }

    if (editingId) {
      const updated = tasks.map((task) =>
        task.id === editingId
          ? { ...task, title: title.trim(), deadline, category, priority }
          : task
      );
      setTasks(updated);
    } else {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        deadline,
        category,
        priority,
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }

    resetForm();
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    if (!window.confirm("Delete this task?")) return;
    setTasks(tasks.filter((task) => task.id !== id));
    if (editingId === id) resetForm();
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDeadline(task.deadline);
    setCategory(task.category);
    setPriority(task.priority || "Medium");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearCompleted = () => {
    if (!window.confirm("Remove all completed tasks?")) return;
    setTasks(tasks.filter((task) => !task.completed));
  };

  const visibleTasks = tasks
    .filter((task) => {
      if (filter === "active" && task.completed) return false;
      if (filter === "done" && !task.completed) return false;
      if (categoryFilter !== "All" && task.category !== categoryFilter)
        return false;
      if (!task.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      if (sortBy === "priority") {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === "newest") {
        return b.id - a.id;
      }
      return a.deadline.localeCompare(b.deadline);
    });

  const total = tasks.length;
  const doneCount = tasks.filter((task) => task.completed).length;
  const activeCount = total - doneCount;
  const overdueCount = tasks.filter(
    (task) => !task.completed && getDaysLeft(task.deadline) < 0
  ).length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  const filters = [
    { value: "all", label: "All", count: total },
    { value: "active", label: "Active", count: activeCount },
    { value: "done", label: "Done", count: doneCount },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <header className="mb-6">
          <p className="text-sm text-stone-500">{today}</p>
          <h1 className="text-3xl font-semibold mt-1">My Tasks</h1>
        </header>

        <section className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 mb-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-semibold">{activeCount}</p>
              <p className="text-xs text-stone-500">To do</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{doneCount}</p>
              <p className="text-xs text-stone-500">Completed</p>
            </div>
            <div>
              <p
                className={
                  "text-2xl font-semibold " +
                  (overdueCount > 0 ? "text-red-600" : "")
                }
              >
                {overdueCount}
              </p>
              <p className="text-xs text-stone-500">Overdue</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-stone-500 mb-1">
              <span>Progress</span>
              <span>{percent}%</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: percent + "%" }}
              ></div>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 mb-6"
        >
          <h2 className="text-sm font-medium mb-3">
            {editingId ? "Edit task" : "Add a new task"}
          </h2>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-600"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div>
              <label className="block text-xs text-stone-500 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-600"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-stone-500">Quick set:</span>
            <button
              type="button"
              onClick={() => setDeadline(getDateFromToday(0))}
              className="text-xs px-2.5 py-1 rounded-full border border-stone-300 hover:bg-stone-100"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDeadline(getDateFromToday(1))}
              className="text-xs px-2.5 py-1 rounded-full border border-stone-300 hover:bg-stone-100"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setDeadline(getDateFromToday(7))}
              className="text-xs px-2.5 py-1 rounded-full border border-stone-300 hover:bg-stone-100"
            >
              Next week
            </button>
          </div>

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              {editingId ? "Save changes" : "Add task"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-600"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-600"
          >
            <option value="All">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-600"
          >
            <option value="deadline">Sort by deadline</option>
            <option value="priority">Sort by priority</option>
            <option value="newest">Sort by newest</option>
          </select>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={
                  "text-sm px-3 py-1.5 rounded-lg " +
                  (filter === f.value
                    ? "bg-stone-800 text-white"
                    : "text-stone-600 hover:bg-stone-200")
                }
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          {doneCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs text-stone-500 hover:text-red-600"
            >
              Clear done
            </button>
          )}
        </div>

        {visibleTasks.length === 0 ? (
          <div className="text-center text-sm text-stone-500 border border-dashed border-stone-300 rounded-xl py-12">
            {total === 0
              ? "No tasks yet. Add your first one above."
              : "No tasks match your search or filter."}
          </div>
        ) : (
          <ul className="space-y-2">
            {visibleTasks.map((task) => {
              const days = getDaysLeft(task.deadline);
              const isOverdue = !task.completed && days < 0;
              const isSoon = !task.completed && days >= 0 && days <= 2;

              let deadlineColor = "text-stone-500";
              if (isOverdue) deadlineColor = "text-red-600";
              else if (isSoon) deadlineColor = "text-amber-600";

              return (
                <li
                  key={task.id}
                  className={
                    "bg-white border rounded-xl p-3 sm:p-4 flex items-start gap-3 " +
                    (isOverdue ? "border-red-200" : "border-stone-200")
                  }
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 h-4 w-4 accent-indigo-600"
                  />

                  <div className="flex-1 min-w-0">
                    <p
                      className={
                        "text-sm font-medium break-words " +
                        (task.completed ? "line-through text-stone-400" : "")
                      }
                    >
                      {task.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-1.5">
                      <span
                        className={
                          "px-2 py-0.5 rounded-full " +
                          priorityStyles[task.priority || "Medium"]
                        }
                      >
                        {task.priority || "Medium"}
                      </span>
                      <span className="text-stone-500">{task.category}</span>
                      <span className="text-stone-500">
                        {prettyDate(task.deadline)}
                      </span>
                      {!task.completed && (
                        <span className={deadlineColor}>
                          {getDeadlineText(task.deadline)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 text-xs">
                    <button
                      onClick={() => startEdit(task)}
                      className="text-stone-500 hover:text-indigo-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-stone-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Tasks;
