import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import UserList from "./UserList";
import RoomList from "./RoomList";
import Chat from "./Chat";
import { useParams } from "react-router-dom";

const RoomPage = () => {
  const { roomName } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", roomName);

    socket.on("users", (data) => {
      setUsers(data);
    });

    socket.on("chat", () => {
      console.log("chat");
    });

    return () => {
      socket.off("users");
      socket.off("chat");
    };
  }, [roomName]);

  return (
    <div className="roomPage">
      <RoomList />
      <Chat roomName={roomName} />
      <UserList users={users} />
    </div>
  );
};

export default RoomPage;
