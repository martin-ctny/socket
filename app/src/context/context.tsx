import { createContext, useEffect, useState } from "react";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    console.log("Nouvelle couleur :", socketId);
  }, [socketId]);

  return (
    <SocketContext.Provider value={{ socketId, setSocketId }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
