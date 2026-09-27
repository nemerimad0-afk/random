export interface Participant {
  id: string;
  number: string;
  name?: string;
  isDrawn: boolean;
  drawnPrize?: string;
  drawnAt?: number;
}

export interface Winner {
  id: string;
  drawOrder: number;
  number: string;
  name?: string;
  prize: string;
  timestamp: number;
}

export interface Prize {
  id: string;
  title: string;
  sponsor?: string;
  icon?: string;
}

export type DrawSpeed = 'fast' | 'normal' | 'dramatic';

export interface DrawSettings {
  speed: DrawSpeed;
  removeWinnerFromPool: boolean;
  soundEnabled: boolean;
}
