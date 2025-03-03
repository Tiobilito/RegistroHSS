// Función para formatear la fecha y hora
export const formatearFechaHora = (fecha) => {
  const opciones = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return fecha.toLocaleString("es-ES", opciones).replace(",", " a las");
};

// Función para calcular la diferencia en formato HH:MM:SS
export const calcularDiferenciaHoras = (inicio, fin) => {
  const diffMs = fin - inicio;
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);
  return `${diffHrs.toString().padStart(2, "0")}:${diffMins
    .toString()
    .padStart(2, "0")}:${diffSecs.toString().padStart(2, "0")}`;
};

export const sumarTiempos = (tiempoStrings) => {
  let totalSegundos = 0;
  tiempoStrings.forEach((tiempo) => {
    // Validar que el tiempo tenga el formato correcto y evitar errores de NaN
    if (typeof tiempo === "string" && tiempo.includes(":")) {
      const [horas, minutos, segundos] = tiempo.split(":").map(Number);

      // Validar que horas, minutos y segundos sean números válidos
      if (!isNaN(horas) && !isNaN(minutos) && !isNaN(segundos)) {
        totalSegundos += horas * 3600 + minutos * 60 + segundos;
      }
    }
  });
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  return `${horas}:${minutos.toString().padStart(2, "0")}:${segundos
    .toString()
    .padStart(2, "0")}`;
};
