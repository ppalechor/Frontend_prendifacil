import React, { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import { useAuth } from "./context/useAuth";

import ModuloUsuarios from "./views/moduloUsuarios";
import ModuloEmpenos from "./views/moduloEmpenos";
import ModuloArticulos from "./views/moduloArticulos";
import ModuloPrestamos from "./views/moduloPrestamos";
import ModuloMisPrestamos from "./views/moduloMisPrestamos";
import ModuloIntereses from "./views/moduloIntereses";
import ModuloReportes from "./views/moduloReportes";

const App = () => {
  const { currentUser, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("usuarios");
  const [isOpen, setIsOpen] = useState(true);

  const renderContent = () => {
    const role = currentUser?.role;
    if (role !== 'ADMIN') {
      switch (currentPage) {
        case "prestamos": return <ModuloMisPrestamos />;
        case "intereses": return <ModuloIntereses />;
        case "usuarios":
        default:
          return <ModuloUsuarios />;
      }
    }
    switch (currentPage) {
      case "usuarios": return <ModuloUsuarios />;
      case "empenos": return <ModuloEmpenos />;
      case "articulos": return <ModuloArticulos />;
      case "prestamos": return <ModuloPrestamos />;
      case "intereses": return <ModuloIntereses />;
      case "reportes": return <ModuloReportes />;
      default: return <ModuloUsuarios />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <main className="content">
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Bienvenido, {currentUser?.username || 'Usuario'}</h1>
          <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
            Cerrar Sesión
          </button>
        </header>
        {currentUser?.role !== 'ADMIN' && (
          <div className="bg-white border-b px-4 py-2 flex gap-2">
            <button
              onClick={() => setCurrentPage('usuarios')}
              className={`px-3 py-1 rounded ${currentPage==='usuarios' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              Mi Perfil
            </button>
            <button
              onClick={() => setCurrentPage('prestamos')}
              className={`px-3 py-1 rounded ${currentPage==='prestamos' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              Préstamos
            </button>
            <button
              onClick={() => setCurrentPage('intereses')}
              className={`px-3 py-1 rounded ${currentPage==='intereses' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              Intereses
            </button>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
