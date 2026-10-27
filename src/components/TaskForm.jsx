import { useState } from "react";

const inputStyle =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-black [color-scheme:light] focus:border-[#007AFF] focus:ring-2 focus:ring-blue-200 focus:outline-none";
const labelStyle = "mb-1 block text-sm font-medium text-gray-700";
const quickButtonStyle =
  "rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 active:opacity-70";

const priorities = ["High", "Medium", "Low"];

function getDate(daysFromToday) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toLocaleDateString("en-CA");
}

function TaskForm({ groups, defaultGroup, showGroupDropdown, taskToEdit, onSave, onCancelEdit }) {
  // when editing, the form starts with the values of that task
  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : "");
  const [deadline, setDeadline] = useState(taskToEdit ? taskToEdit.deadline : "");
  const [groupId, setGroupId] = useState(taskToEdit ? taskToEdit.groupId : defaultGroup);
  const [priority, setPriority] = useState(taskToEdit ? taskToEdit.priority : "Medium");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault(); 

    if (title.trim() === "") {
      setErrorMessage("Please enter a task title.");
      return;
    }
    if (deadline === "") {
      setErrorMessage("Please choose a deadline.");
      return;
    }
    if (groupId === "") {
      setErrorMessage("Please choose a group.");
      return;
    }

    onSave({ title: title.trim(), deadline: deadline, groupId: groupId, priority: priority });

    
    if (!taskToEdit) {
      setTitle("");
      setDeadline("");
      setPriority("Medium");
    }
    setErrorMessage("");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <h2 className="mb-3 text-lg font-semibold text-black">
        {taskToEdit ? "✏️ Edit task" : "➕ Add a new task"}
      </h2>

      <label htmlFor="task-title" className={labelStyle}>
        Task
      </label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you need to do?"
        className={inputStyle}
      />

      {showGroupDropdown && (
        <div className="mt-3">
          <label htmlFor="task-group" className={labelStyle}>
            Group
          </label>
          <select
            id="task-group"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className={inputStyle}
          >
            <option value="">Choose a group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-3">
        <label htmlFor="task-priority" className={labelStyle}>
          Priority
        </label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={inputStyle}
        >
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <label htmlFor="task-deadline" className={labelStyle}>
          Deadline
        </label>
        <input
          id="task-deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={inputStyle}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">Quick set:</span>
        <button type="button" onClick={() => setDeadline(getDate(0))} className={quickButtonStyle}>
          Today
        </button>
        <button type="button" onClick={() => setDeadline(getDate(1))} className={quickButtonStyle}>
          Tomorrow
        </button>
        <button type="button" onClick={() => setDeadline(getDate(7))} className={quickButtonStyle}>
          Next week
        </button>
      </div>

      {errorMessage !== "" && <p className="mt-3 font-medium text-red-600">{errorMessage}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-[#007AFF] py-3 font-semibold text-white shadow-sm active:opacity-70"
        >
          {taskToEdit ? "Save changes" : "Add Task"}
        </button>
        {taskToEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-800 active:opacity-70"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;

