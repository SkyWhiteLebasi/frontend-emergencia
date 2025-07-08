import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import echo from "../config/echo";
import { apiGetTicketEnableData } from "../config/api";
import PatientMiniCard from "./PatientMiniCard";
import alertaSonido from "../assets/harry.mp3";

const audio = new Audio(alertaSonido);
audio.volume = 1.0;

function VistaPacienteCards() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sonidoHabilitado, setSonidoHabilitado] = useState(false);
  const fetchData = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(apiGetTicketEnableData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 201) {
        setData(response.data.data);
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
      if (e.ticket.estado === "llamando" && sonidoHabilitado) {
        audio.play().catch((error) => {
          console.warn("No se pudo reproducir el sonido:", error);
        });
      }
      setData((prev) =>
        prev.map((p) => (p.id === e.ticket.id ? { ...p, ...e.ticket } : p))
      );
    });

    return () => echo.leave("canal-pacientes");
  }, [sonidoHabilitado]);

  const estadosOrden = [
    "llamando",
    "en espera",
    "no respondio",
    // "atendido"
  ];

  return (
    <div className="bg-sala-espera">
      <div className="relative z-10 p-6 max-w-8xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-white mb-2">
          🏥 Sala de Espera
          {!sonidoHabilitado && (
            <div className="text-center mb-4">
              <button
                onClick={() => setSonidoHabilitado(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow"
              >
                🔊 Activar sonido de notificación
              </button>
            </div>
          )}
        </h1>
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
                    {estado}
                  </h2>
                  <div className="flex flex-col gap-4">
                    {pacientesFiltrados.length > 0 ? (
                      pacientesFiltrados.map((paciente) => (
                        <PatientMiniCard
                          key={paciente.id}
                          paciente={paciente}
                        />
                      ))
                    ) : (
                      <p className="text-lg text-white text-center">
                        Sin pacientes....
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
