import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import * as THREE from "three";
interface LeverProps {
  position: [number, number, number];
  isOn: boolean; // レバーの状態を示すプロパティ
  rotation?: [number, number, number];
  color?: string;
}

const LeverBlock: React.FC<LeverProps> = ({
  position,
  isOn,
  rotation,
  color,
}) => {
  const LeverModel = useLoader(FBXLoader, "/assets/models/switch.fbx");
  const BarModel = useLoader(FBXLoader, "/assets/models/lever.fbx");
  // ラダーの位置を受け取り、メッシュを生成
  if (!position || position.length !== 3) {
    console.error("Invalid position for Lever component");
    return null;
  }
  const clonedBarOff = BarModel.clone();
  clonedBarOff.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: color ? color : "black",
      });
    }
  });
  const clonedBarOn = BarModel.clone();
  clonedBarOn.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: color ? color : "yellow",
      });
    }
  });

  // モデルをクローンして独立したインスタンスを作成
  const clonedModel = LeverModel.clone();
  clonedModel.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: color ? color : "gray",
      });
    }
  });
  return (
    <>
      <primitive
        object={clonedModel}
        position={position}
        scale={[0.005, 0.005, 0.005]}
        rotation={rotation}
      />
      <primitive
        object={isOn ? clonedBarOn : clonedBarOff}
        position={
          isOn
            ? [position[0], position[1] - 0.2, position[2]]
            : [position[0], position[1], position[2]]
        }
        scale={[0.005, 0.005, 0.005]}
        rotation={rotation}
      />
    </>
  );
};

export default LeverBlock;
