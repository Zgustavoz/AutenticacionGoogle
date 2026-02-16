function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          403
        </h1>
        <p className="text-gray-600 mb-6">
          {/* No tienes permisos para acceder a esta página. */}
          VUELVE Y INICIA SESION RATA 
        </p>

        <a
          href="/"
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

export default Unauthorized;