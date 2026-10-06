import "./App.css";
import { Route, Routes } from "react-router-dom";
import TitlePage from "./components/pages/TitlePage/page";
import StageSelectPage from "./components/pages/StageSelectPage/page";
import EditPage from "./components/pages/EditPage/page";
import GameStage1 from "./components/pages/GameStage1/page";
import GameStage2 from "./components/pages/GameStage2/page";
import GameStage3 from "./components/pages/GameStage3/page";
import GameStage4 from "./components/pages/GameStage4/page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TitlePage />} />
      <Route path="/stage-select" element={<StageSelectPage />} />
      <Route path="/game/stage1/:roomCode" element={<GameStage1 />} />
      <Route path="/game/stage2/:roomCode" element={<GameStage2 />} />
      <Route path="/game/stage3/:roomCode" element={<GameStage3 />} />
      <Route path="/game/stage4/:roomCode" element={<GameStage4 />} />
      <Route path="/edit" element={<EditPage />} />
      {/* Add other routes as needed */}
    </Routes>
  );
}

export default App;
