import React from "react";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const handleLogout = () => {
    // Eliminar token y redirigir
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex justify-center items-center bg-gray-100 ml-64">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="mb-6">Bienvenido al sistema</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
