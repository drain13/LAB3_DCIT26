import { NavLink } from "react-router-dom";

  function getTabStyle({ isActive }) {
    if (isActive) {
      return "flex-1 py-2 text-center text-[13px] font-semibold text-[#007AFF]";
    } else {
      return "flex-1 py-2 text-center text-[13px] text-gray-500";
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-2xl">
        <NavLink to="/" end className={getTabStyle}>
          <span className="block text-lg">🏠</span>
          Home
        </NavLink>
        <NavLink to="/tasks" className={getTabStyle}>
          <span className="block text-lg">✅</span>
          Tasks
        </NavLink>
        <NavLink to="/groups" className={getTabStyle}>
          <span className="block text-lg">📁</span>
          Groups
        </NavLink>
        <NavLink to="/guide" className={getTabStyle}>
          <span className="block text-lg">📖</span>
          Guide
        </NavLink>
        <NavLink to="/developers" className={getTabStyle}>
          <span className="block text-lg">👥</span>
          Developers
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;

