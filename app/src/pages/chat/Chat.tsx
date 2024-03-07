import React, { useEffect, useState } from "react";
import socket from "../../utils/socket";

const Chat = ({ roomName }) => {
  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [actualRoom, setActualRoom] = useState([]);
  // const [receiveMessage, setReceiveMessage] = useState("");

  // useEffect(() => {
  //   socket.on("sendChat", (data) => {
  //     setReceiveMessage(data);
  //     // console.log(data.user);

  //     console.log("data", data);
  //   });
  // }, []);

  useEffect(() => {
    socket.on("rooms", (data) => {
      setRooms(data);
      // console.log("data", data);
    });
  }, []);

  useEffect(() => {
    const actual = rooms.find((room) => room.name === roomName);
    if (actual) setActualRoom(actual.messages);
  }, [rooms, roomName]);

  useEffect(() => {
    console.log("actualRoom", actualRoom);
  }, [actualRoom]);

  // useEffect(() => {
  //   setMessages([...messages, receiveMessage]);
  // }, [receiveMessage]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    socket.emit("newMessage", { roomName, message });
  };
  const formatTime = (timeString) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(timeString).toLocaleTimeString("fr-FR", options);
  };
  return (
    <div className="chat">
      <div className="allChat">
        {actualRoom &&
          actualRoom.map((message, index) => (
            <div
              key={index}
              className={
                message.user.id === ownSocketId
                  ? "own-message"
                  : "other-message"
              }
            >
              <p>{message.user.name}</p>
              <p>{message.message}</p>
              <p>{formatTime(message.time)}</p>{" "}
            </div>
          ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={handleMessageChange} />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default Chat;
