import React from "react";
import { useAuth } from "../../context/useAuth";
import { X, Box, FileText, User, CreditCard, Package, DollarSign } from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const { currentUser } = useAuth();
  const links = [
    { name: "usuarios", key: "usuarios", icon: User },
    { name: "empeños", key: "empenos", icon: Package },
    { name: "artículos", key: "articulos", icon: Box },
    { name: "préstamos", key: "prestamos", icon: DollarSign },
    { name: "intereses", key: "intereses", icon: FileText },
    { name: "reportes", key: "reportes", icon: FileText },
  ];

  const visibleLinks = currentUser?.role === 'ADMIN'
    ? links
    : [
        links.find(l => l.key === 'usuarios'),
        links.find(l => l.key === 'prestamos'),
        links.find(l => l.key === 'intereses')
      ].filter(Boolean);

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Botón cerrar (solo móvil) */}
      <button className="close-btn md:hidden" onClick={() => setIsOpen(false)}>
        <X className="icon" />
      </button>

      <h1 className="sidebar-title">Prendería</h1>

      <nav className="sidebar-menu">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          const isActive = currentPage === link.key;
          return (
            <button
              key={link.key}
              onClick={() => setCurrentPage(link.key)}
              className={`sidebar-item ${isActive ? "active" : ""}`}
            >
              <Icon className="icon" />
              {link.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
