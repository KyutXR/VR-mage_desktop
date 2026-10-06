import React from "react";

interface WarpBlockProps {
  position: [number, number, number];
  blockId: number;
}

const WarpBlock: React.FC<WarpBlockProps> = ({ position, blockId }) => {
  // blockId 10-15の色を設定
  const getWarpColor = (id: number): string => {
    switch (id) {
      case 10:
        return "#ff00ff"; // マゼンタ
      case 11:
        return "#ff00ff"; // マゼンタ（ペア）
      case 12:
        return "#00ffff"; // シアン
      case 13:
        return "#00ffff"; // シアン（ペア）
      case 14:
        return "#ffff00"; // 黄色
      case 15:
        return "#ffff00"; // 黄色（ペア）
      default:
        return "#ff00ff"; // デフォルト
    }
  };

  return (
    <group position={position}>
      {/* ワープエフェクト用の内側のキューブ */}
      <mesh>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color={getWarpColor(blockId)}
          transparent
          opacity={0.5}
          emissive={getWarpColor(blockId)}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

export default WarpBlock;
