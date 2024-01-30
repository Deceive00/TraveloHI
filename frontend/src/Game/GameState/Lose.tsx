import LostImg from '../../assets/GameResult/lose.png';
export class LoseState implements GameState{
  getImage(): string {
    return LostImg
  }
}