import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import Stage from "../../object/Stage";
import Player from "../../object/Player";
import { OrbitControls } from "@react-three/drei";

const EditPage = () => {
  const [onOff, setOnOff] = useState(false);
  const gameGrid = [
    [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    ],
    [
      [0, 2, 0, 2, 10],
      [0, 0, 0, 0, 0],
      [0, 2, 9, 2, 5],
    ],
    [
      [0, 2, 8, 2, 7],
      [0, 2, 8, 2, 7],
      [0, 2, 0, 2, 5],
    ],
    [
      [0, 11, 0, 13, 0],
      [0, 0, 0, 0, 0],
      [0, 12, 0, 6, 0],
    ],
  ];

  // 初期位置
  const initPos: [number, number, number] = [0, 1, 0];
  // 初期回転
  // 0=北, 1=東, 2=南, 3=西
  const initRot: number = 0;

  return (
    <>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 2, 1]} intensity={0.4} />
        <Stage grid={gameGrid} isOnOff={onOff} />
        <Player
          grid={gameGrid}
          handleLever={() => setOnOff((prev) => !prev)}
          isOnOff={onOff}
          sendMessage={() => {}}
          initPos={initPos}
          initRot={initRot}
        />
      </Canvas>
    </>
  );
};

export default EditPage;
