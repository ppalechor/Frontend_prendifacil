import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../context/useAuth";

const ModuloMisPrestamos = () => {
  const { token, apiBaseUrl } = useAuth();
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${apiBaseUrl}/prestamos/mios`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (mounted) setPrestamos(res.data || []);
      } catch {
        if (mounted) setPrestamos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [token, apiBaseUrl]);

  if (loading) {
    return <div className="p-6">Cargando tus préstamos...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Préstamos</h1>
      {prestamos.length === 0 ? (
        <p className="text-gray-600">No tienes préstamos registrados.</p>
      ) : (
        <div className="space-y-4">
          {prestamos.map((p) => (
            <div key={p.id_prestamo} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Préstamo #{p.id_prestamo}</p>
                  <p className="font-semibold">Estado: {p.estado}</p>
                </div>
                <div className="text-sm text-gray-500">Fecha: {new Date(p.fecha_prestamo).toLocaleDateString()}</div>
              </div>
              {p.empeno && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600">Artículos del empeño</p>
                  <ul className="list-disc ml-6 text-sm">
                    {p.empeno.articulos?.map(a => (
                      <li key={a.id_articulo}>{a.descripcion} — estado {a.estado}</li>
                    ))}
                  </ul>
                </div>
              )}
              {p.intereses && p.intereses.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600">Intereses</p>
                  <ul className="list-disc ml-6 text-sm">
                    {p.intereses.map(i => (
                      <li key={i.id_interes}>Mes {i.mes}: {i.valor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuloMisPrestamos;
