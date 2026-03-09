import React from "react";
import { useSession } from "../context/SessionContext";

const Home = () => {
  const { session } = useSession();

  return (
    <div>
      <h1 className="text-3xl font-bold text-purple-600">Welcome, {session?.first_name}!</h1>
      <p className="text-gray-600 mt-2">This is your home page.</p>
    </div>
  );
};

export default Home;
