import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, User as UserIcon, MapPin, Phone } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import "../styles/modulos.css";

const ModuloUsuarios = () => {
  const { token, apiBaseUrl, currentUser } = useAuth();
  const API_URL = `${apiBaseUrl}/usuarios`;
  const [usuarios, setUsuarios] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    nombres: "",
    identificacion: "",
    direccion: "",
    telefono: "",
    password: "",
    rol: "CLIENTE",
  });
  const [me, setMe] = useState(null);
  const [editingMe, setEditingMe] = useState(false);
  const [meForm, setMeForm] = useState({ direccion: '', telefono: '' });
  const [initialized, setInitialized] = useState(false);

  const isStrongPassword = (p) => {
    return typeof p === 'string' && p.length >= 8;
  };

  useEffect(() => {
    if (initialized) return;
    if (!token || !currentUser) return;
    if (currentUser.role === 'ADMIN') {
      fetchUsuarios();
      setInitialized(true);
      return;
    }
    (async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMe(res.data);
        setMeForm({ direccion: res.data.direccion || '', telefono: res.data.telefono || '' });
      } catch (err) {
        console.warn('GET /me falló', err?.message || err);
      } finally {
        setInitialized(true);
      }
    })();
  }, [initialized, token, currentUser, apiBaseUrl]);

  // Obtener todos los usuarios
  const fetchUsuarios = async () => {
    try {
      console.log('=== FETCH USUARIOS DEBUG ===');
      console.log('1. Token exists:', !!token);
      console.log('2. Token length:', token?.length);
      console.log('3. API URL:', API_URL);
      console.log('4. Token preview:', token?.substring(0, 20) + '...');
      console.log('5. Full token:', token);
      
      if (!token) {
        console.error('❌ FAILED: No authentication token available');
        alert('No estás autenticado. Por favor inicia sesión.');
        return;
      }
      
      console.log('6. Building request with headers...');
      const requestConfig = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      console.log('7. Making request to:', API_URL);
      console.log('8. Request headers:', requestConfig.headers);
      
      const response = await axios.get(API_URL, requestConfig);
      console.log('9. ✅ SUCCESS - Response:', response.data);
      setUsuarios(response.data);
    } catch (error) {
      console.error("❌ FAILED: Error al obtener usuarios:", error);
      console.error("❌ FAILED: Error response:", error.response);
      console.error("❌ FAILED: Error config:", error.config);
      console.error("❌ FAILED: Headers sent:", error.config?.headers);
      console.error("❌ FAILED: Status:", error.response?.status);
      console.error("❌ FAILED: Status text:", error.response?.statusText);
      console.error("❌ FAILED: Response data:", error.response?.data);
    }
  };

  // Crear o actualizar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('=== CREATING/EDITING USER DEBUG ===');
      console.log('Token:', token);
      console.log('FormData:', formData);
      console.log('API_URL:', API_URL);
      console.log('Is Editing:', isEditing);
      
      if (!token) {
        console.error('❌ NO TOKEN - Cannot proceed');
        return;
      }

      const requestConfig = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (!/^[0-9]+$/.test(formData.identificacion)) {
        alert('La identificación debe contener solo números.');
        return;
      }
      let response;
      if (isEditing) {
        console.log('🔄 PUT Request to:', `${API_URL}/${userId}`);
        if (formData.password && !isStrongPassword(formData.password)) {
          alert('Contraseña insegura. Mínimo 8 caracteres.');
          return;
        }
        response = await axios.put(`${API_URL}/${userId}`, formData, requestConfig);
      } else {
        console.log('➕ POST Request to:', API_URL);
        if (formData.password && !isStrongPassword(formData.password)) {
          alert('Contraseña insegura. Mínimo 8 caracteres.');
          return;
        }
        response = await axios.post(API_URL, formData, requestConfig);
      }

      console.log('✅ Success:', response.data);

      setIsModalOpen(false);
      setFormData({ nombres: "", identificacion: "", direccion: "", telefono: "", password: "", rol: "CLIENTE" });
      setIsEditing(false);
      fetchUsuarios();
    } catch (error) {
      console.error("❌ Error al guardar usuario:", error);
      console.error("Error response:", error.response);
      console.error("Error config:", error.config);
      console.error("Error headers sent:", error.config?.headers);
    }
  };

  // Editar usuario
  const handleEdit = (user) => {
    setFormData({
      nombres: user.nombres,
      identificacion: user.identificacion,
      direccion: user.direccion,
      telefono: user.telefono,
      password: "",
      rol: user.rol || "CLIENTE",
    });
    setUserId(user.id_usuario);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="modulo-container">
        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {(me?.nombres || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{me?.nombres || 'Mi Perfil'}</h1>
                <p className="text-sm opacity-90">{me?.rol || 'CLIENTE'}</p>
              </div>
              <div className="ml-auto text-right">
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full">ID: {me?.identificacion || currentUser?.identificacion || '-'}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white">
            {!editingMe && me ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-xl p-4 flex items-start gap-3">
                  <UserIcon className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Nombre</p>
                    <p className="text-base font-medium text-gray-900">{me.nombres}</p>
                  </div>
                </div>
                <div className="border rounded-xl p-4 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Dirección</p>
                    <p className="text-base font-medium text-gray-900">{me.direccion || '—'}</p>
                  </div>
                </div>
                <div className="border rounded-xl p-4 flex items-start gap-3">
                  <Phone className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="text-base font-medium text-gray-900">{me.telefono || '—'}</p>
                  </div>
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow" onClick={() => setEditingMe(true)}>Editar perfil</button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await axios.put(`${apiBaseUrl}/me`, meForm, { headers: { Authorization: `Bearer ${token}` } });
                    setMe(res.data);
                    setEditingMe(false);
                  } catch {
                    alert('Error al actualizar perfil');
                  }
                }}
                className="space-y-4 max-w-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                    <input type="text" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={meForm.direccion} onChange={(e) => setMeForm({ ...meForm, direccion: e.target.value })} placeholder="Dirección" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                    <input type="text" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={meForm.telefono} onChange={(e) => setMeForm({ ...meForm, telefono: e.target.value })} placeholder="Teléfono" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg" onClick={() => setEditingMe(false)}>Cancelar</button>
                  <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow">Guardar cambios</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modulo-container">
      <h1 className="modulo-title">Usuarios</h1>

      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-4">
          <label className="text-sm">Filtrar por rol:</label>
          <select
            className="border p-2 rounded"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">Todos</option>
            <option value="ADMIN">ADMIN</option>
            <option value="CLIENTE">CLIENTE</option>
          </select>
          <span className="text-sm text-gray-600">ADMIN: {usuarios.filter(u => u.rol === 'ADMIN').length}</span>
          <span className="text-sm text-gray-600">CLIENTE: {usuarios.filter(u => u.rol === 'CLIENTE').length}</span>
        </div>
        <button
          onClick={() => {
            setIsEditing(false);
            setFormData({ nombres: "", identificacion: "", direccion: "", telefono: "", password: "", rol: "CLIENTE" });
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Nuevo Usuario
        </button>
      </div>

      <div className="modulo-card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Nombres</th>
              <th className="py-2">Identificación</th>
              <th className="py-2">Dirección</th>
              <th className="py-2">Teléfono</th>
              <th className="py-2">Rol</th>
              <th className="py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios
              .filter((u) => roleFilter === 'ALL' ? true : u.rol === roleFilter)
              .map((u) => (
              <tr key={u.id_usuario} className="border-b hover:bg-gray-50">
                <td className="py-2">{u.nombres}</td>
                <td>{u.identificacion}</td>
                <td>{u.direccion}</td>
                <td>{u.telefono}</td>
                <td>{u.rol}</td>
                <td className="flex justify-center gap-2 py-2">
                  <button className="p-1 text-blue-600" onClick={() => handleEdit(u)}>
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-1 text-red-600" onClick={() => handleDelete(u.id_usuario)}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="modulo-card w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombres"
                className="w-full border p-2 rounded"
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Identificación"
                className="w-full border p-2 rounded"
                value={formData.identificacion}
                onChange={(e) => setFormData({ ...formData, identificacion: e.target.value.replace(/[^0-9]/g, '') })}
                required
              />

              <input
                type="text"
                placeholder="Dirección"
                className="w-full border p-2 rounded"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />

            <input
              type="text"
              placeholder="Teléfono"
              className="w-full border p-2 rounded"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />

              <input
                type="password"
                placeholder="Contraseña (opcional)"
                className="w-full border p-2 rounded"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="text-xs text-gray-500">Si se define: mínimo 8 caracteres.</p>

              <select
                className="w-full border p-2 rounded"
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              >
                <option value="CLIENTE">CLIENTE</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuloUsuarios;
