import React from 'react';

export const metadata = {
  title: 'Asistente Curricular Minedu - Generador PCA y Sesiones',
  description: 'Plataforma inteligente de planificación curricular para docentes de Educación Primaria del Perú.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-sans">
        <header className="bg-red-700 text-white shadow-md py-4 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🇵🇪</span>
            <div>
              <h1 className="font-bold text-lg leading-tight">Planificador Curricular Minedu</h1>
              <p className="text-xs text-red-100">Educación Primaria — CNEB</p>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6">
          {children}
        </main>

        <footer className="bg-slate-100 border-t text-center py-4 text-xs text-slate-500">
          Desarrollado para docentes del Perú — Alineado al Currículo Nacional de Educación Básica
        </footer>
      </body>
    </html>
  );
}
