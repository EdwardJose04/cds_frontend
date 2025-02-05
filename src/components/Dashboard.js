// Dashboard.js
import React from "react";

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="mb-6">Bienvenido al sistema</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Aquí puedes agregar tus widgets o contenido del dashboard */}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;