import React, { useState } from 'react';

export default function App() {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const consultarRAG = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregunta.trim()) return;

    setCargando(true);
    setRespuesta('');

    try {
      // AQUÍ SE CONECTA CON LA API DE PYTHON (LOCAL, NGROK O RENDER)
      const res = await fetch('http://localhost:8000/api/rag/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta }),
      });

      const data = await res.json();
      setRespuesta(data.respuesta || 'No se obtuvo respuesta.');
    } catch (error) {
      setRespuesta('Error al conectar con el servidor RAG.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-red-700 mb-2">
          🇵🇪 Asistente Curricular Minedu
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Consulta de forma inteligente el Currículo Nacional de Educación Primaria.
        </p>

        <form onSubmit={consultarRAG} className="space-y-4">
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            rows={3}
            placeholder="Ejemplo: ¿Cuáles son las competencias del área de Matemática en primaria?"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
          />

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {cargando ? 'Buscando en la normativa...' : 'Consultar RAG'}
          </button>
        </form>

        {respuesta && (
          <div className="mt-6 p-4 bg-gray-50 border-l-4 border-red-600 rounded">
            <h3 className="font-semibold text-gray-700 mb-1">Respuesta:</h3>
            <p className="text-gray-600 leading-relaxed">{respuesta}</p>
          </div>
        )}
      </div>
    </div>
  );
}