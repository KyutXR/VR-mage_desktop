import { useState } from "react";
import Button from "../../feature/Button";
import { NavLink } from "react-router-dom";

function TitlePage() {
  const [roomCode, setRoomCode] = useState("");
  return (
    <>
      <h1>AR Mage Player</h1>
      <p>Please input your room code:</p>
      <input
        type="text"
        placeholder="Room code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <NavLink to="/stage-select" state={{ roomCode }}>
        <Button onClick={() => console.log(roomCode)}>Join Game</Button>
      </NavLink>
      <NavLink to={`/edit`}>
        <Button onClick={() => console.log(roomCode)}>Edit Game</Button>
      </NavLink>
    </>
  );
}

export default TitlePage;
