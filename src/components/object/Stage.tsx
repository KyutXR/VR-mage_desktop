import React from "react";
import Ladder from "./Ladder";
import Goal from "./Goal";
import WarpBlock from "./WarpBlock";
import OnOffBlock from "./OnOffBlock";
import LeverBlock from "./Lever";
import OffOnBlock from "./OffOnBlock";

type BlockGrid = number[][][];

interface StageProps {
  grid: BlockGrid;
  isOnOff: boolean; // オンオフブロックの状態を受け取る
}

const Stage: React.FC<StageProps> = ({ grid, isOnOff }) => {
  const getBlock = (
    blockType: number,
    position: [number, number, number]
  ): React.ReactNode => {
    switch (blockType) {
      case 0:
        return <></>; // 何も置かない
      case 1:
        return (
          <mesh
            key={`${position[0]}-${position[1]}-${position[2]}`}
            position={position}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="white" />
          </mesh>
        );
      case 2:
        return (
          <mesh
            key={`${position[0]}-${position[1]}-${position[2]}`}
            position={position}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" />
          </mesh>
        );
      case 3:
        return (
          <mesh
            key={`${position[0]}-${position[1]}-${position[2]}`}
            position={position}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        );
      case 4:
        return (
          <Ladder
            position={position}
            rotation={[0, 0, 0]}
            key={`${position[0]}-${position[1]}-${position[2]}`}
          />
        );
      case 5:
        return (
          <Ladder
            position={position}
            rotation={[0, Math.PI / 2, 0]}
            key={`${position[0]}-${position[1]}-${position[2]}`}
          />
        );
      case 6:
        return (
          <Goal
            position={position}
            rotation={[0, Math.PI / 2, 0]}
            key={`${position[0]}-${position[1]}-${position[2]}`}
          />
        );
      case 7:
        return (
          <OnOffBlock
            isOn={isOnOff}
            position={position}
            rotation={[0, 0, 0]}
            key={`${position[0]}-${position[1]}-${position[2]}`}
          />
        );
      case 8:
        return (
          <OffOnBlock
            isOn={isOnOff}
            position={position}
            rotation={[0, 0, 0]}
            key={`${position[0]}-${position[1]}-${position[2]}`}
          />
        );
      case 9:
        return (
          <LeverBlock
            position={position}
            rotation={[0, 0, 0]}
            isOn={isOnOff}
            key={`${position[0]}-${position[1]}-${position[2]}`}
          />
        );
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        return (
          <WarpBlock
            position={position}
            blockId={blockType}
            key={`${position[0]}-${position[1]}-${position[2]}`}
          />
        );
      default:
        return <></>;
    }
  };

  const renderBlocks = () => {
    const blocks: React.ReactNode[] = [];

    grid.forEach((layer, y) => {
      layer.forEach((row, z) => {
        row.forEach((blockType, x) => {
          const position: [number, number, number] = [
            x - Math.floor(row.length / 2), // x軸中央寄せ
            y - Math.floor(grid.length / 2), // y軸中央寄せ
            z - Math.floor(layer.length / 2), // z軸中央寄せ
          ];
          const block = getBlock(blockType, position);
          if (block) {
            blocks.push(block);
          }
        });
      });
    });

    return blocks;
  };

  return <group>{renderBlocks()}</group>;
};

export default Stage;
