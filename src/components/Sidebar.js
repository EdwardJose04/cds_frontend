import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaTools, FaBox, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-4 fixed">
      <h2 className="text-xl font-bold mb-4">Menú</h2>
      <ul className="space-y-2">
        {/* Usuarios */}
        <li>
          <button 
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
            onClick={() => toggleMenu("usuarios")}
          >
            <span className="flex items-center"><FaUser className="mr-2" />Usuarios</span>
            {openMenus["usuarios"] ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus["usuarios"] && (
            <ul className="ml-6 space-y-1">
              <li><Link to="/register" className="block p-2 hover:bg-gray-700 rounded">Registrar usuario</Link></li>
              <li><Link to="/usuarios" className="block p-2 hover:bg-gray-700 rounded">Listado de usuarios</Link></li>
            </ul>
          )}
        </li>

        {/* Herramientas */}
        <li>
          <button 
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
            onClick={() => toggleMenu("herramientas")}
          >
            <span className="flex items-center"><FaTools className="mr-2" />Herramientas</span>
            {openMenus["herramientas"] ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus["herramientas"] && (
            <ul className="ml-6 space-y-1">
              <li><Link to="/herramientas/crear" className="block p-2 hover:bg-gray-700 rounded">Registrar</Link></li>
              <li><Link to="/herramientas" className="block p-2 hover:bg-gray-700 rounded">Listado</Link></li>
            </ul>
          )}
        </li>

        {/* Productos */}
        <li>
          <button 
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
            onClick={() => toggleMenu("productos")}
          >
            <span className="flex items-center"><FaBox className="mr-2" />Productos</span>
            {openMenus["productos"] ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus["productos"] && (
            <ul className="ml-6 space-y-1">
              <li><Link to="/productos/crear" className="block p-2 hover:bg-gray-700 rounded">Registrar</Link></li>
              <li><Link to="/productos" className="block p-2 hover:bg-gray-700 rounded">Listado</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
