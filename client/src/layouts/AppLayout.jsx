import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const AppLayout = () => {
  return (
    <div className="w-full p-6 flex gap-6 min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
