
export interface ValentineMessage {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  isHighlight: boolean;
}

export enum AppState {
  INITIAL = 'INITIAL',
  ACCEPTED = 'ACCEPTED'
}
