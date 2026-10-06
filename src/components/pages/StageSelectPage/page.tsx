import { useState, useEffect } from "react";
import Button from "../../feature/Button";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function StageSelectPage() {
  const [roomCode, setRoomCode] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.roomCode) {
      setRoomCode(location.state.roomCode);
    }
  }, [location.state]);

  const stages = [
    { id: 1, name: "Stage 1", description: "Basic tutorial stage" },
    { id: 2, name: "Stage 2", description: "Intermediate challenges" },
    { id: 3, name: "Stage 3", description: "Advanced gameplay" },
    { id: 4, name: "Stage 4", description: "Expert level" },
  ];

  const handleStageSelect = (stageId: number) => {
    if (roomCode.trim()) {
      navigate(`/game/stage${stageId}/${roomCode}`);
    }
  };

  return (
    <>
      <h1>Stage Select</h1>
      <p>Room Code: {roomCode}</p>

      <div>
        <label htmlFor="roomCode">Room Code:</label>
        <input
          id="roomCode"
          type="text"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
          margin: "2rem 0",
        }}
      >
        {stages.map((stage) => (
          <div
            key={stage.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>{stage.name}</h3>
            <p>{stage.description}</p>
            <button
              onClick={() => handleStageSelect(stage.id)}
              disabled={!roomCode.trim()}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: !roomCode.trim() ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: !roomCode.trim() ? "not-allowed" : "pointer",
              }}
            >
              Play {stage.name}
            </button>
          </div>
        ))}
      </div>

      <NavLink to="/">
        <Button>Back to Title</Button>
      </NavLink>
    </>
  );
}

export default StageSelectPage;
