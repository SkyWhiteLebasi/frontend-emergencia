import PropTypes from "prop-types";

const prioridadConfig = {
  1: {
    color: "border-red-500",
    bg: "bg-white",
    headerBg: "bg-red-700", // Rojo muy oscuro
    texto: "Emergencia",
    flightCode: "PRIORIDAD 1",
  },
  2: {
    color: "border-orange-500",
    bg: "bg-white",
    headerBg: "bg-orange-600", // Naranja oscuro
    texto: "Urgente",
    flightCode: "PRIORIDAD 2",
  },
  3: {
    color: "border-yellow-500",
    bg: "bg-white",
    headerBg: "bg-yellow-600", // Amarillo oscuro
    texto: "Alta",
    flightCode: "PRIORIDAD 3",
  },
  4: {
    color: "border-green-500",
    bg: "bg-white",
    headerBg: "bg-green-600", // Verde oscuro
    texto: "Media",
    flightCode: "PRIORIDAD 4",
  },
  5: {
    color: "border-blue-500",
    bg: "bg-white",
    headerBg: "bg-blue-600", // Azul oscuro
    texto: "Baja",
    flightCode: "PRIORIDAD 5",
  },
};

const estadoConfig = {
  llamando: { texto: "Llamando", icon: "📞", bg: "bg-gray-800" },
  "en espera": { texto: "En espera", icon: "⏳", bg: "bg-[#FF5733]" },
  "no respondio": { texto: "No respondió", icon: "❌", bg: "bg-[#C70039]" },
  atendido: { texto: "Atendido", icon: "✅", bg: "bg-green-600" },
};

const PatientMiniCard = ({ paciente }) => {
  const prioridad = prioridadConfig[paciente.prioridad_id] || {
    texto: "Sin prioridad",
    color: "border-gray-400",
    bg: "bg-gray-100",
    flightCode: "000-000",
  };

  const estado = estadoConfig[paciente.estado?.toLowerCase()] || {
    texto: "Desconocido",
    icon: "❔",
    bg: "bg-gray-500", // color por defecto
  };

  return (
    <div
      className={`relative w-full rounded-xl shadow-lg overflow-hidden border-l-4 ${
        prioridad.color
      } ${prioridad.bg} ${
        paciente.estado === "llamando" ? "blinking-row" : ""
      }`}
    >
      <header
        className={`${
          prioridad.headerBg || estado.bg
        }  text-white flex justify-between items-center px-4 py-2`}
      >
        <span className="text-xs font-semibold">{prioridad.flightCode}</span>
        <span className="text-xl font-bold tracking-wider">
          {paciente.codigo_publico}
        </span>
      </header>

      <div className="flex justify-between px-4 py-3 text-gray-800">
        <div>
          <small className="text-xs text-gray-500">Paciente</small>
          <p className="font-semibold text-lg truncate">
            {paciente.nombre_completo}
          </p>
        </div>
        {/* <div className="text-right">
          <small className="text-xs text-gray-500">Código</small>
          <p className="text-md font-bold">🎫 {paciente.codigo_publico}</p>
        </div> */}
      </div>

       <div className="flex justify-between px-4 py-3 text-gray-800">
        <div>
          <small className="text-xs text-gray-500">TOPICO ASIGNADO</small>
          <p className="font-semibold text-lg truncate">
            {paciente.servintern}
          </p>
        </div>
      </div>

      <div className="flex justify-between px-4 py-2 border-t border-dashed border-gray-400 text-sm">
        <div>
          <small className="text-xs text-gray-500 font-semibold ">Estado</small>
          <p className="text-xs text-gray-500">
            {estado.icon} {estado.texto}
          </p>
        </div>
        <div>
          <small className="text-xs text-gray-500 font-semibold ">Nivel</small>
          <p className="text-xs text-gray-500">{prioridad.texto}</p>
        </div>
      </div>

      <footer className="bg-gray-200 px-4 py-2 text-xs text-gray-600">
        <p>
          🕒 Última actualización:{" "}
          {new Date(paciente.updated_at).toLocaleTimeString()}
        </p>
      </footer>
    </div>
  );
};

export default PatientMiniCard;
PatientMiniCard.propTypes = {
  paciente: PropTypes.shape({
    codigo_publico: PropTypes.string.isRequired,
    nombre_completo: PropTypes.string.isRequired,
    prioridad_id: PropTypes.number.isRequired,
    estado: PropTypes.string,
    updated_at: PropTypes.string.isRequired,
  }).isRequired,
};
