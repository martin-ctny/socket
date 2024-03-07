import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SigninPage from "./pages/auth/SigninPage";
import SignupPage from "./pages/auth/SignupPage";
import RoomPage from "./pages/chat/RoomPage";
import { useState } from "react";
import { SocketProvider } from "./context/context";

function App() {
  const [user, setUser] = useState(null);
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/signin" element={<SigninPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/rooms/:roomName" element={<RoomPage />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
