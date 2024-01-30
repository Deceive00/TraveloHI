import DrawImg from '../../assets/GameResult/draw.png';
export class DrawState implements GameState{
  getImage(): string {
    return DrawImg
  }

}