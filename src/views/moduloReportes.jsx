import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Button } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from "../context/useAuth";

const ModuloReportes = () => {
  const { token, apiBaseUrl } = useAuth();
  const [statsResumen, setStatsResumen] = useState({ totalPrestamosActivos: 0, valorTotalActivo: 0 });
  const [interesesMensuales, setInteresesMensuales] = useState([]);
  const [empenosPorTipo, setEmpenosPorTipo] = useState([]);
  const [historialEmpenos, setHistorialEmpenos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filters, setFilters] = useState({
    usuario_id: '',
    mes: '',
    anio: new Date().getFullYear().toString()
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchUsuarios();
  }, [filters]);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(response.data);
    } catch (error) {
      console.log("Error cargando usuarios:", error);
    }
  };

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.usuario_id) params.append('usuario_id', filters.usuario_id);
      if (filters.mes) params.append('mes', filters.mes);
      if (filters.anio) params.append('anio', filters.anio);

      const [res1, res2, res3, res4] = await Promise.all([
        axios.get(`${apiBaseUrl}/stats-resumen?${params}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiBaseUrl}/intereses-mensuales?${params}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiBaseUrl}/empenos-por-tipo`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiBaseUrl}/historial-empenos?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStatsResumen(res1.data);
      setInteresesMensuales(res2.data);
      setEmpenosPorTipo(res3.data);
      setHistorialEmpenos(res4.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Historial de Empeños', 20, 10);
    const tableColumn = ['Cliente', 'Identificación', 'Valor Préstamo', 'Estado', 'Artículos'];
    const tableRows = [];

    historialEmpenos.forEach(item => {
      const rowData = [
        item.nombre_cliente,
        item.identificacion_cliente,
        item.valor_prestamo,
        item.estado_prestamo,
        item.articulos_resumen
      ];
      tableRows.push(rowData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save('historial_empenos.pdf');
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Cliente', 'Identificación', 'Valor Préstamo', 'Estado', 'Artículos'],
      ...historialEmpenos.map(item => [
        item.nombre_cliente,
        item.identificacion_cliente,
        item.valor_prestamo,
        item.estado_prestamo,
        item.articulos_resumen
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'historial_empenos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reportes y Estadísticas</h1>

      {/* Filtros */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.usuario_id}
            onChange={(e) => setFilters({ ...filters, usuario_id: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Todos los usuarios</option>
            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.nombres}
              </option>
            ))}
          </select>
          <select
            value={filters.mes}
            onChange={(e) => setFilters({ ...filters, mes: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Todos los meses</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Año"
            value={filters.anio}
            onChange={(e) => setFilters({ ...filters, anio: e.target.value })}
            className="border p-2 rounded"
            min="2020"
            max="2030"
          />
          <button
            onClick={fetchReports}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : 'Generar Reporte'}
          </button>
        </div>
      </div>

      {/* Reporte 1: Total de préstamos activos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Total de Préstamos Activos</h2>
        <p>Total Préstamos: {statsResumen.totalPrestamosActivos}</p>
        <p>Valor Total: ${statsResumen.valorTotalActivo}</p>
      </div>

      {/* Reporte 2: Ingresos por intereses mensuales */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Ingresos por Intereses Mensuales</h2>
        {interesesMensuales.length > 0 ? (
          <BarChart width={600} height={300} data={interesesMensuales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="valor" fill="#8884d8" />
          </BarChart>
        ) : (
          <p className="text-gray-500">No hay datos para los filtros seleccionados.</p>
        )}
      </div>

      {/* Reporte 3: Cantidad de empeños por tipo de artículo */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Cantidad de Empeños por Tipo de Artículo</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={empenosPorTipo}
            cx={200}
            cy={200}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {empenosPorTipo.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Reporte 4: Historial de empeños por usuario */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Historial de Empeños por Usuario</h2>
          <div className="flex gap-2">
            <button onClick={exportToPDF} className="bg-blue-500 text-white px-4 py-2 rounded">Exportar a PDF</button>
            <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded">Exportar a Excel</button>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Cliente</th>
              <th className="border border-gray-300 px-4 py-2">Identificación</th>
              <th className="border border-gray-300 px-4 py-2">Valor Préstamo</th>
              <th className="border border-gray-300 px-4 py-2">Estado</th>
              <th className="border border-gray-300 px-4 py-2">Artículos</th>
            </tr>
          </thead>
          <tbody>
            {historialEmpenos.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{item.nombre_cliente}</td>
                <td className="border border-gray-300 px-4 py-2">{item.identificacion_cliente}</td>
                <td className="border border-gray-300 px-4 py-2">${item.valor_prestamo}</td>
                <td className="border border-gray-300 px-4 py-2">{item.estado_prestamo}</td>
                <td className="border border-gray-300 px-4 py-2">{item.articulos_resumen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModuloReportes;
