import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

const ModuloEmpenos = () => {
  const { token, apiBaseUrl } = useAuth();
  const [articulos, setArticulos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tiposArticulos, setTiposArticulos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTipoModalOpen, setIsTipoModalOpen] = useState(false);
  const [editingEmpeno, setEditingEmpeno] = useState(null);
  const [formData, setFormData] = useState({
    usuarioId: '',
    descripcion: '',
    interes_porcentaje: '',
    meses: '',
    articulos: [{ descripcion: '', tipo_articulo_id: '', valor: '' }]
  });
  const [tipoFormData, setTipoFormData] = useState({
    nombre: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchArticulos();
    fetchUsuarios();
    fetchTiposArticulos();
    
  }, [token]);

  const fetchArticulos = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/articulos`, { headers: { Authorization: `Bearer ${token}` } });
      // Filter only pawned articles
      const empenados = response.data.filter(art => art.estado === 'EMPENADO');
      setArticulos(empenados);
    } catch (error) {
      console.error('Error fetching artículos:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/usuarios`, { headers: { Authorization: `Bearer ${token}` } });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const fetchTiposArticulos = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/tipos-articulos`, { headers: { Authorization: `Bearer ${token}` } });
      setTiposArticulos(response.data);
    } catch (error) {
      console.error('Error fetching tipos articulos:', error);
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmpeno) {
        await axios.put(`${apiBaseUrl}/empenos/${editingEmpeno.id_empeno}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${apiBaseUrl}/empenos`, formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchArticulos();
      setIsModalOpen(false);
      setEditingEmpeno(null);
      resetForm();
    } catch (error) {
      console.error('Error saving empeño:', error);
    }
  };


  const handleSubmitTipoArticulo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiBaseUrl}/tipos-articulos`, tipoFormData, { headers: { Authorization: `Bearer ${token}` } });
      fetchTiposArticulos();
      setIsTipoModalOpen(false);
      setTipoFormData({ nombre: '' });
    } catch (error) {
      console.error('Error creating tipo de artículo:', error);
      alert(error.response?.data?.error || 'Error al crear tipo de artículo');
    }
  };

  

  

  

  const addArticulo = () => {
    setFormData({
      ...formData,
      articulos: [...formData.articulos, { descripcion: '', tipo_articulo_id: '', valor: '' }]
    });
  };

  const updateArticulo = (index, field, value) => {
    const newArticulos = [...formData.articulos];
    newArticulos[index][field] = value;
    setFormData({ ...formData, articulos: newArticulos });
  };

  const resetForm = () => {
    setFormData({
      usuarioId: '',
      descripcion: '',
      interes_porcentaje: '',
      meses: '',
      articulos: [{ descripcion: '', tipo_articulo_id: '', valor: '' }]
    });
  };

  const filteredArticulos = articulos.filter((articulo) =>
    articulo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (articulo.empeno?.usuario?.nombres || '').toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Artículos Empeñados</h1>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Nuevo Empeño</button>
        <button onClick={() => setIsTipoModalOpen(true)} className="bg-purple-500 text-white px-4 py-2 rounded">Crear Tipo de Artículo</button>
      </div>
      <input
        type="text"
        placeholder="Buscar por descripción del artículo o nombre del usuario..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Usuario que Empeñó</th>
            <th className="border border-gray-300 px-4 py-2">Artículo Empeñado</th>
            <th className="border border-gray-300 px-4 py-2">Tipo de Artículo</th>
            <th className="border border-gray-300 px-4 py-2">Meses</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticulos.map((articulo) => (
            <tr key={articulo.id_articulo}>
              <td className="border border-gray-300 px-4 py-2">{articulo.empeno?.usuario?.nombres || 'N/A'}</td>
              <td className="border border-gray-300 px-4 py-2">{articulo.descripcion}</td>
              <td className="border border-gray-300 px-4 py-2">{articulo.tipo_articulo?.nombre || 'N/A'}</td>
              <td className="border border-gray-300 px-4 py-2">{articulo.empeno?.meses || 'N/A'}</td>
              <td className="border border-gray-300 px-4 py-2">{articulo.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingEmpeno ? 'Editar Empeño' : 'Nuevo Empeño'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.usuarioId}
                onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Seleccionar Usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.nombres}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Descripción del Empeño"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Porcentaje de Interés"
                value={formData.interes_porcentaje}
                onChange={(e) => setFormData({ ...formData, interes_porcentaje: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Meses"
                value={formData.meses}
                onChange={(e) => setFormData({ ...formData, meses: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />

              <div>
                <h3 className="text-lg font-semibold">Artículos</h3>
                {formData.articulos.map((articulo, index) => (
                  <div key={index} className="space-y-2 border p-2 rounded mt-2">
                    <input
                      type="text"
                      placeholder="Descripción del Artículo"
                      value={articulo.descripcion}
                      onChange={(e) => updateArticulo(index, 'descripcion', e.target.value)}
                      className="w-full border p-2 rounded"
                      required
                    />
                    <select
                      value={articulo.tipo_articulo_id}
                      onChange={(e) => updateArticulo(index, 'tipo_articulo_id', e.target.value)}
                      className="w-full border p-2 rounded"
                      required
                    >
                      <option value="">Seleccionar Tipo</option>
                      {tiposArticulos.map((tipo) => (
                        <option key={tipo.id_tipo_articulo} value={tipo.id_tipo_articulo}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Valor Avalúo"
                      value={articulo.valor}
                      onChange={(e) => updateArticulo(index, 'valor', e.target.value)}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                ))}
                <button type="button" onClick={addArticulo} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">Agregar Artículo</button>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingEmpeno(null); resetForm(); }} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {isTipoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Crear Tipo de Artículo</h2>
            <form onSubmit={handleSubmitTipoArticulo} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del Tipo"
                value={tipoFormData.nombre}
                onChange={(e) => setTipoFormData({ ...tipoFormData, nombre: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setIsTipoModalOpen(false); setTipoFormData({ nombre: '' }); }} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
                <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">Crear Tipo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuloEmpenos;
