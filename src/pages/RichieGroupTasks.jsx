
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function GroupTasks({
  groups = [],
  tasks = [],
  addTask = () => {},
  toggleTask = () => {},
  deleteTask = () => {},
}) {
  const { groupId } = useParams()
  const [taskName, setTaskName] = useState('')

  const group = groups.find((item) => item.id === groupId)
  const groupTasks = tasks.filter((task) => task.groupId === groupId)

  const completed = groupTasks.filter((task) => task.done).length
  const pending = groupTasks.length - completed
  const progress = groupTasks.length
    ? Math.round((completed / groupTasks.length) * 100)
    : 0

  function handleSubmit(e) {
    e.preventDefault()
    const name = taskName.trim()
    if (!name) return

    addTask(name, groupId)
    setTaskName('')
  }

  if (!group) {
    return (
      <main className="min-h-screen bg-blue-50 p-10 text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Group not found
        </h1>
        <Link to="/groups" className="mt-4 inline-block text-blue-600">
          ← Back to Groups
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/groups"
          className="mb-6 inline-block font-medium text-blue-700 hover:text-blue-900"
        >
          ← Back to Groups
        </Link>

        <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-sky-500 p-8 text-white shadow-lg sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">
            My Task Workspace
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            {group.name}
          </h1>

          <p className="mt-3 text-blue-100">
            Keep track of your activities and complete your goals.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/20 p-4 text-center">
              <p className="text-2xl font-bold">{groupTasks.length}</p>
              <p className="text-xs text-blue-100 sm:text-sm">Total</p>
            </div>

            <div className="rounded-xl bg-white/20 p-4 text-center">
              <p className="text-2xl font-bold">{completed}</p>
              <p className="text-xs text-blue-100 sm:text-sm">Completed</p>
            </div>

            <div className="rounded-xl bg-white/20 p-4 text-center">
              <p className="text-2xl font-bold">{pending}</p>
              <p className="text-xs text-blue-100 sm:text-sm">Pending</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span>Task Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Add New Task
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add an activity to this category.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What do you need to do?"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              + Add Task
            </button>
          </form>
        </div>

        <div className="mt-10 mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            My Tasks
          </h2>
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            {groupTasks.length} Tasks
          </span>
        </div>

        {groupTasks.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-4xl">📝</p>
            <p className="mt-3 font-medium text-slate-600">
              No tasks yet in this group.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Add your first task to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {groupTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p
                    className={`break-words font-semibold ${
                      task.done
                        ? 'text-slate-400 line-through'
                        : 'text-slate-800'
                    }`}
                  >
                    {task.name}
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      task.done
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {task.done ? 'Done' : 'Not Done'}
                  </span>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:flex-none"
                  >
                    {task.done ? 'Mark Not Done' : 'Mark Done'}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-1 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 sm:flex-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default GroupTasks
