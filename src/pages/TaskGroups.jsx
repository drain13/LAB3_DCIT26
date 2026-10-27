
import { useState } from 'react'
import { Link } from 'react-router-dom'

function TaskGroups({ groups = [], addGroup = () => {} }) {
  const [groupName, setGroupName] = useState('')

  const icons = ['📚', '👤', '💻', '📅', '📝', '⭐']

  function handleAddGroup(e) {
    e.preventDefault()

    const name = groupName.trim()
    if (!name) return

    addGroup(name)
    setGroupName('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">

        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 font-medium text-blue-700 hover:text-blue-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-sky-500 p-8 text-white shadow-lg sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">
            My Productivity Space
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Task Groups
          </h1>

          <p className="mt-3 max-w-xl text-blue-100">
            Stay organized and productive. Create categories and manage your tasks in one place.
          </p>

          <div className="mt-6 inline-flex rounded-xl bg-white/20 px-5 py-3">
            <span className="font-semibold">
              {groups.length} Total Categories
            </span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Create New Group
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add a category to organize your activities.
          </p>

          <form
            onSubmit={handleAddGroup}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Research Activities"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              + Create Group
            </button>
          </form>
        </div>

        <div className="mt-10 mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            My Categories
          </h2>

          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            {groups.length} Groups
          </span>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
            No groups yet. Create your first category!
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group, index) => (
              <Link
                key={group.id}
                to={`/groups/${group.id}`}
                className="group rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  {icons[index % icons.length]}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  {group.name}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Organize and manage your tasks.
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="font-semibold text-blue-600">
                    View Tasks
                  </span>

                  <span className="text-blue-600 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}

export default TaskGroups
