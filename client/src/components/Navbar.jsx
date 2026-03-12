import { NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

export default function Navbar() {
  const { session, logout } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (session?.session_token) {
      try {
        await fetch(`http://localhost:5050/session/logout?token=${session.session_token}`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
          <img alt="MongoDB logo" className="h-10 inline" src="https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/4B45D0EC-3482-4759-82DA37D8EA07D229/webimage-8A27671A-8A53-45DC-89D7BF8537F15A0D.png"></img>
        </NavLink>

        <div className="flex items-center gap-4">
          <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/create">
            Create Employee
          </NavLink>
          
          {session && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-red-500 bg-red-50 hover:bg-red-100 text-red-600 h-9 rounded-md px-3"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}