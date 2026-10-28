import { useState } from "react";
import { Link } from "react-router-dom";

const inputStyle =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-black [color-scheme:light] focus:border-[#007AFF] focus:ring-2 focus:ring-blue-200 focus:outline-none";

function Groups({ tasks, groups, onAddGroup, onDeleteGroup }) {
  const [groupName, setGroupName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null);

  function handleSubmit(event) {
    event.preventDefault(); 

    const cleanName = groupName.trim();
    if (cleanName === "") {
      setErrorMessage("Please type a group name.");
      return;
    }

    let alreadyExists = false;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].name.toLowerCase() === cleanName.toLowerCase()) {
        alreadyExists = true;
      }
    }
    if (alreadyExists) {
      setErrorMessage("That group already exists.");
      return;
    }

    onAddGroup(cleanName);
    setGroupName("");
    setErrorMessage("");
  }

  function confirmDelete() {
    onDeleteGroup(groupToDelete.id);
    setGroupToDelete(null);
  }
  let tasksToDelete = 0;
  if (groupToDelete) {
    tasksToDelete = tasks.filter((task) => task.groupId === groupToDelete.id).length;
  }

  return (
    <div className="p-5 pb-28">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-black mt-6">Task Groups</h1>
        <p className="text-gray-500 mb-6">
          Groups help you organize your tasks, like School, Projects, or Daily Tasks.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h2 className="mb-3 text-lg font-semibold text-black">📁 Create a new group</h2>

          <label htmlFor="group-name" className="mb-1 block text-sm font-medium text-gray-700">
            Group name
          </label>
          <input
            id="group-name"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Example: Daily Tasks"
            className={inputStyle}
          />

          {errorMessage !== "" && (
            <p className="mt-3 font-medium text-red-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-[#007AFF] py-3 font-semibold text-white shadow-sm active:opacity-70"
          >
            Create Group
          </button>
        </form>

        {groupToDelete && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 mb-4">
            <p className="font-semibold text-red-800">
              Delete "{groupToDelete.name}" and its {tasksToDelete} task(s)? This cannot be undone.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white active:opacity-70"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setGroupToDelete(null)}
                className="rounded-xl bg-white px-4 py-2 font-semibold text-gray-800 active:opacity-70"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 uppercase ml-3 mb-2">Your Task Groups</p>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {groups.length === 0 ? (
            <p className="p-4 text-gray-500">No groups yet. Create your first group above.</p>
          ) : (
            <ul>
              {groups.map((group) => {
                const groupTasks = tasks.filter((task) => task.groupId === group.id);
                const doneCount = groupTasks.filter((task) => task.done === true).length;

                let percent = 0;
                if (groupTasks.length > 0) {
                  percent = Math.round((doneCount / groupTasks.length) * 100);
                }

                return (
                  <li key={group.id} className="border-b border-gray-100 px-4 py-3 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                        📁
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-black">{group.name}</p>
                        <p className="text-sm text-gray-500">
                          {groupTasks.length} task(s) · {doneCount} done
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-[#34C759]"
                        style={{ width: percent + "%" }}
                      ></div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link
                        to={"/groups/" + group.id}
                        className="rounded-xl bg-[#007AFF] px-4 py-2 font-semibold text-white active:opacity-70"
                      >
                        Open group
                      </Link>
                      <button
                        onClick={() => setGroupToDelete(group)}
                        className="rounded-xl bg-red-50 px-4 py-2 font-semibold text-red-500 active:opacity-70"
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
    </div>
  );
}

export default Groups;
