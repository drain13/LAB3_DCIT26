import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import TaskForm from "../components/TaskForm.jsx";
import TaskItem from "../components/TaskItem.jsx";

function GroupTasks({ tasks, groups, onAddTask, onUpdateTask, onToggle, onDelete }) {
  
  const { groupId } = useParams();

  const [editingTask, setEditingTask] = useState(null);

  const group = groups.find((g) => g.id === groupId);


  if (!group) {
    return (
      <div className="p-5 pb-28">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-black mt-6">Group not found</h1>
          <p className="text-gray-500 mb-6">This group does not exist or was deleted.</p>
          <Link
            to="/groups"
            className="block bg-[#007AFF] text-white text-center font-semibold py-3 rounded-xl active:opacity-70"
          >
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  
  const groupTasks = tasks.filter((task) => task.groupId === groupId);

  
  groupTasks.sort((a, b) => {
    if (a.done !== b.done) {
      if (a.done) {
        return 1;
      } else {
        return -1;
      }
    }
    if (a.deadline < b.deadline) return -1;
    if (a.deadline > b.deadline) return 1;
    return 0;
  });

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

  return (
    <div className="p-5 pb-28">
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-4 mt-2 text-[#007AFF] font-medium">
          <Link to="/groups" className="active:opacity-70">
            ‹ Groups
          </Link>
          <Link to="/" className="active:opacity-70">
            ‹ Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-black mt-4">{group.name}</h1>
        <p className="text-gray-500 mb-6">Only the tasks of this group are shown here.</p>

       
        <TaskForm
          key={groupId + (editingTask ? editingTask.id : "new")}
          groups={groups}
          defaultGroup={groupId}
          showGroupDropdown={false}
          taskToEdit={editingTask}
          onSave={handleSave}
          onCancelEdit={() => setEditingTask(null)}
        />

        <p className="text-sm text-gray-500 uppercase ml-3 mb-2">Tasks</p>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {groupTasks.length === 0 ? (
            <p className="p-4 text-gray-500">No tasks in this group yet. Add one above.</p>
          ) : (
            <ul>
              {groupTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  groupName=""
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

export default GroupTasks;

