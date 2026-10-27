import { Link } from "react-router-dom";

// TODO: change these to the real names of your group members (max 4)
const developers = [
  { name: "Adrian MAbuti", role: "Project lead, routing and deployment" },
  { name: "Ryan Obedientes", role: "Task list and Done / Not Done features" },
  { name: "Richie Mapa", role: "Task groups pages and dynamic routes" },
  { name: "Christian Fermin", role: "Dashboard, User Guide and styling" },
];

function Developers() {
  return (
    <div className="p-5 pb-28">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-black mt-6">Developers</h1>
        <p className="text-gray-500 mb-6">The group members who made this website.</p>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {developers.map((dev) => (
            <div key={dev.name} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
              <p className="font-semibold text-black">{dev.name}</p>
              <p className="text-gray-500">{dev.role}</p>
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

export default Developers;

