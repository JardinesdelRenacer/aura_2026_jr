"use client";

import { useState, useEffect } from 'react';

interface Sede {
  id: string;
  nombre: string;
  numeroSalas: number;
  salaVip: boolean;
  adminId?: string | null;
  admin?: {
    id: string;
    nombres: string;
    apellidos: string;
  } | null;
}

interface Props {
  sede: Sede | null;
  usuarios: any[];
  onSave: (sedeData: Partial<Sede>) => void;
  onClose: () => void;
}

export default function EditSedeForm({ sede, usuarios, onSave, onClose }: Props) {
  const [nombre, setNombre] = useState('');
  const [numeroSalas, setNumeroSalas] = useState(1);
  const [salaVip, setSalaVip] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    if (sede) {
      setNombre(sede.nombre);
      setNumeroSalas(sede.numeroSalas);
      setSalaVip(sede.salaVip);
      setAdminId(sede.adminId || sede.admin?.id || null);
    }
  }, [sede]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: sede?.id,
      nombre,
      numeroSalas,
      salaVip,
      adminId: adminId,
    });
  };

  if (!sede) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {sede.id ? 'Editar Sede' : 'Crear Sede'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Nombre de la Sede</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Encargado de Sede</label>
            <select
              value={adminId || ""}
              onChange={(e) => setAdminId(e.target.value || null)}
              className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin asignar</option>
              {/* Filtramos para mostrar solo usuarios con rol de ADMIN */}
              {usuarios.filter(u => u.role === 'ADMIN').map(admin => (
                <option key={admin.id} value={admin.id}>
                  {admin.nombres} {admin.apellidos} ({admin.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Número de Salas</label>
            <input
              type="number"
              min="1"
              max="10"
              value={numeroSalas}
              onChange={(e) => setNumeroSalas(Number(e.target.value))}
              className="w-full p-3 border border-slate-300 rounded-lg"
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="salaVip"
              checked={salaVip}
              onChange={(e) => setSalaVip(e.target.checked)}
              className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="salaVip" className="text-sm font-bold text-slate-700">
              ¿Tiene Sala VIP?
            </label>
          </div>
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-200 text-slate-800 font-bold rounded-lg hover:bg-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
