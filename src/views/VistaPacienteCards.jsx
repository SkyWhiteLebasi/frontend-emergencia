import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import echo from "../config/echo";
import { apiLlamarTicketVista } from "../config/api";
import PatientMiniCard from "./PatientMiniCard";
import alertaSonido from "../assets/ringtone1.mp3";
import "./style.css";

const audio = new Audio(alertaSonido);
audio.volume = 1.0;

function VistaPacienteCards() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sonidoHabilitado, setSonidoHabilitado] = useState(false);
  const [blinkingIds, setBlinkingIds] = useState([]);

  // Modifica la función ordenarTickets para que sea más robusta
  const ordenarTickets = (tickets) => {
    return [...tickets].sort((a, b) => {
      const ordenEstados = {
        llamando: 0,
        "en espera": 1,
        "no respondio": 2,
      };

      const ordenA = ordenEstados[a.estado?.toLowerCase()] || 3;
      const ordenB = ordenEstados[b.estado?.toLowerCase()] || 3;

      if (ordenA !== ordenB) return ordenA - ordenB;

      return new Date(b.updated_at) - new Date(a.updated_at);
    });
  };

  const fetchData = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(apiLlamarTicketVista, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        // Ordenar los datos antes de guardarlos en el estado
        const datosOrdenados = ordenarTickets(response.data.data);
        setData(datosOrdenados);
      }
    } catch (error) {
      console.log("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const canal = echo.channel("canal-pacientes");

    // Modifica los listeners para que siempre ordenen los datos
    // evento-creado
    canal.listen(".evento-creado", (e) => {
      const ticket = withNombreAbreviado(e.ticket);
      setData((prev) => {
        const yaExiste = prev.some((p) => p.id === ticket.id);
        const nuevosDatos = yaExiste ? prev : [...prev, ticket];
        return ordenarTickets(ensureNombreAbreviado(nuevosDatos));
      });
    });
    // evento-llamado (al hacer merge, re-deriva)
    canal.listen(".evento-llamado", (e) => {
      if (e.ticket.estado === "llamando" && sonidoHabilitado) {
        audio.play().catch(() => {});
      }
      const ticket = withNombreAbreviado(e.ticket);
      setData((prev) => {
        const updated = prev.map((p) =>
          p.id === ticket.id ? withNombreAbreviado({ ...p, ...ticket }) : p
        );
        return ordenarTickets(ensureNombreAbreviado(updated));
      });

      // Efecto de parpadeo
      if (e.ticket.estado === "llamando") {
        setBlinkingIds((prev) => [...prev, e.ticket.id]);
        setTimeout(() => {
          setBlinkingIds((prev) => prev.filter((id) => id !== e.ticket.id));
        }, 3000);
      }
    });

    canal.listen(".evento-atendido", (e) => {
      setData((prev) =>
        ordenarTickets(prev.filter((p) => p.id !== e.ticketId))
      );
    });

    canal.listen(".evento-en-atencion", (e) => {
      setData((prev) =>
        ordenarTickets(prev.filter((p) => p.id !== e.ticketId))
      );
    });
    return () => {
      echo.leave("canal-pacientes");
    };
  }, [sonidoHabilitado]);

  // Orden de las columnas
  const estadosOrden = ["llamando", "en espera", "no respondio"];
  const estadoColores = {
    llamando: "bg-white-300 bg-opacity-20", // Amarillo semitransparente
    "en espera": "bg-white-300 bg-opacity-20", // Azul semitransparente
    "no respondio": "bg-white-300 bg-opacity-20", // Rojo semitransparente
  };

  const withNombreAbreviado = (t) => {
    if (t?.nombre_abreviado && t.nombre_abreviado.trim()) return t;

    const nombre = (t?.nombre || "").trim();
    const apeP = (t?.apel_paterno || "").trim();
    if (nombre && apeP) {
      return { ...t, nombre_abreviado: `${nombre.split(" ")[0]} ${apeP}` };
    }

    const full = (t?.nombre_completo || "").trim();
    if (full) {
      const parts = full.split(/\s+/);
      const abre = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0];
      return { ...t, nombre_abreviado: abre || "" };
    }

    return { ...t, nombre_abreviado: "" };
  };

  const ensureNombreAbreviado = (tickets) => tickets.map(withNombreAbreviado);

  return (
    <div className="bg-sala-espera min-h-screen">
      <div className="relative z-10 p-4 md:p-6 max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-5xl font-bold text-white mb-2">
              🏥 Sala de Espera Virtual
            </h1>
            <hr />
            {/* <div className="h-1 bg-white bg-opacity-30 w-full my-4 rounded-full"></div> */}
            {/* <p className="text-white text-sm opacity-80">Sistema de seguimiento de turnos en tiempo real</p> */}
          </div>

          <div className="flex items-center gap-2">
            {!sonidoHabilitado ? (
              <button
                onClick={() => setSonidoHabilitado(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <span>🔇</span> Activar notificaciones de voz
              </button>
            ) : (
              <button
                onClick={() => setSonidoHabilitado(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <span>🔊</span> Silenciar notificaciones
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              <p className="text-white text-lg mt-4">
                Cargando información de turnos...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {estadosOrden.map((estado) => {
              const pacientesFiltrados = data.filter(
                (p) => p.estado?.toLowerCase() === estado
              );

              return (
                <div
                  key={estado}
                  className={`rounded-xl p-4 ${estadoColores[estado]}`}
                >
                  <h2 className="text-center text-lg font-bold text-white uppercase mb-4 p-2 rounded-md bg-black bg-opacity-30">
                    {estado === "llamando" &&
                      "📞 Llamando - Acerquese al Tópico"}
                    {estado === "en espera" &&
                      "⏳ En Espera - Esté atento a su turno"}
                    {estado === "no respondio" &&
                      "❌ No Respondió - Vuelva a tomar turno"}
                  </h2>
                  <div className="flex flex-col gap-4">
                    {pacientesFiltrados.length > 0 ? (
                      pacientesFiltrados.map((paciente) => (
                        <PatientMiniCard
                          key={paciente.id}
                          paciente={paciente}
                          blinking={blinkingIds.includes(paciente.id)}
                          highlight={paciente.estado === "no respondio"}
                        />
                      ))
                    ) : (
                      <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
                        <p className="text-white text-lg font-medium">
                          No hay pacientes
                        </p>
                        <p className="text-white text-opacity-70 text-sm mt-1">
                          en esta categoría
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default VistaPacienteCards;
