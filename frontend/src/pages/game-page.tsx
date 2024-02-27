import { useEffect, useRef, useState } from "react";
import { Player } from "../Game/class/Player";
import style from "../style/Game/healthbar.module.scss";
import { DrawState } from "../Game/GameState/Draw";
import { WinState } from "../Game/GameState/Win";
import { LoseState } from "../Game/GameState/Lose";
import { RunningState } from "../Game/GameState/Running";
import { Sprite } from "../Game/class/Sprite";
import {
  bgImages,
  frontKickImagesFirstPlayer,
  frontKickMirroredImagesFirstPlayer,
  idleImagesFirstPlayer,
  idleImagesSecondPlayer,
  jumpImagesFirstPlayer,
  lowKickImagesFirstPlayer,
  runLeftImagesFirstPlayer,
  runLeftSecondPlayer,
  runRightImagesFirstPlayer,
  runRightSecondPlayer,
} from "../Game/animation";
import backgroundMusic from "/bgm2.mp3";

enum GameState {
  Running,
  Win,
  Lose,
  Draw,
}

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  (window as any).gravity = 0.85;
  const enemyHB = useRef<HTMLDivElement | null>(null);
  const playerHB = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  // const { user, loading } = useUser();
  let timer = 60;
  const [seconds, setSeconds] = useState(timer);
  const background = new Sprite({
    type: "bg",
    position: {
      x: 0,
      y: 0,
    },
    imageSources: [bgImages],
    scale: 1,
    offset: {
      x: 0,
      y: 0,
    },
  });
  const firstPlayer = {
    idle: idleImagesFirstPlayer,
    runRight: runRightImagesFirstPlayer,
    runLeft: runLeftImagesFirstPlayer,
    jump: jumpImagesFirstPlayer,
    frontKick: frontKickImagesFirstPlayer,
    frontKickMirrored: frontKickMirroredImagesFirstPlayer,
    lowKick: lowKickImagesFirstPlayer,
  };
  const secondPlayer = {
    idle: idleImagesSecondPlayer,
    runRight: runRightSecondPlayer,
    runLeft: runLeftSecondPlayer,
  };

  const [gameState, setGameState] = useState(GameState.Running);

  const player = useRef(
    new Player({
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      color: "red",
      offset: { x: 0, y: 100 },
      imageSources: firstPlayer.idle,
      scale: 3,
      health: 100,
      lastKey: "",
      sprites: {
        idle: {
          imageSources: firstPlayer.idle,
        },
        runRight: {
          imageSources: firstPlayer.runRight,
        },
        runLeft: {
          imageSources: firstPlayer.runLeft,
        },
        jump: {
          imageSources: firstPlayer.jump,
        },
        frontKick: {
          imageSources: firstPlayer.frontKick,
        },
        frontKickMirrored: {
          imageSources: firstPlayer.frontKickMirrored,
        },
        lowKick: {
          imageSources: firstPlayer.lowKick,
        },
      },
    })
  );

  const enemy = useRef(
    new Player({
      position: { x: 400, y: 100 },
      velocity: { x: 0, y: 0 },
      offset: { x: -50, y: 100 },
      lastKey: "",
      color: "green",
      health: 100,
      scale: 3,
      imageSources: secondPlayer.idle,
      sprites: {
        idle: {
          imageSources: secondPlayer.idle,
        },
        runRight: {
          imageSources: secondPlayer.runRight,
        },
        runLeft: {
          imageSources: secondPlayer.runLeft,
        },
      },
    })
  );

  const imageResult = () => {
    if (gameState === GameState.Draw) {
      return new DrawState().getImage();
    } else if (gameState === GameState.Win) {
      return new WinState().getImage();
    } else if (gameState === GameState.Lose) {
      return new LoseState().getImage();
    }
    if (gameState === GameState.Running) {
      return new RunningState().getImage();
    }
  };
  const [backgroundAudio] = useState(new Audio(backgroundMusic)); 

  useEffect(() => {
    let timeoutId: any;
    
    const playBackgroundAudio = () => {
      backgroundAudio.loop = true; 
      backgroundAudio.play(); 
    };
    
    timeoutId = setTimeout(playBackgroundAudio, 0);
  

    return () => {
      backgroundAudio.pause();
      clearTimeout(timeoutId);
    };
  }, []);
  useEffect(() => {
    // if(loading || !user) return ;

    const canvas = canvasRef.current!;
    const c = canvas.getContext("2d");
    const movement = {
      a: { pressed: false },
      d: { pressed: false },
      w: { pressed: false },
      s: { pressed: false },
      ArrowLeft: { pressed: false },
      ArrowRight: { pressed: false },
      ArrowUp: { pressed: false },
      space: { pressed: false },
    };

    if (c) {
      function isCollision() {
        return (
          player.current?.attackBox.position.x +
            player.current?.attackBox.width! >=
            enemy.current?.position.x! &&
          player.current?.attackBox.position.x! <=
            enemy.current?.position.x! + enemy.current?.width! &&
          player.current?.attackBox.position.y +
            player.current?.attackBox.height! >=
            enemy.current?.position.y! &&
          player.current?.attackBox.position.y! <=
            enemy.current?.position.y! + enemy.current?.height!
        );
      }

      function animate() {
        window.requestAnimationFrame(animate);
        c!.fillStyle = "black";
        c!.fillRect(0, 0, canvas.width, canvas.height);
        background.update(c, canvas);

        if (player.current) {
          player.current.update(c, canvas);
          player.current.velocity.x = 0;

          if (movement.a.pressed && player.current.lastKey === "a") {
            player.current.velocity.x = -2;
            player.current.switchSprite("runLeft");
          } else if (movement.d.pressed && player.current.lastKey === "d") {
            player.current.velocity.x = 2;
            player.current.switchSprite("runRight");
          } else {
            player.current.switchSprite("idle");
          }

          if (player.current.velocity.y < 0) {
            player.current.switchSprite("jump");
          }
        }

        if (enemy.current) {
          enemy.current.update(c, canvas);

          // Enemy movement
          enemy.current.velocity.x = 0;
          if (
            movement.ArrowLeft.pressed &&
            enemy.current.lastKey === "ArrowLeft"
          ) {
            enemy.current.velocity.x = -4;
            enemy.current.switchSprite("runLeft");
          } else if (
            movement.ArrowRight.pressed &&
            enemy.current.lastKey === "ArrowRight"
          ) {
            enemy.current.velocity.x = 4;
            enemy.current.switchSprite("runRight");
          } else {
            enemy.current.images = enemy.current.sprites.idle.image;
          }
        }

        // Collision Detection
        if (player.current && enemy.current) {
          if (isCollision() && player.current.isAttacking) {
            player.current.isAttacking = false;

            enemy.current.health -= player.current.damage;
            if (enemy.current.health <= 0) enemy.current.health = 0;
            enemyHB?.current?.style.setProperty(
              "width",
              `${enemy.current.health}%`
            );
          }
          if (isCollision() && enemy.current.isAttacking) {
            enemy.current.isAttacking = false;
            player.current.health -= 20;
            if (player.current.health <= 0) player.current.health = 0;
            playerHB?.current?.style.setProperty(
              "width",
              `${player.current.health}%`
            );
          }
        }
      }

      c.fillStyle = "blue";
      c.fillRect(0, 0, canvas.width, canvas.height);
      window.addEventListener("keydown", (event: KeyboardEvent) => {
        const currentPlayer = player.current;
        const currentEnemy = enemy.current;

        if (!currentPlayer || !currentEnemy) {
          return;
        }

        switch (event.key) {
          case "d":
            movement.d.pressed = true;
            currentPlayer.lastKey = "d";
            break;
          case "a":
            movement.a.pressed = true;
            currentPlayer.lastKey = "a";
            break;
          case "w":
            currentPlayer.velocity.y = -20;
            break;
          case " ":
            movement.space.pressed = true;
            break;
          case "ArrowRight":
            movement.ArrowRight.pressed = true;
            currentEnemy.lastKey = "ArrowRight";
            break;
          case "ArrowLeft":
            movement.ArrowLeft.pressed = true;
            currentEnemy.lastKey = "ArrowLeft";
            break;
          case "ArrowUp":
            currentEnemy.velocity.y = -20;
            break;
          case "k":
            currentEnemy.attack("frontKick");
            break;
          case "s":
            movement.s.pressed = true;
            break;
        }

        if (movement.space.pressed && movement.d.pressed) {
          currentPlayer.attack("frontKick");
        } else if (movement.space.pressed && movement.a.pressed) {
          currentPlayer.attack("frontKickMirrored");
        } else if (movement.space.pressed && movement.s.pressed) {
          currentPlayer.attack("lowKick");
        }
      });

      window.addEventListener("keyup", (event: KeyboardEvent) => {
        switch (event.key) {
          case "d":
            movement.d.pressed = false;
            break;
          case "a":
            movement.a.pressed = false;
            break;
          case "ArrowLeft":
            movement.ArrowLeft.pressed = false;
            break;
          case "ArrowRight":
            movement.ArrowRight.pressed = false;
            break;
          case " ":
            movement.space.pressed = false;
            break;
          case "s":
            movement.s.pressed = false;
            break;
        }
      });

      animate();
    }

    return () => {};
  }, []);

  useEffect(() => {
    // Timer
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
    }, 1000);
    if (
      seconds === 0 ||
      player.current.health <= 0 ||
      enemy.current.health <= 0
    ) {
      clearInterval(interval);
      if (player.current.health > enemy.current.health) {
        setGameState(GameState.Win);
        console.log("Player wins!");
      } else if (player.current.health < enemy.current.health) {
        setGameState(GameState.Lose);
        console.log("Enemy wins!");
      } else {
        setGameState(GameState.Draw);
        console.log("It's a Draw!");
      }
    }
    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {}, [player.current?.health, enemy.current?.health]);

  return (
    <>
      <audio src={backgroundMusic} autoPlay loop />
      <div className={style.gamePageContainer}>
        <div className={style.gameContainer}>
          <div className={style.healthBarContainer}>
            <div className={style.spriteHBContainer}>
              <div
                className={style.playerHB}
                style={{ display: "flex", justifyContent: "flex-end" }}
              ></div>
              <div
                ref={playerHB}
                id="playerHB"
                className={style.playerBackgroundHB}
              ></div>
            </div>
            <div ref={timerRef} className={style.timer}>
              {seconds}
            </div>
            <div className={style.spriteHBContainer}>
              <div className={style.playerHB}></div>
              <div
                ref={enemyHB}
                id="enemyHB"
                className={style.enemyBackgroundHB}
              ></div>
            </div>
            <div></div>
          </div>
          <canvas ref={canvasRef} width={1024} height={724}>
            Your browser does not support the HTML5 canvas tag.
          </canvas>
          {(seconds === 0 ||
            player.current.health <= 0 ||
            enemy.current.health <= 0) && (
            <img src={imageResult()} alt="result" className={style.result} />
          )}
        </div>
      </div>
    </>
  );
}
