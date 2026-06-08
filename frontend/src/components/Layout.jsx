import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearToken } from "../redux/slices/loginSlice/check";
import { LogOut } from 'lucide-react';


const nav = [
  { to: "/portfolio", label: "Portfolio", icon: "◉" },
  { to: "/education", label: "Education", icon: "▣" },
  { to: "/blogs", label: "Blogs", icon: "✎" },
  { to: "/categories", label: "Categories", icon: "◈" },
  { to: "/details", label: "mydetails", icon: "◈" },
  { to: "/work", label: "Work", icon: "◈" },
  { to: "/resume", label: "Resume", icon: "◈" },
  { to: "/testimonials", label: "Testimonials", icon: "◈" },
  { to: "/message", label: "Message", icon: "◈" },
  { to: "/admin", label: "Admin", icon: "◈" },
];

export default function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const email =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : "";
  const role =
    typeof window !== "undefined" ? localStorage.getItem("userRole") : "";
  const initial = (email && email[0]?.toUpperCase()) || "U";

  const logOut = () => {
    dispatch(clearToken());
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,500;1,300&display=swap');

        .app-shell {
          display: flex;
          min-height: 100vh;
          background: #0b0b0b;
          font-family: 'Poppins', sans-serif;
          color: #e5e5e5;
        }

        .app-sidebar {
          width: 220px;
          background: #141414;
          display: flex;
          flex-direction: column;
          padding: 2rem 1.2rem;
          flex-shrink: 0;
        }
        .app-sidebar-logo {
          font-family: 'Fraunces', serif;
          font-size: 1.3rem;
          font-weight: 500;
          color: #f1f1f1;
          margin-bottom: 2.5rem;
          letter-spacing: -0.02em;
        }
        .app-sidebar-logo span { color: #a3a3a3; }

        .app-nav-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 0.8rem;
          border-radius: 8px;
          font-size: 0.78rem;
          color: #9a9a9a;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          margin-bottom: 0.2rem;
          letter-spacing: 0.02em;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          box-sizing: border-box;
        }
        .app-nav-link:hover { background: #242424; color: #f0f0f0; }
        .app-nav-link.active { background: #e5e5e5; color: #111111; font-weight: 500; }

        .app-nav-icon {
          width: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          opacity: 0.8;
          flex-shrink: 0;
        }
        .app-nav-link.active .app-nav-icon { opacity: 1; }

        .app-sidebar-bottom {
          margin-top: auto;
          border-top: 1px solid #2a2a2a;
          padding-top: 1rem;
        }
        .app-sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .app-sidebar-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #d4d4d4;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
          font-weight: 500;
          color: #111111;
          flex-shrink: 0;
        }
        .app-sidebar-name {
          font-size: 0.75rem;
          color: #b9b9b9;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 120px;
        }
        .app-sidebar-role { font-size: 0.65rem; color: #858585; }

        .app-logout {
          margin-top: 0.75rem;
          color: #b9b9b9;
        }
        .app-logout:hover { color: #f1f1f1; background: #242424; }

        .app-main {
          flex: 1;
          padding: 2rem 2.5rem;
          overflow-x: auto;
          min-width: 0;
        }

        @media (max-width: 900px) {
          .app-sidebar { width: 180px; padding: 1.5rem 1rem; }
          .app-main { padding: 1.5rem; }
        }
      `}</style>

      <div className="app-shell">
        <aside className="app-sidebar">
          <div className="app-sidebar-logo">
            My<span>.</span>Portfolio
          </div>
          <nav>
            {nav.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `app-nav-link${isActive ? " active" : ""}`
                }
                end={to === "/portfolio"}
              >
                <span className="app-nav-icon">{icon}</span>
                {label}
              </NavLink>
            ))}
            {isLoggedIn && (
              <button
                type="button"
                className="app-nav-link app-logout"
                onClick={logOut}
              >
                <LogOut className="app-nav-icon" />
                Logout
              </button>
            )}
          </nav>
          <div className="app-sidebar-bottom">
            <div className="app-sidebar-user">
              <div className="app-sidebar-avatar">{initial}</div>
              <div>
                <div className="app-sidebar-name" title={email || ""}>
                  {email || "Signed in"}
                </div>
                <div className="app-sidebar-role">{role || "Member"}</div>
              </div>
            </div>
          </div>
        </aside>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
