import { Link } from "react-router-dom";

function Home({ tasks, groups }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.done === true).length;
  const pendingTasks = tasks.filter((task) => task.done === false).length;

  function countTasksInGroup(groupId) {
    return tasks.filter((task) => task.groupId === groupId).length;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-5">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold text-black mt-6">Welcome</h1>
        <p className="text-gray-500 mb-6">
          Organize your tasks, track your progress, and stay productive.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8">
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

        <div className="flex flex-col gap-3">
          <Link
            to="/groups"
            className="bg-[#007AFF] text-white text-center font-semibold py-3 rounded-xl active:opacity-70"
          >
            View Task Groups
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/guide"
              className="bg-white text-[#007AFF] text-center font-semibold py-3 rounded-xl shadow-sm active:opacity-70"
            >
              User Guide
            </Link>
            <Link
              to="/developers"
              className="bg-white text-[#007AFF] text-center font-semibold py-3 rounded-xl shadow-sm active:opacity-70"
            >
              Developers
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;