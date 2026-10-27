import { useState } from "react";


function TaskItem({ task, groupName, onToggle, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const todayText = new Date().toLocaleDateString("en-CA");
  const today = new Date(todayText + "T00:00:00");
  const deadlineDate = new Date(task.deadline + "T00:00:00");
  const daysLeft = Math.round((deadlineDate - today) / (1000 * 60 * 60 * 24));

  
  let deadlineText = daysLeft + " days left";
  let deadlineColor = "text-gray-500";
  if (daysLeft < 0) {
    deadlineText = Math.abs(daysLeft) + " day(s) overdue";
    deadlineColor = "text-red-600 font-semibold";
  } else if (daysLeft === 0) {
    deadlineText = "Due today";
    deadlineColor = "text-orange-600 font-semibold";
  } else if (daysLeft === 1) {
    deadlineText = "Due tomorrow";
    deadlineColor = "text-orange-600 font-semibold";
  } else if (daysLeft === 2) {
    deadlineColor = "text-orange-600 font-semibold";
  }

  const prettyDate = deadlineDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  let titleStyle = "text-black";
  let statusText = "⏳ Not Done";
  let statusStyle = "rounded-full bg-orange-100 px-3 py-1 font-medium text-orange-800";
  if (task.done) {
    titleStyle = "text-gray-400 line-through";
    statusText = "✅ Done";
    statusStyle = "rounded-full bg-green-100 px-3 py-1 font-medium text-green-800";
  }

  let priorityStyle = "bg-green-100 text-green-800";
  if (task.priority === "High") {
    priorityStyle = "bg-red-100 text-red-700";
  } else if (task.priority === "Medium") {
    priorityStyle = "bg-yellow-100 text-yellow-800";
  }

  return (
    <li className="border-b border-gray-100 px-4 py-3 last:border-b-0">
      <p className={"font-medium break-words " + titleStyle}>{task.title}</p>

      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
        <span className={statusStyle}>{statusText}</span>
        <span className={"rounded-full px-3 py-1 font-medium " + priorityStyle}>
          {task.priority}
        </span>
        {groupName !== "" && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">{groupName}</span>
        )}
      </div>

      <p className="mt-1 text-sm text-gray-500">
        📅 {prettyDate}
        {task.done === false && <span className={deadlineColor}> · {deadlineText}</span>}
      </p>

      {showConfirm ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="font-semibold text-red-800">Delete this task?</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onDelete(task.id)}
              className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white active:opacity-70"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-xl bg-white px-4 py-2 font-semibold text-gray-800 active:opacity-70"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => onToggle(task.id)}
            className="rounded-xl bg-blue-50 px-4 py-2 font-semibold text-[#007AFF] active:opacity-70"
          >
            {task.done ? "Mark as Not Done" : "Mark as Done"}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="rounded-xl bg-gray-100 px-4 py-2 font-semibold text-gray-800 active:opacity-70"
          >
            Edit
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-xl bg-red-50 px-4 py-2 font-semibold text-red-500 active:opacity-70"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}

export default TaskItem;

