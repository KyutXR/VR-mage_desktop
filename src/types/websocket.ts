export type DataMessage = {
  type: string;
  content: StageData | PlayerData | GimickData;
  from: string;
};

export type StageData = {
  stage: number[][][];
};

export type PlayerData = {
  position: [number, number, number];
  rotation: number;
};

export type GimickData = {
  gimick: string;
  data: boolean;
};
