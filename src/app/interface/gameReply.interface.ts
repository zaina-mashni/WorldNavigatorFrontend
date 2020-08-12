export interface GameReplyInterface {
  message: string;
  facingDirection: string;
  inventory: string;
  timeLeftInMinutes: number;
  availableCommands: string;
  isPlaying: boolean;
  isFighting: boolean;
  status: string;
}
