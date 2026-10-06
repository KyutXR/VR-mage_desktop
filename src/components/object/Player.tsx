import React, {
  useRef,
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { makePlayerData, makeStageData } from "../../util/websocketData";
import type { DataMessage } from "../../types/websocket";

type BlockGrid = number[][][];

interface PlayerProps {
  grid: BlockGrid;
  isOnOff: boolean; // オンオフブロックの状態を受け取る
  initPos?: [number, number, number]; // 初期位置を受け取る（オプション）
  initRot?: number; // 初期回転を受け取る（オプション）
  setIsGoaled?: Dispatch<SetStateAction<boolean>>; // ゴール状態を更新する関数（オプション）
  handleLever: () => void;
  sendMessage: (message: DataMessage) => void;
}

const Player: React.FC<PlayerProps> = ({
  grid,
  isOnOff,
  initPos = [0, 1, 0],
  initRot = 0,
  handleLever,
  sendMessage,
  setIsGoaled = () => {}, // デフォルトは何もしない関数
}) => {
  // グリッド座標からワールド座標に変換
  const gridToWorld = (
    x: number,
    y: number,
    z: number
  ): [number, number, number] => {
    if (!grid.length || !grid[0].length || !grid[0][0].length) return [0, 0, 0];

    return [
      x - Math.floor(grid[0][0].length / 2),
      y - Math.floor(grid.length / 2),
      z - Math.floor(grid[0].length / 2),
    ];
  };
  const meshRef = useRef<THREE.Mesh>(null);
  const [position, setPosition] = useState<[number, number, number]>(
    gridToWorld(...initPos)
  );
  const [rotation, setRotation] = useState(initRot); // 0=北, 1=東, 2=南, 3=西
  const textures = useTexture([
    "/assets/textures/cube/test1.png",
    "/assets/textures/cube/test2.png",
    "/assets/textures/cube/test3.png",
    "/assets/textures/cube/test4.png",
    "/assets/textures/cube/test5.png",
    "/assets/textures/cube/test6.png",
  ]);

  useEffect(() => {
    const playerData = makePlayerData(position, rotation);
    const stageData = makeStageData(grid);
    sendMessage(playerData);
    sendMessage(stageData);
  }, [position, rotation]);

  // 方向ベクトル
  const getDirectionVector = (rot: number): [number, number, number] => {
    switch (rot % 4) {
      case 0:
        return [0, 0, -1]; // 北 (-Z方向)
      case 1:
        return [1, 0, 0]; // 東 (+X方向)
      case 2:
        return [0, 0, 1]; // 南 (+Z方向)
      case 3:
        return [-1, 0, 0]; // 西 (-X方向)
      default:
        return [0, 0, -1];
    }
  };

  // ワールド座標からグリッド座標に変換
  const worldToGrid = (
    x: number,
    y: number,
    z: number
  ): [number, number, number] => {
    if (!grid.length || !grid[0].length || !grid[0][0].length) return [0, 0, 0];

    return [
      Math.round(x + Math.floor(grid[0][0].length / 2)),
      Math.round(y + Math.floor(grid.length / 2)),
      Math.round(z + Math.floor(grid[0].length / 2)),
    ];
  };

  // 指定位置にブロックがあるかチェック
  const hasBlockAt = (x: number, y: number, z: number): boolean => {
    if (
      y < 0 ||
      y >= grid.length ||
      z < 0 ||
      z >= grid[y].length ||
      x < 0 ||
      x >= grid[y][z].length
    ) {
      return false;
    }
    return (
      grid[y][z][x] !== 0 &&
      grid[y][z][x] !== 4 &&
      grid[y][z][x] !== 5 &&
      grid[y][z][x] !== 6 &&
      (grid[y][z][x] !== 7 || isOnOff) &&
      (grid[y][z][x] !== 8 || !isOnOff) &&
      !(grid[y][z][x] >= 10 && grid[y][z][x] <= 15)
    );
  };

  // ワープ先の座標を計算
  const getWarpDestination = (
    currentBlockId: number
  ): [number, number, number] | null => {
    // ペアのブロックIDを取得
    const pairId =
      currentBlockId % 2 === 0 ? currentBlockId + 1 : currentBlockId - 1;

    // グリッド内でペアブロックを検索
    for (let y = 0; y < grid.length; y++) {
      for (let z = 0; z < grid[y].length; z++) {
        for (let x = 0; x < grid[y][z].length; x++) {
          if (grid[y][z][x] === pairId) {
            return gridToWorld(x, y, z);
          }
        }
      }
    }
    return null;
  };

  // 目の前のブロックのIDを取得
  const getFrontBlockId = (): number | null => {
    const [dx, dy, dz] = getDirectionVector(rotation);
    const [currentX, currentY, currentZ] = worldToGrid(...position);
    const frontX = currentX + dx;
    const frontY = currentY + dy;
    const frontZ = currentZ + dz;

    if (
      frontY < 0 ||
      frontY >= grid.length ||
      frontZ < 0 ||
      frontZ >= grid[frontY].length ||
      frontX < 0 ||
      frontX >= grid[frontY][frontZ].length
    ) {
      return null;
    }

    const blockId = grid[frontY][frontZ][frontX];
    return blockId === 0 ? null : blockId;
  };

  // 目の前のブロックの下のブロックのIDを取得
  const getFrontBlockBelowId = (): number | null => {
    const [dx, dy, dz] = getDirectionVector(rotation);
    const [currentX, currentY, currentZ] = worldToGrid(...position);
    const frontX = currentX + dx;
    const frontY = currentY + dy - 1; // 下のブロックを取得
    const frontZ = currentZ + dz;
    if (
      frontY < 0 ||
      frontY >= grid.length ||
      frontZ < 0 ||
      frontZ >= grid[frontY].length ||
      frontX < 0 ||
      frontX >= grid[frontY][frontZ].length
    ) {
      return null;
    }
    const blockId = grid[frontY][frontZ][frontX];
    return blockId === 0 ? null : blockId;
  };

  // キーボードイベントハンドラ
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "a":
          // 左に90度回転
          setRotation((prev) => (prev - 1 + 4) % 4);
          break;

        case "d":
          // 右に90度回転
          setRotation((prev) => (prev + 1) % 4);
          break;

        case "w":
          // 前進
          const [dx, dy, dz] = getDirectionVector(rotation);

          setPosition((prev) => {
            // 目の前のブロックIDを取得
            const frontBlockId = getFrontBlockId();

            const frontBlockBelowId = getFrontBlockBelowId();
            if (
              frontBlockBelowId === null ||
              (frontBlockBelowId === 7 && !isOnOff) ||
              (frontBlockBelowId === 8 && isOnOff)
            ) {
              console.log("目の前の下にブロックはありません");
              const failAudio = new Audio("/assets/se/ui-note.mp3");
              failAudio.play();
              return prev;
            }

            if (frontBlockBelowId === 4 || frontBlockBelowId === 5) {
              const [currentX, currentY, currentZ] = worldToGrid(...prev);
              let fallHeight = 1;

              // 下のブロックもハシゴかチェックして連続で降りる
              while (true) {
                const belowY = currentY - fallHeight;
                if (
                  belowY >= 0 &&
                  belowY < grid.length &&
                  currentZ + dz >= 0 &&
                  currentZ + dz < grid[belowY].length &&
                  currentX + dx >= 0 &&
                  currentX + dx < grid[belowY][currentZ + dz].length
                ) {
                  const belowBlockId =
                    grid[belowY][currentZ + dz][currentX + dx];
                  if (belowBlockId === 4 || belowBlockId === 5) {
                    fallHeight++;
                    continue;
                  }
                }
                break;
              }

              const fallPos: [number, number, number] = [
                prev[0] + dx,
                prev[1] - fallHeight + 1,
                prev[2] + dz,
              ];

              // 音声を再生
              const audio = new Audio("/assets/se/wood.mp3");
              audio.play();
              return fallPos;
            }

            // 目の前がハシゴ（id 4 または 5）の場合は上に登る
            if (frontBlockId === 4 || frontBlockId === 5) {
              const [currentX, currentY, currentZ] = worldToGrid(...prev);
              let climbHeight = 1;

              // 上のブロックもハシゴかチェックして連続で登る
              while (true) {
                const aboveY = currentY + climbHeight;
                if (
                  aboveY >= 0 &&
                  aboveY < grid.length &&
                  currentZ + dz >= 0 &&
                  currentZ + dz < grid[aboveY].length &&
                  currentX + dx >= 0 &&
                  currentX + dx < grid[aboveY][currentZ + dz].length
                ) {
                  const aboveBlockId =
                    grid[aboveY][currentZ + dz][currentX + dx];
                  if (aboveBlockId === 4 || aboveBlockId === 5) {
                    climbHeight++;
                    continue;
                  }
                }
                break;
              }

              const climbPos: [number, number, number] = [
                prev[0] + dx,
                prev[1] + climbHeight,
                prev[2] + dz,
              ];

              // 移動先にブロックがないかチェック
              const [climbGridX, climbGridY, climbGridZ] = worldToGrid(
                ...climbPos
              );
              if (hasBlockAt(climbGridX, climbGridY, climbGridZ)) {
                console.log("移動できません: ブロックがあります");
                const failAudio = new Audio("/assets/se/ui-note.mp3");
                failAudio.play();
                return prev;
              }

              // 音声を再生
              const audio = new Audio("/assets/se/wood.mp3");
              audio.play();
              return climbPos;
            }

            if (frontBlockId === 6) {
              // ゴールに到達
              console.log("ゴールに到達しました！");
              const successAudio = new Audio("/assets/se/clear.mp3");
              if (setIsGoaled) setIsGoaled(true); // ゴール状態を更新
              successAudio.play();
              return prev; // ゴールに到達した場合はそのままの位置
            }

            // ワープブロックの処理
            if (frontBlockId && frontBlockId >= 10 && frontBlockId <= 15) {
              const warpDestination = getWarpDestination(frontBlockId);
              if (warpDestination) {
                console.log(
                  `ワープします！ ブロックID: ${frontBlockId} → ペアブロック`
                );
                const warpAudio = new Audio("/assets/se/warp.mp3");
                warpAudio.play();
                return warpDestination;
              } else {
                console.log("ワープ先が見つかりません");
                const failAudio = new Audio("/assets/se/ui-note.mp3");
                failAudio.play();
                return prev;
              }
            }
            // 通常の前進
            const newPos: [number, number, number] = [
              prev[0] + dx,
              prev[1] + dy,
              prev[2] + dz,
            ];

            // 移動先にブロックがないかチェック
            const [gridX, gridY, gridZ] = worldToGrid(...newPos);
            if (hasBlockAt(gridX, gridY, gridZ)) {
              console.log("移動できません: ブロックがあります");
              const failAudio = new Audio("/assets/se/ui-note.mp3");
              failAudio.play();
              return prev;
            }
            // 音声を再生
            const audio = new Audio("/assets/se/ui-pop.mp3");
            audio.play();
            return newPos;
          });
          break;

        case "s":
          // アクション
          const frontBlockId = getFrontBlockId();
          if (frontBlockId !== null) {
            console.log(`目の前のブロックID: ${frontBlockId}`);
            if (frontBlockId === 9) {
              // レバー操作
              console.log("レバーを操作します");
              const leverAudio = new Audio("/assets/se/lever.mp3");
              leverAudio.play();
              handleLever();
            }
          } else {
            console.log("目の前にブロックはありません");
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [rotation, position, grid]);

  // メッシュの位置と回転を更新
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
      meshRef.current.rotation.y = -(rotation * Math.PI) / 2;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        {textures.map((texture, index) => (
          <meshStandardMaterial
            key={index}
            attach={`material-${index}`}
            map={texture}
          />
        ))}
      </mesh>
    </>
  );
};

export default Player;
