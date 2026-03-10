import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const AppLayout = () => {
  return (
    <div className="w-full flex gap-6 min-h-screen" style={{ marginLeft: "250px", marginTop: "95px" }}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
