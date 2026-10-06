import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import * as THREE from "three";
interface LadderProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

const Ladder: React.FC<LadderProps> = ({ position, rotation, color }) => {
  const ladderModel = useLoader(FBXLoader, "/assets/models/ladder.fbx");
  // ラダーの位置を受け取り、メッシュを生成
  if (!position || position.length !== 3) {
    console.error("Invalid position for Ladder component");
    return null;
  }

  // モデルをクローンして独立したインスタンスを作成
  const clonedModel = ladderModel.clone();
  clonedModel.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: color ? color : "orange",
      });
    }
  });
  return (
    <primitive
      object={clonedModel}
      position={position}
      scale={[0.005, 0.005, 0.005]}
      rotation={rotation}
    />
  );
};

export default Ladder;
