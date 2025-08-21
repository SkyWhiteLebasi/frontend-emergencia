import PropTypes from "prop-types";
import PersonaRoja from "../assets/img/persona-roja.png";
import PersonaNaranja from "../assets/img/persona-naranja.png";
import PersonaAmarilla from "../assets/img/persona-amarilla.png";
import PersonaVerde from "../assets/img/persona-verde.png";
import PersonaAzul from "../assets/img/persona-azul.png";
import PersonaDefault from "../assets/img/persona-grey.png";
import "./style.css";

const imagenPrioridad = {
  1: PersonaRoja,
  2: PersonaNaranja,
  3: PersonaAmarilla,
  4: PersonaVerde,
  5: PersonaAzul,
};

const prioridadConfig = {
  1: { bg: "bg-red-600", texto: "Emergencia", flightCode: "PRIORIDAD 1" },
  2: { bg: "bg-orange-500", texto: "Urgente", flightCode: "PRIORIDAD 2" },
  3: { bg: "bg-yellow-300", texto: "Alta", flightCode: "PRIORIDAD 3" },
  4: { bg: "bg-green-600", texto: "Media", flightCode: "PRIORIDAD 4" },
  5: { bg: "bg-blue-600", texto: "Baja", flightCode: "PRIORIDAD 5" },
  default: {
    bg: "bg-gray-600",
    texto: "Sin Prioridad",
    flightCode: "SIN PRIORIDAD",
  },
};

const estadoConfig = {
  llamando: {
    texto: "LLAMANDO",
    icon: "📢",
    color: "bg-yellow-400 text-black",
  },
  "en espera": {
    texto: "EN ESPERA",
    icon: "⏳",
    color: "bg-green-500 text-white",
  },
  "no respondio": {
    texto: "NO RESPONDIÓ",
    icon: "❌",
    color: "bg-red-500 text-white",
  },
  atendido: { texto: "ATENDIDO", icon: "✅", color: "bg-gray-400 text-black" },
};

const PatientMiniCard = ({ paciente, blinking }) => {
  const prioridad =
    prioridadConfig[paciente.prioridad_id] || prioridadConfig.default;
  const estado = estadoConfig[paciente.estado?.toLowerCase()] || {
    texto: "DESCONOCIDO",
    icon: "❔",
    color: "bg-gray-500 text-white",
  };

  const abreviarServicio = (servintern) => {
    const mapa = {
      "PEDIATRIA 1": "T. PEDIATRIA 1",
      "TOP. CIRUGIA": "T. CIRUGÍA",
      "TOP. TRAUMATOLOGIA": "T. TRAUMATOLOGÍA",
      "MEDICINA 1": "T. MEDICINA 1",
      "MEDICINA 2": "T. MEDICINA 2",
      "MEDICINA 3": "T. MEDICINA 3",
      "GINECOLOGIA Y OBSTETRICIA": "T. GINECOL. OBST.",
    };
    return mapa[servintern?.toUpperCase()] || servintern;
  };

  return (
    <div
      className={`relative w-full rounded-2xl shadow-xl overflow-hidden border-2 transition
        bg-black text-white 
        ${
          blinking
            ? "animate-pulse border-yellow-400 shadow-yellow-400"
            : "border-gray-700"
        }
      `}
    >
      {/* Header */}
      <header
        className={`flex items-center justify-between px-4 py-3 ${prioridad.bg} rounded-t-lg border-b`}
      >
        {/* Servicio con icono */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          <span className="text-xl font-extrabold uppercase tracking-wide text-black">
            {abreviarServicio(paciente.servintern)}
          </span>
        </div>

        {/* Información derecha */}
        <div className="flex items-center gap-3">
          {/* Código público */}
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-semibold text-white">
              {paciente.codigo_publico}
            </span>
          </div>

          {/* Prioridad */}
          <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-bold text-white">
              {prioridad.flightCode}
            </span>
          </div>
        </div>
      </header>
      {/* Ticket grande */}
      {/* Datos del paciente */}
      <div className="flex flex-col items-center py-4 bg-white">
        {/* <p className="text-xs text-gray-400">Paciente</p> */}
        <h1 className="text-5xl font-extrabold tracking-widest text-black drop-shadow-lg">
          {paciente.nombre_abreviado}
        </h1>
      </div>
      {/* <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
        <div>
          <p className="text-xs text-gray-400"> Número de Ticket</p>
          <p className="text-lg font-bold">{paciente.codigo_publico}</p>
        </div>
        <img
          src={imagenPrioridad[paciente.prioridad_id] || PersonaDefault}
          alt="icono paciente"
          className="w-12 h-12 object-contain"
        />
      </div> */}
      {/* Estado + Prioridad */}
      <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-100">
        <span
          className={`flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-lg ${estado.color}`}
        >
          {estado.icon} {estado.texto}
        </span>
        <span
          className={`flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-lg text-black`}
        >
          🕒 {new Date(paciente.updated_at).toLocaleTimeString()}
        </span>
        <img
          src={imagenPrioridad[paciente.prioridad_id] || PersonaDefault}
          alt="icono paciente"
          className="w-12 h-12 object-contain"
        />
      </div>
      {/* Footer */}
      {/* <footer className="bg-gray-900 px-4 py-2 text-xs text-gray-400 text-right">
        🕒 {new Date(paciente.updated_at).toLocaleTimeString()}
      </footer> */}
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre_abreviado: PropTypes.string, // opcional, ahora puede venir o derivarse
    nombre: PropTypes.string,
    apel_paterno: PropTypes.string,
    servintern: PropTypes.string,
  }).isRequired,
  blinking: PropTypes.bool,
};
