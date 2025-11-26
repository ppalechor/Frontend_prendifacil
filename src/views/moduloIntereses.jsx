import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";

const ModuloIntereses = () => {
  const { token, apiBaseUrl, currentUser } = useAuth();
  const [prestamos, setPrestamos] = useState([]);
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [intereses, setIntereses] = useState([]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const url = currentUser?.role === 'ADMIN' ? `${apiBaseUrl}/prestamos` : `${apiBaseUrl}/prestamos/mios`;
        const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        setPrestamos(res.data || []);
      } catch {
        setPrestamos([]);
      }
    })();
  }, [token, apiBaseUrl, currentUser]);

  const fetchPrestamos = async () => {
    try {
      const url = currentUser?.role === 'ADMIN' ? `${apiBaseUrl}/prestamos` : `${apiBaseUrl}/prestamos/mios`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setPrestamos(res.data || []);
    } catch {
      setPrestamos([]);
    }
  };

  const fetchIntereses = async (prestamoId) => {
    try {
      const res = await axios.get(`${apiBaseUrl}/intereses/prestamo/${prestamoId}` , { headers: { Authorization: `Bearer ${token}` } });
      setIntereses(res.data || []);
    } catch {
      setIntereses([]);
    }
  };

  const handleSelectPrestamo = (prestamo) => {
    setSelectedPrestamo(prestamo);
    fetchIntereses(prestamo.id_prestamo);
  };

  const handleMarkAsPaid = async (interesId) => {
    try {
      await axios.put(`${apiBaseUrl}/intereses/${interesId}/estado`, { estado: 'PAGADO' }, { headers: { Authorization: `Bearer ${token}` } });
      // Check if all intereses are paid
      const updatedIntereses = intereses.map(i =>
        i.id_interes === interesId ? { ...i, estado: 'PAGADO' } : i
      );
      setIntereses(updatedIntereses);
      const allPaid = updatedIntereses.every(i => i.estado === 'PAGADO');
      if (allPaid) {
        await axios.put(`${apiBaseUrl}/prestamos/${selectedPrestamo.id_prestamo}/estado`, { estado: 'PAGADO' }, { headers: { Authorization: `Bearer ${token}` } });
        setSelectedPrestamo({ ...selectedPrestamo, estado: 'PAGADO' });
        fetchPrestamos(); // Update the list
      }
    } catch {
      // Silencio de error
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Intereses</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Seleccionar Préstamo</label>
        <select
          value={selectedPrestamo?.id_prestamo || ''}
          onChange={(e) => {
            const prestamo = prestamos.find(p => p.id_prestamo === Number(e.target.value));
            handleSelectPrestamo(prestamo);
          }}
          className="w-full border p-2 rounded"
        >
          <option value="">Selecciona un préstamo</option>
          {prestamos.map((p) => (
            <option key={p.id_prestamo} value={p.id_prestamo}>
              {currentUser?.role === 'ADMIN'
                ? `Préstamo ${p.id_prestamo} - ${p.empeno?.usuario?.nombres} - Estado: ${p.estado}`
                : `Préstamo ${p.id_prestamo} - Estado: ${p.estado}`}
            </option>
          ))}
        </select>
      </div>

      {selectedPrestamo && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Intereses del Préstamo {selectedPrestamo.id_prestamo} - Estado: {selectedPrestamo.estado}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {intereses.map((interes) => (
              <div key={interes.id_interes} className="border p-4 rounded shadow">
                <h3 className="font-bold">Mes {interes.mes}</h3>
                <p>Fecha: {new Date(interes.fecha_interes).toLocaleDateString()}</p>
                <p>Valor: ${interes.valor.toFixed(2)}</p>
                <p>Estado: {interes.estado}</p>
                {interes.estado === 'PENDIENTE' && currentUser?.role === 'ADMIN' && (
                  <button
                    onClick={() => handleMarkAsPaid(interes.id_interes)}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Marcar como Pagado
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuloIntereses;
