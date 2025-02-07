import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaTools, 
  FaBox, 
  FaChevronDown, 
  FaChevronUp, 
  FaSignOutAlt, 
  FaBars, 
  FaArrowLeft,
  FaArrowRight 
} from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [userData, setUserData] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsOpen]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <>
      {/* Toggle button for mobile */}
      {isMobileView && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 bg-gray-900 text-white p-3 rounded-lg md:hidden"
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Floating button when sidebar is closed (visible on desktop only) */}
      {!isOpen && !isMobileView && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-40 bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hidden md:block"
        >
          <FaArrowRight size={20} />
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && isMobileView && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white z-40 transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          ${isMobileView ? 'shadow-lg' : ''}`}
      >
        <div className="flex flex-col h-full">
          {/* Header with toggle button */}
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">Dashboard</h1>
            {!isMobileView && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {isOpen ? <FaArrowLeft size={20} /> : <FaArrowRight size={20} />}
              </button>
            )}
          </div>

          {/* User info */}
          <div className="border-b border-gray-700 p-4 text-center">
            <h2 className="text-xl font-bold mb-1">{userData?.nombre_completo || 'Usuario'}</h2>
            <p className="text-sm text-gray-400">{userData?.rol || 'Rol no disponible'}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {/* Usuarios */}
              <li>
                <button
                  className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded transition-colors"
                  onClick={() => toggleMenu("usuarios")}
                >
                  <span className="flex items-center">
                    <FaUser className="mr-2" />
                    Usuarios
                  </span>
                  {openMenus["usuarios"] ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {openMenus["usuarios"] && (
                  <ul className="ml-6 mt-2 space-y-1">
                    <li>
                      <Link to="/register" className="block p-2 hover:bg-gray-700 rounded transition-colors">
                        Registrar usuario
                      </Link>
                    </li>
                    <li>
                      <Link to="/usuarios" className="block p-2 hover:bg-gray-700 rounded transition-colors">
                        Listado de usuarios
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Herramientas */}
              <li>
                <button
                  className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded transition-colors"
                  onClick={() => toggleMenu("herramientas")}
                >
                  <span className="flex items-center">
                    <FaTools className="mr-2" />
                    Herramientas
                  </span>
                  {openMenus["herramientas"] ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {openMenus["herramientas"] && (
                  <ul className="ml-6 mt-2 space-y-1">
                    <li>
                      <Link to="/herramientas/crear" className="block p-2 hover:bg-gray-700 rounded transition-colors">
                        Registrar
                      </Link>
                    </li>
                    <li>
                      <Link to="/herramientas" className="block p-2 hover:bg-gray-700 rounded transition-colors">
                        Listado
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Productos */}
              <li>
                <button
                  className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded transition-colors"
                  onClick={() => toggleMenu("productos")}
                >
                  <span className="flex items-center">
                    <FaBox className="mr-2" />
                    Productos
                  </span>
                  {openMenus["productos"] ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {openMenus["productos"] && (
                  <ul className="ml-6 mt-2 space-y-1">
                    <li>
                      <Link to="/productos/crear" className="block p-2 hover:bg-gray-700 rounded transition-colors">
                        Registrar
                      </Link>
                    </li>
                    <li>
                      <Link to="/productos" className="block p-2 hover:bg-gray-700 rounded transition-colors">
                        Listado
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          {/* Footer with logout */}
          <div className="border-t border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className="w-full p-2 text-red-400 hover:bg-gray-700 rounded transition-colors flex items-center justify-center gap-2"
            >
              <FaSignOutAlt />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;