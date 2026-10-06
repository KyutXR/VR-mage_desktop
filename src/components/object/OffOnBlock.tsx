import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import * as THREE from "three";
interface OnOffProps {
  isOn: boolean; // オンオフの状態を示すプロパティ
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

const OffOnBlock: React.FC<OnOffProps> = ({
  isOn,
  position,
  rotation,
  color,
}) => {
  const OnOffModel = useLoader(FBXLoader, "/assets/models/onoff.fbx");
  // ラダーの位置を受け取り、メッシュを生成
  if (!position || position.length !== 3) {
    console.error("Invalid position for OnOff component");
    return null;
  }

  // モデルをクローンして独立したインスタンスを作成
  const clonedModel = OnOffModel.clone();
  clonedModel.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: color ? color : "gray",
        transparent: true,
        opacity: 0.5,
      });
    }
  });
  return (
    <>
      {isOn ? (
        <primitive
          object={clonedModel}
          position={position}
          scale={[0.005, 0.005, 0.005]}
          rotation={rotation}
        />
      ) : (
        <mesh
          position={position}
          rotation={rotation}
          key={`${position[0]}-${position[1]}-${position[2]}`}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      )}
    </>
  );
};

export default OffOnBlock;
