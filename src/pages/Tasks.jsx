import { useState } from "react";
import TaskForm from "../components/TaskForm.jsx";
import TaskItem from "../components/TaskItem.jsx";

const dropdownStyle =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-black [color-scheme:light] focus:border-[#007AFF] focus:ring-2 focus:ring-blue-200 focus:outline-none";


const priorityOrder = { High: 0, Medium: 1, Low: 2 };

function Tasks({ tasks, groups, onAddTask, onUpdateTask, onToggle, onDelete, onClearDone }) {
  const [editingTask, setEditingTask] = useState(null); // the task being edited
  const [filter, setFilter] = useState("all"); // all, active or done
  const [groupFilter, setGroupFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  
  let firstGroupId = "";
  if (groups.length > 0) {
    firstGroupId = groups[0].id;
  }

  
  function handleSave(data) {
    if (editingTask) {
      onUpdateTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      onAddTask(data);
    }
  }

  function startEdit(task) {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    onDelete(id);
    
    if (editingTask && editingTask.id === id) {
      setEditingTask(null);
    }
  }

  function getGroupName(groupId) {
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      return group.name;
    } else {
      return "";
    }
  }

  const todayText = new Date().toLocaleDateString("en-CA");
  const total = tasks.length;
  const doneCount = tasks.filter((task) => task.done === true).length;
  const activeCount = total - doneCount;
  const overdueCount = tasks.filter(
    (task) => task.done === false && task.deadline < todayText
  ).length;

  let percent = 0;
  if (total > 0) {
    percent = Math.round((doneCount / total) * 100);
  }


  const visibleTasks = [];
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    let show = true;

    if (filter === "active" && task.done === true) {
      show = false;
    }
    if (filter === "done" && task.done === false) {
      show = false;
    }
    if (groupFilter !== "all" && task.groupId !== groupFilter) {
      show = false;
    }
    if (!task.title.toLowerCase().includes(search.toLowerCase())) {
      show = false;
    }

    if (show) {
      visibleTasks.push(task);
    }
  }

  
  function sortTasks(a, b) {
    // finished tasks go to the bottom
    if (a.done !== b.done) {
      if (a.done) {
        return 1;
      } else {
        return -1;
      }
    }
    if (sortBy === "priority") {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === "newest") {
      return b.id - a.id;
    }
    // sort by deadline (nearest first)
    if (a.deadline < b.deadline) return -1;
    if (a.deadline > b.deadline) return 1;
    return 0;
  }
  visibleTasks.sort(sortTasks);

  
  function getFilterStyle(name) {
    if (filter === name) {
      return "rounded-lg bg-white py-2 text-sm font-semibold text-black shadow-sm";
    } else {
      return "rounded-lg py-2 text-sm text-gray-600";
    }
  }

  const dateWords = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-5 pb-28">
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-500 mt-6">{dateWords}</p>
        <h1 className="text-4xl font-bold text-black">My Tasks</h1>
        <p className="text-gray-500 mb-6">Add, edit, finish, and delete your tasks.</p>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-[#007AFF]">{activeCount}</p>
            <p className="text-xs text-gray-500 mt-1">To do</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-[#34C759]">{doneCount}</p>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-red-500">{overdueCount}</p>
            <p className="text-xs text-gray-500 mt-1">Overdue</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <div className="mb-1 flex justify-between text-sm text-gray-500">
            <span>Progress</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-[#34C759]" style={{ width: percent + "%" }}></div>
          </div>
        </div>

        <TaskForm
          key={editingTask ? editingTask.id : "new"}
          groups={groups}
          defaultGroup={firstGroupId}
          showGroupDropdown={true}
          taskToEdit={editingTask}
          onSave={handleSave}
          onCancelEdit={() => setEditingTask(null)}
        />

        <div className="grid gap-2 mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search tasks..."
            className={dropdownStyle}
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className={dropdownStyle}
            >
              <option value="all">All groups</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={dropdownStyle}
            >
              <option value="deadline">Sort by deadline</option>
              <option value="priority">Sort by priority</option>
              <option value="newest">Sort by newest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-xl bg-gray-200 p-1 mb-3">
          <button onClick={() => setFilter("all")} className={getFilterStyle("all")}>
            All ({total})
          </button>
          <button onClick={() => setFilter("active")} className={getFilterStyle("active")}>
            Not Done ({activeCount})
          </button>
          <button onClick={() => setFilter("done")} className={getFilterStyle("done")}>
            Done ({doneCount})
          </button>
        </div>

        {doneCount > 0 && (
          <div className="mb-3 text-right">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-500 shadow-sm active:opacity-70"
            >
              Clear done tasks
            </button>
          </div>
        )}

        {showClearConfirm && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 mb-3">
            <p className="font-semibold text-red-800">Remove all completed tasks?</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  onClearDone();
                  setShowClearConfirm(false);
                }}
                className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white active:opacity-70"
              >
                Yes, remove
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-xl bg-white px-4 py-2 font-semibold text-gray-800 active:opacity-70"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 uppercase ml-3 mb-2">Tasks</p>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {visibleTasks.length === 0 ? (
            <p className="p-4 text-gray-500">
              {total === 0
                ? "No tasks yet. Add your first one above."
                : "No tasks match your search or filter."}
            </p>
          ) : (
            <ul>
              {visibleTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  groupName={getGroupName(task.groupId)}
                  onToggle={onToggle}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
