interface LadderProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

const Goal: React.FC<LadderProps> = ({ position, rotation, color }) => {
  return (
    <>
      <mesh
        position={[position[0], position[1] + 0.1, position[2]]}
        rotation={rotation}
      >
        <boxGeometry args={[0.1, 0.6, 0.7]} />
        <meshStandardMaterial color={color || "lightgreen"} />
      </mesh>
      <mesh
        position={[position[0] - 0.4, position[1], position[2]]}
        rotation={rotation}
      >
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  );
};

export default Goal;
