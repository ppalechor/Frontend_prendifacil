import React, { useState, useEffect } from "react";
import { Plus, CheckCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/useAuth";

const ModuloPrestamos = () => {
  const { token, apiBaseUrl } = useAuth();
  const [prestamos, setPrestamos] = useState([]);
  const [empenos, setEmpenos] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    empeno_id: "",
    valor: "",
    estado: "ACTIVO",
    fecha_prestamo: "",
  });

  useEffect(() => {
    if (!token) return;
    fetchPrestamos();
    fetchEmpenos();
  }, [token]);

  const fetchPrestamos = async () => {
    const res = await axios.get(`${apiBaseUrl}/prestamos`, { headers: { Authorization: `Bearer ${token}` } });
    setPrestamos(res.data || []);
  };

  const fetchEmpenos = async () => {
    const res = await axios.get(`${apiBaseUrl}/empenos`, { headers: { Authorization: `Bearer ${token}` } });
    setEmpenos(res.data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${apiBaseUrl}/prestamos`, formData, { headers: { Authorization: `Bearer ${token}` } });

    setIsModalOpen(false);
    setFormData({ empeno_id: "", valor: "", estado: "ACTIVO", fecha_prestamo: "" });
    fetchPrestamos();
  };

  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Préstamos</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" /> Crear Préstamo
        </button>
      </div>

      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>ID</th>
              <th>Empeño</th>
              <th>Usuario</th>
              <th>Valor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map((p) => (
              <tr key={p.id_prestamo} className="border-b">
                <td>{p.id_prestamo}</td>
                <td>{p.empeno?.id_empeno || 'N/A'}</td>
                <td>{p.empeno?.usuario?.nombres || 'N/A'}</td>
                <td>${p.valor}</td>
                <td>{p.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Crear Préstamo</h2>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <select
                className="w-full border p-2 rounded"
                value={formData.empeno_id}
                onChange={(e) => setFormData({ ...formData, empeno_id: e.target.value })}
                required
              >
                <option value="">Selecciona empeño</option>
                {empenos.map((e) => (
                  <option key={e.id_empeno} value={e.id_empeno}>
                    Empeño {e.id_empeno} - {e.usuario?.nombres || 'Usuario desconocido'}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Valor del Préstamo"
                value={formData.valor}
                min={0}
                onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
                required
              />
              <select
                className="w-full border p-2 rounded"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                required
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.fecha_prestamo}
                onChange={(e) => setFormData({ ...formData, fecha_prestamo: e.target.value })}
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
                  Crear Préstamo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuloPrestamos;
