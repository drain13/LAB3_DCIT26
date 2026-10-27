import { Link } from "react-router-dom";

const steps = [
  {
    title: "Create a task group",
    text: "Go to the Groups page. Type a group name like School Activities and create it. The new group will show in your list.",
  },
  {
    title: "Add a task to a group",
    text: "Open a group (or go to the Tasks page), type your task, choose a deadline and a priority, then tap Add Task. On the Tasks page, pick the group in the dropdown first.",
  },
  {
    title: "Mark a task as Done or Not Done",
    text: "Tap Mark as Done on a task. It will have a line through it and a green Done label. Tap Mark as Not Done to change it back.",
  },
  {
    title: "Edit a task",
    text: "Tap Edit on a task. The form at the top fills with its details. Change what you need and tap Save changes.",
  },
  {
    title: "Check the deadlines",
    text: "Each task shows its deadline and how many days are left. Tasks due soon turn orange, and late tasks turn red and say overdue.",
  },
  {
    title: "Delete a task",
    text: "Tap the red Delete button, then tap Yes, delete to confirm. On the Tasks page, Clear done tasks removes all finished tasks.",
  },
  {
    title: "Find your tasks",
    text: "On the Tasks page, use the search box, the group dropdown, the sort dropdown, and the All, Not Done and Done buttons.",
  },
  {
    title: "Move between pages and groups",
    text: "Use the tabs at the bottom (Home, Tasks, Groups, Guide, Developers). Open a group to see only its tasks, then use the ‹ links at the top to go back.",
  },
];

function Guide() {
  return (
    <div className="p-5 pb-28">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-black mt-6">User Guide</h1>
        <p className="text-gray-500 mb-6">
          Follow these steps to use the to-do list. Your tasks are saved in your browser.
        </p>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {steps.map((step, index) => (
            <div key={step.title} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
              <p className="font-semibold text-black">
                {index + 1}. {step.title}
              </p>
              <p className="text-gray-500 mt-1">{step.text}</p>
            </div>
          ))}
        </div>

        <Link
          to="/"
          className="block bg-[#007AFF] text-white text-center font-semibold py-3 rounded-xl active:opacity-70"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Guide;

