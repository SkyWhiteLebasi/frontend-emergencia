import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import echo from "../config/echo";
import { apiLlamarTicketVista } from "../config/api";
import PatientMiniCard from "./PatientMiniCard";
import alertaSonido from "../assets/harry.mp3";
import "./style.css";

const audio = new Audio(alertaSonido);
audio.volume = 1.0;

function VistaPacienteCards() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sonidoHabilitado, setSonidoHabilitado] = useState(false);
  const [blinkingIds, setBlinkingIds] = useState([]);
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

    canal.listen(".evento-creado", (e) => {
      setData((prev) => {
        const yaExiste = prev.some((p) => p.id === e.ticket.id);
        return yaExiste ? prev : [...prev, e.ticket];
      });
    });

    canal.listen(".evento-llamado", (e) => {
      // Reproducir sonido solo para estado "llamando"
      if (e.ticket.estado === "llamando" && sonidoHabilitado) {
        audio.play().catch((error) => {
          console.warn("No se pudo reproducir el sonido:", error);
        });
      }

      // Actualizar el ticket en el estado
      setData((prev) =>
        ordenarTickets(
          prev.map((p) => (p.id === e.ticket.id ? { ...p, ...e.ticket } : p))
        )
      );

      // Efecto de parpadeo solo para "llamando"
      if (e.ticket.estado === "llamando") {
        setBlinkingIds((prev) => [...prev, e.ticket.id]);
        setTimeout(() => {
          setBlinkingIds((prev) => prev.filter((id) => id !== e.ticket.id));
        }, 3000);
      }
    });

    canal.listen(".evento-atendido", (e) => {
      // Eliminar ticket atendido
      setData((prev) => prev.filter((p) => p.id !== e.ticketId));
    });

    canal.listen(".evento-en-atencion", (e) => {
      // Eliminar ticket en atención
      setData((prev) => prev.filter((p) => p.id !== e.ticketId));
    });

    return () => {
      echo.leave("canal-pacientes");
    };
  }, [sonidoHabilitado]);

  // Orden de las columnas
  const estadosOrden = ["llamando", "en espera", "no respondio"];

  return (
    <div className="bg-sala-espera">
      <div className="relative z-10 p-6 max-w-8xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-white">🏥 Sala de Espera</h1>
          {!sonidoHabilitado && (
            <button
              onClick={() => setSonidoHabilitado(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow"
            >
              🔊 Activar sonido de notificación
            </button>
          )}
        </div>

        <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />

        {loading ? (
          <p className="text-center text-white text-lg">
            Cargando pacientes...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estadosOrden.map((estado) => {
              const pacientesFiltrados = data.filter(
                (p) => p.estado?.toLowerCase() === estado
              );

              return (
                <div key={estado}>
                  <h2 className="text-center text-lg font-semibold text-white uppercase mb-3">
                    {estado === "no respondio" ? "No Respondió" : estado}
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
                      <p className="text-lg text-white text-center">
                        Sin pacientes...
                      </p>
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
