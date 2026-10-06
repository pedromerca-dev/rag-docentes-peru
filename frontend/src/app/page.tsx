'use client';

import React, { useState } from 'react';

export default function Home() {
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    grado: '3.º de Primaria',
    area: 'Comunicación',
    contexto: '',
    periodos: '4 Bimestres',
  });
  const [generando, setGenerando] = useState(false);

  const handleNext = () => setPaso((prev) => Math.min(prev + 1, 3));
  const handlePrev = () => setPaso((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerando(true);
    // Aquí invocaremos la API Route de Next.js para generar el PDF
    setTimeout(() => {
      setGenerando(false);
      alert('¡Programación Curricular Anual generada con éxito!');
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-slate-800">
          Paso {paso} de 3: {paso === 1 ? 'Datos Informativos' : paso === 2 ? 'Diagnóstico & Situación Significativa' : 'Confirmación'}
        </h2>
        <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-red-600 h-full transition-all duration-300"
            style={{ width: `${(paso / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {paso === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Grado de Estudios</label>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={formData.grado}
                onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
              >
                <option>1.º de Primaria</option>
                <option>2.º de Primaria</option>
                <option>3.º de Primaria</option>
                <option>4.º de Primaria</option>
                <option>5.º de Primaria</option>
                <option>6.º de Primaria</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Área Curricular</label>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              >
                <option>Matemática</option>
                <option>Comunicación</option>
                <option>Personal Social</option>
                <option>Ciencia y Tecnología</option>
                <option>Arte y Cultura</option>
                <option>Educación Religiosa</option>
              </select>
            </div>
          </div>
        )}

        {paso === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Contexto / Problemática de la Institución Educativa
              </label>
              <textarea
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                rows={4}
                placeholder="Ejemplo: Poca conciencia ambiental en el manejo de residuos sólidos y bajo nivel en comprensión lectora."
                value={formData.contexto}
                onChange={(e) => setFormData({ ...formData, contexto: e.target.value })}
              />
            </div>
          </div>
        )}

        {paso === 3 && (
          <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-sm">
            <h3 className="font-semibold text-slate-700">Resumen de la solicitud:</h3>
            <p><strong>Grado:</strong> {formData.grado}</p>
            <p><strong>Área:</strong> {formData.area}</p>
            <p><strong>Problemática:</strong> {formData.contexto || 'Sin especificar'}</p>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          {paso > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Anterior
            </button>
          )}

          {paso < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              disabled={generando}
              className="ml-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              {generando ? 'Generando Documento...' : '📄 Generar PCA en PDF'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
