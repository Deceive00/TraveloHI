interface Position {
  x: number;
  y: number;
}

interface SpriteProperties {
  position: Position;
  velocity: Position;
  lastKey: string;
  color: string;
  offset: Position;
  health: number;
  imageSources: string[]
}
interface SpriteProps{
  position: Position;
  imageSource: string;
  scale: number;
  maxFrames: number;
}
interface AttackBox {
  position: Position;
  height: number;
  width: number
  offset: Position;
}

interface GameState {
  getImage(): string;
}