
import WinImg from '../../assets/GameResult/win.png';
export class WinState implements GameState{
  getImage(): string {
    return WinImg
  }

}