import type { DataMessage } from "../types/websocket";

const makePlayerData = (
  position: [number, number, number],
  rotation: number
) => {
  const data: DataMessage = {
    type: "player",
    content: {
      position: position,
      rotation: rotation,
    },
    from: "desktop",
  };
  return data;
};

const makeStageData = (grid: number[][][]) => {
  const data: DataMessage = {
    type: "stage",
    content: {
      stage: grid,
    },
    from: "desktop",
  };
  return data;
};

const makeGimickData = (gimick: string, data: boolean) => {
  const gimickData: DataMessage = {
    type: "gimick",
    content: {
      gimick: gimick,
      data: data,
    },
    from: "desktop",
  };
  return gimickData;
};

export { makePlayerData, makeStageData, makeGimickData };
