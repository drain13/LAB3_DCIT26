import { Link } from "react-router-dom";

function Home({ tasks, groups }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.done === true).length;
  const pendingTasks = tasks.filter((task) => task.done === false).length;

  let percent = 0;
  if (totalTasks > 0) {
    percent = Math.round((completedTasks / totalTasks) * 100);
  }

  const todayText = new Date().toLocaleDateString("en-CA");

  const notDoneTasks = tasks.filter((task) => task.done === false);

  notDoneTasks.sort((a, b) => {
    if (a.deadline < b.deadline) return -1;
    if (a.deadline > b.deadline) return 1;
    return 0;
  });

  const upcomingTasks = notDoneTasks.slice(0, 3);

  function countTasksInGroup(groupId) {
    return tasks.filter((task) => task.groupId === groupId).length;
  }

  function getGroupName(groupId) {
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      return group.name;
    } else {
      return "";
    }
  }

  return (
    <div className="p-5 pb-28">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold text-black mt-6">Welcome!</h1>
        <p className="text-gray-500 mb-6">
          Organize your tasks, track your progress, and stay productive.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-[#007AFF]">{totalTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Total</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-[#34C759]">{completedTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-[#FF9500]">{pendingTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Pending</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="mb-1 flex justify-between text-sm text-gray-500">
            <span>Overall Progress</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-[#34C759]"
              style={{ width: percent + "%" }}
            ></div>
          </div>
        </div>

        <p className="text-sm text-gray-500 uppercase ml-3 mb-2">Due Soon</p>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {upcomingTasks.length === 0 ? (
            <p className="p-4 text-gray-500">
              You're all caught up! No pending tasks.
            </p>
          ) : (
            upcomingTasks.map((task) => {
              let labelText = "";
              let labelStyle = "";

              if (task.deadline < todayText) {
                labelText = "Overdue";
                labelStyle = "bg-red-100 text-red-700";
              } else if (task.deadline === todayText) {
                labelText = "Due today";
                labelStyle = "bg-orange-100 text-orange-800";
              } else {
                const date = new Date(task.deadline + "T00:00:00");
                labelText = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                labelStyle = "bg-gray-100 text-gray-600";
              }

              return (
                <Link
                  key={task.id}
                  to={"/groups/" + task.groupId}
                  className="flex justify-between items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 active:bg-gray-100"
                >
                  <div>
                    <p className="text-black">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      {getGroupName(task.groupId)}
                    </p>
                  </div>
                  <span
                    className={
                      "rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap " +
                      labelStyle
                    }
                  >
                    {labelText}
                  </span>
                </Link>
              );
            })
          )}
        </div>

        <p className="text-sm text-gray-500 uppercase ml-3 mb-2">
          Your Task Groups
        </p>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {groups.length === 0 ? (
            <p className="p-4 text-gray-500">
              No groups yet. Create one in the Groups page.
            </p>
          ) : (
            groups.map((group) => (
              <Link
                key={group.id}
                to={"/groups/" + group.id}
                className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-b-0 active:bg-gray-100"
              >
                <span className="text-black">{group.name}</span>
                <span className="text-gray-400">
                  {countTasksInGroup(group.id)} tasks ›
                </span>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;
