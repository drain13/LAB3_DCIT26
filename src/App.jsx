import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Tasks from "./pages/Tasks.jsx";
import Groups from "./pages/Groups.jsx";
import GroupTasks from "./pages/GroupTasks.jsx";
import Guide from "./pages/Guide.jsx";
import Developers from "./pages/Developers.jsx";

function getDate(daysFromToday) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toLocaleDateString("en-CA");
}


const starterGroups = [
  { id: "personal", name: "Personal Tasks" },
  { id: "school", name: "School Activities" },
  { id: "project", name: "Group Project" },
];

const starterTasks = [
  { id: 1, title: "Finish Laboratory 3", deadline: getDate(3), groupId: "school", priority: "High", done: false },
  { id: 2, title: "Submit project link", deadline: getDate(-2), groupId: "school", priority: "High", done: false },
  { id: 3, title: "Review React Router notes", deadline: getDate(1), groupId: "school", priority: "Medium", done: false },
  { id: 4, title: "Buy school supplies", deadline: getDate(-1), groupId: "personal", priority: "Low", done: true },
  { id: 5, title: "Pay phone bill", deadline: getDate(7), groupId: "personal", priority: "Medium", done: false },
  { id: 6, title: "Deploy website on Vercel", deadline: getDate(4), groupId: "project", priority: "High", done: false },
  { id: 7, title: "Practice the demo with the group", deadline: getDate(2), groupId: "project", priority: "Medium", done: false },
];


function getSavedData(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.log("Could not read the saved data");
  }
  return defaultValue;
}

function App() {
  
  const [tasks, setTasks] = useState(getSavedData("todo-tasks-v4", starterTasks));
  const [groups, setGroups] = useState(getSavedData("todo-groups-v4", starterGroups));

  // save in the browser every time the tasks change, so they stay after refreshing
  useEffect(() => {
    try {
      localStorage.setItem("todo-tasks-v4", JSON.stringify(tasks));
    } catch (error) {
      console.log("Could not save the tasks");
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem("todo-groups-v4", JSON.stringify(groups));
    } catch (error) {
      console.log("Could not save the groups");
    }
  }, [groups]);

  
  function addTask(data) {
    const newTask = {
      id: Date.now(),
      title: data.title,
      deadline: data.deadline,
      groupId: data.groupId,
      priority: data.priority,
      done: false,
    };
    setTasks([newTask, ...tasks]);
  }

  // save the changes of an edited task
  function updateTask(id, data) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          title: data.title,
          deadline: data.deadline,
          groupId: data.groupId,
          priority: data.priority,
        };
      } else {
        return task;
      }
    });
    setTasks(newTasks);
  }

  // change a task from Not Done to Done (or back)
  function toggleTask(id) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, done: !task.done };
      } else {
        return task;
      }
    });
    setTasks(newTasks);
  }

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  // remove all the tasks that are done
  function clearDoneTasks() {
    const newTasks = tasks.filter((task) => task.done === false);
    setTasks(newTasks);
  }

  
  function addGroup(name) {
    const newGroup = { id: Date.now().toString(), name: name };
    setGroups([...groups, newGroup]);
  }

  function deleteGroup(id) {
    setGroups(groups.filter((group) => group.id !== id));
    // the tasks inside the group are deleted too
    setTasks(tasks.filter((task) => task.groupId !== id));
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F2F2F7]">
        <Routes>
          <Route path="/" element={<Home tasks={tasks} groups={groups} />} />
          <Route
            path="/tasks"
            element={
              <Tasks
                tasks={tasks}
                groups={groups}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onClearDone={clearDoneTasks}
              />
            }
          />
          <Route
            path="/groups"
            element={
              <Groups
                tasks={tasks}
                groups={groups}
                onAddGroup={addGroup}
                onDeleteGroup={deleteGroup}
              />
            }
          />
        
          <Route
            path="/groups/:groupId"
            element={
              <GroupTasks
                tasks={tasks}
                groups={groups}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            }
          />
          <Route path="/guide" element={<Guide />} />
          <Route path="/developers" element={<Developers />} />
          <Route
            path="*"
            element={
              <div className="p-5 pb-28">
                <div className="max-w-2xl mx-auto">
                  <h1 className="text-4xl font-bold text-black mt-6">Page not found</h1>
                  <p className="text-gray-500 mb-6">Use the tabs below to go back.</p>
                </div>
              </div>
            }
          />
        </Routes>

       
        <Navbar />
      </div>
    </BrowserRouter>
  );
}

export default App;

