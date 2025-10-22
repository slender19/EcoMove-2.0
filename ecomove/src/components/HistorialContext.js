import React, { createContext, useState } from "react";

export const HistorialContext = createContext();

export const HistorialProvider = ({ children }) => {
  const [historial, setHistorial] = useState([]);

  const agregarViaje = (viaje) => {
    setHistorial([...historial, viaje]);
  };

  return (
    <HistorialContext.Provider value={{ historial, agregarViaje }}>
      {children}
    </HistorialContext.Provider>
  );
};
