import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";

const ModuloArticulos = () => {
  const { token, apiBaseUrl } = useAuth();
  const [articulos, setArticulos] = useState([]);
  const [empenos, setEmpenos] = useState([]);
  const [tiposArticulos, setTiposArticulos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    empeno_id: '',
    tipo_articulo_id: '',
    descripcion: '',
    valor_avaluo: ''
  });

  useEffect(() => {
    fetchArticulos();
    fetchEmpenos();
    fetchTiposArticulos();
  }, []);

  const fetchArticulos = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/articulos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticulos(res.data);
    } catch (err) {
      console.log("Error cargando artículos:", err);
    }
  };

  const fetchEmpenos = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/empenos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmpenos(res.data);
    } catch (err) {
      console.log("Error cargando empeños:", err);
    }
  };

  const fetchTiposArticulos = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/tipos-articulos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTiposArticulos(res.data);
    } catch (err) {
      console.log("Error cargando tipos de artículos:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiBaseUrl}/articulos`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setFormData({ empeno_id: '', tipo_articulo_id: '', descripcion: '', valor_avaluo: '' });
      fetchArticulos();
    } catch (err) {
      console.log("Error creando artículo:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Artículos</h1>
      <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Crear Artículo</button>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Descripción</th>
            <th className="border border-gray-300 px-4 py-2">Tipo</th>
            <th className="border border-gray-300 px-4 py-2">Valor Avalúo</th>
            <th className="border border-gray-300 px-4 py-2">Empeño</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((a) => (
            <tr key={a.id_articulo}>
              <td className="border border-gray-300 px-4 py-2">{a.id_articulo}</td>
              <td className="border border-gray-300 px-4 py-2">{a.descripcion}</td>
              <td className="border border-gray-300 px-4 py-2">{a.tipo_articulo?.nombre || 'N/A'}</td>
              <td className="border border-gray-300 px-4 py-2">${a.valor_avaluo}</td>
              <td className="border border-gray-300 px-4 py-2">{a.empeno?.id_empeno || 'N/A'}</td>
              <td className="border border-gray-300 px-4 py-2">{a.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Crear Artículo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.empeno_id}
                onChange={(e) => setFormData({ ...formData, empeno_id: e.target.value })}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Seleccionar Empeño</option>
                {empenos.map((e) => (
                  <option key={e.id_empeno} value={e.id_empeno}>
                    Empeño {e.id_empeno} - {e.usuario?.nombres || 'Usuario desconocido'}
                  </option>
                ))}
              </select>
              <select
                value={formData.tipo_articulo_id}
                onChange={(e) => setFormData({ ...formData, tipo_articulo_id: e.target.value })}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Seleccionar Tipo de Artículo</option>
                {tiposArticulos.map((t) => (
                  <option key={t.id_tipo_articulo} value={t.id_tipo_articulo}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Valor Avalúo"
                value={formData.valor_avaluo}
                onChange={(e) => setFormData({ ...formData, valor_avaluo: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setIsModalOpen(false); setFormData({ empeno_id: '', tipo_articulo_id: '', descripcion: '', valor_avaluo: '' }); }} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuloArticulos;
