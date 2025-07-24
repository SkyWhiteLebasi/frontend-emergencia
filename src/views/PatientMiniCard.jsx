import PropTypes from "prop-types";
import PersonaRoja from "../assets/img/persona-roja.png";
import PersonaNaranja from "../assets/img/persona-naranja.png";
import PersonaAmarilla from "../assets/img/persona-amarilla.png";
import PersonaVerde from "../assets/img/persona-verde.png";
import PersonaAzul from "../assets/img/persona-azul.png";
import "./style.css";
const imagenPrioridad = {
  1: PersonaRoja,
  2: PersonaNaranja,
  3: PersonaAmarilla,
  4: PersonaVerde,
  5: PersonaAzul,
};

const prioridadConfig = {
  1: {
    color: "border-red-500",
    textColor: "text-red-500",
    bg: "bg-white",
    headerBg: "bg-red-700", // Rojo muy oscuro
    texto: "Emergencia",
    flightCode: "PRIORIDAD 1",
  },
  2: {
    color: "border-orange-400",
    textColor: "text-orange-400",
    bg: "bg-white",
    headerBg: "#ea8129", // Naranja oscuro
    texto: "Urgente",
    flightCode: "PRIORIDAD 2",
  },
  3: {
    color: "border-yellow-500",
    textColor: "text-yellow-500",
    bg: "bg-white",
    headerBg: "#FFD700", // Amarillo dorado
    texto: "Alta",
    flightCode: "PRIORIDAD 3",
  },
  4: {
    color: "border-green-500",
    textColor: "text-green-500",
    bg: "bg-white",
    headerBg: "bg-green-600", // Verde oscuro
    texto: "Media",
    flightCode: "PRIORIDAD 4",
  },
  5: {
    color: "border-blue-500",
    textColor: "text-blue-500",
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

const PatientMiniCard = ({ paciente, blinking }) => {
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
      className={`relative w-full rounded-xl shadow-md overflow-hidden border-l-4
        ${prioridad.color} ${prioridad.bg} ${blinking ? "blink-3s" : ""}
      `}
    >
      <header
        className={`${
          prioridad.headerBg || estado.bg
        } text-white flex justify-between items-center px-4 py-3 rounded-t-xl`}
        style={{
          backgroundColor: prioridad.headerBg || "#4B5563",
          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
        }}
      >
        <span className="text-md font-extrabold tracking-widest uppercase">
          {paciente.servintern}
        </span>
        <span className="text-sm font-semibold">{prioridad.flightCode}</span>
        <span className="text-sm font-bold tracking-wider">
          {paciente.codigo_publico}
        </span>
      </header>

      <div className="flex items-center justify-between px-3 py-1 text-gray-800">
        <div className="flex flex-col">
          <small className="text-[10px] text-gray-500">Paciente</small>
          <p className="font-bold text-xl text-gray-800">
            {paciente.nombre_completo}
          </p>
        </div>
        <img
          src={imagenPrioridad[paciente.prioridad_id]}
          alt="icono paciente"
          className="w-10 h-10 object-contain"
        />
      </div>

      <div className="flex justify-between px-3 py-1 border-t border-dashed border-gray-400 text-xs">
        <div>
          <small className="text-[10px] text-gray-500 font-semibold">
            Estado
          </small>
          <p className="text-[11px] text-gray-500">
            {estado.icon} {estado.texto}
          </p>
        </div>
        <div>
          <small className="text-[10px] text-gray-500 font-semibold">
            Nivel
          </small>
          <p className="text-[11px] text-gray-500">{prioridad.texto}</p>
        </div>
      </div>

      <footer className="bg-gray-200 px-3 py-1 text-[10px] text-gray-600">
        🕒 {new Date(paciente.updated_at).toLocaleTimeString()}
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
    id: PropTypes.number.isRequired,
  }).isRequired,
  blinking: PropTypes.bool,
};
