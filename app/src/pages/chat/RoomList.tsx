import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import { useNavigate } from "react-router-dom";

const RoomList = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");

  // useEffect(() => {
  //   socket.on("userJoined", (data) => {
  //     console.log(data);
  //     setRooms(data);
  //   });
  // }, []);

  useEffect(() => {
    socket.on("rooms", (data) => {
      setRooms(data);
      // console.log(data);
    });
  }, []);

  const handleCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    joinRoom(newRoom);
  };

  const handleJoinRoom = (name: string) => {
    // console.log(name);
    navigate(`/rooms/${name}`);
  };

  const joinRoom = (newRoom: string) => {
    socket.emit("joinRoom", newRoom);
  };

  return (
    <div>
      <p>RoomLists</p>
      <form onClick={(e) => handleCreate(e)}>
        <input
          onChange={(e) => setNewRoom(e.target.value)}
          type="text"
          placeholder="Enter a room name"
          name="roomName"
          id="roomName"
        />
        <button type="submit">Create a Room</button>
      </form>
      {rooms.map((room: any) => (
        <div key={room.name}>
          <p onClick={() => handleJoinRoom(room.name)}> {room.name}</p>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
