export interface Stop {
  id: string;
  name: string;
  position: { x: number; y: number };
}

export interface Route {
  id: string;
  name: string;
  color: string;
  stops: Stop[];
}

export interface Bus {
  id: string;
  routeId: string;
  currentStopIndex: number;
  progressToNextStop: number; // 0-100
  direction: 1 | -1;
  delay?: {
    minutes: number;
    reason: string;
  };
}

export type Screen = 'HOME' | 'ROUTES' | 'PROFILE' | 'SMS';
