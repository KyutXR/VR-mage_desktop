import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import Stage from "../../object/Stage";
import Player from "../../object/Player";
import useWebsocket from "../../../hooks/useWebsocket";
import { makeGimickData, makeStageData } from "../../../util/websocketData";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import GoalPanel from "../../feature/GoalPanel";

const CameraController = () => {
  const { camera, gl } = useThree();
  const zoomRef = useRef(50);

  useEffect(() => {
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    const handleWheel = (event: {
      preventDefault: () => void;
      deltaY: number;
    }) => {
      event.preventDefault();
      const delta = event.deltaY * 0.01;
      zoomRef.current = Math.max(10, Math.min(200, zoomRef.current - delta));
      camera.zoom = zoomRef.current;
      camera.updateProjectionMatrix();
    };

    gl.domElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      gl.domElement.removeEventListener("wheel", handleWheel);
    };
  }, [camera, gl]);

  return null;
};

const GameStage3 = () => {
  const navigate = useNavigate();
  const param = useParams();
  // envからbaseUrlを取得
  const baseUrl = import.meta.env.VITE_MOBILE_URL || "localhost:5173";
  const { sendMessage } = useWebsocket(param.roomCode || "test");
  const [onOff, setOnOff] = useState(false);
  const [isGoaled, setIsGoaled] = useState(false);
  const gameGrid = [
    [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
    [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 2, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    [
      [15, 0, 0, 1, 0, 0, 1],
      [0, 1, 4, 1, 0, 0, 0],
      [0, 1, 3, 1, 5, 0, 9],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 0, 10, 1, 0, 0, 0],
      [0, 1, 9, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 1, 7, 7, 1],
      [0, 0, 0, 1, 0, 0, 7],
      [0, 0, 12, 1, 5, 0, 7],
      [0, 1, 1, 1, 0, 1, 2],
      [0, 8, 8, 1, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0],
    ],
    [
      [1, 1, 1, 5, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 0, 5, 0, 0],
      [1, 7, 7, 0, 0, 0, 11],
      [8, 8, 8, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 3, 0, 0, 0, 0],
    ],
    [
      [1, 0, 1, 5, 1, 1, 1],
      [0, 9, 1, 0, 0, 1, 1],
      [0, 1, 1, 0, 5, 1, 1],
      [0, 0, 5, 0, 0, 0, 8],
      [0, 0, 0, 0, 0, 0, 8],
      [0, 0, 0, 0, 0, 0, 8],
      [0, 0, 13, 0, 0, 0, 1],
    ],
    [
      [1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0],
      [0, 0, 5, 1, 0, 0, 0],
      [0, 0, 7, 1, 7, 0, 0],
      [0, 0, 1, 7, 1, 0, 0],
      [0, 0, 7, 1, 7, 0, 14],
    ],
    [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
  ];

  useEffect(() => {
    const onOffData = makeGimickData("onOff", onOff);
    sendMessage(onOffData);
  }, [onOff]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGoaled) {
      const goalData = makeGimickData("goal", true);
      sendMessage(goalData);
      // ゴールパネルを表示するためのタイマーを設定
      timer = setTimeout(() => {
        setIsGoaled(false); // 一定時間後にゴール状態をリセット
        // ステージのデータをリセットするためのメッセージを送信
        const resetStageData = makeStageData([[[0]]]);
        sendMessage(resetStageData);
        navigate("/stage-select", {
          state: {
            roomCode: param.roomCode,
          },
        });
      }, 2000); // 2秒後にリセット
    }
    return () => {
      clearInterval(timer);
    }; // クリーンアップ関数
  }, [isGoaled]);

  return (
    <>
      <Canvas>
        <OrthographicCamera makeDefault zoom={50} near={0.1} far={1000} />
        <CameraController />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 2, 1]} intensity={0.4} />
        <Stage grid={gameGrid} isOnOff={onOff} />
        <Player
          grid={gameGrid}
          handleLever={() => setOnOff((prev) => !prev)}
          isOnOff={onOff}
          sendMessage={sendMessage}
          setIsGoaled={setIsGoaled}
        />
      </Canvas>
      {isGoaled && <GoalPanel />}
      <QRCode
        value={baseUrl + "/game/" + param.roomCode}
        size={128}
        style={{ position: "fixed", top: 10, right: 10 }}
      />
    </>
  );
};

export default GameStage3;
