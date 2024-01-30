import { Sprite } from "./Sprite";

export class Player extends Sprite{
  velocity : Position;
  height : number;
  width : number;
  attackBox : AttackBox;
  color: string;
  isAttacking: boolean;
  health: number;
  lastKey: string;
  sprites: any;
  damage: number;
  constructor({ position, velocity, color = 'red', offset = {x: 0, y: 0}, imageSources, scale = 1, health, lastKey, sprites}: any) {
    const type = 'player'
    super({type, position, imageSources, scale, offset});
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: 100,
      height: 50,
      offset
    };
    this.health = health;
    this.lastKey = lastKey;
    this.color = color;
    this.isAttacking = false;
    this.currentFrame = 0;
    this.elapseFrame = 0;
    this.holdFrame = 13;
    this.sprites = sprites;
    this.damage = 0;
    

    for (const s in this.sprites) {
      const images: HTMLImageElement[] = [];

      for(let i = 0 ; i < this.sprites[s].imageSources.length; i++){
        const image = new Image();
        image.src = this.sprites[s].imageSources[i];
        images.push(image);
      }
      this.sprites[s].image = images
    }
    
  } 

  attack(type : string){
    if(type === 'frontKick'){
      this.damage = 15;
      this.switchSprite('frontKick');
    }
    else if(type === 'frontKickMirrored'){
      this.damage = 15;
      this.switchSprite('frontKickMirrored');
    }
    else if(type === 'lowKick'){
      this.damage = 20;
      this.switchSprite('lowKick');
    }
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  update(c: CanvasRenderingContext2D | null, canvas: any) {

    this.draw(c, canvas);
    this.animateFrame();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.position.y = canvas.height - this.height;
      this.velocity.y = 0;
    } else {
      this.velocity.y += (window as any).gravity;
    }
  }

  switchSprite(sprite : any){
    if(this.images === this.sprites.frontKick.image && this.currentFrame < this.sprites.frontKick.image.length - 1) return;
    if(this.images === this.sprites.frontKickMirrored.image && this.currentFrame < this.sprites.frontKickMirrored.image.length - 1) return;
    if(this.images === this.sprites.lowKick.image && this.currentFrame < this.sprites.lowKick.image.length - 1) return;
    switch(sprite){
      case 'idle':
        if(this.images !== this.sprites.idle.image){
          this.images = this.sprites.idle.image
          this.currentFrame = 0;
        }
        break;
      case 'runLeft':
        if(this.images !== this.sprites.runLeft.image){
          this.images = this.sprites.runLeft.image
          this.currentFrame = 0;
        }
        break;
      case 'runRight':
        if(this.images !== this.sprites.runRight.image){
          this.images = this.sprites.runRight.image;
          this.currentFrame = 0;
        }
        break;
      case 'jump':
        if(this.images !== this.sprites.jump.image){
          this.images = this.sprites.jump.image;
          this.currentFrame = 0;
        }
        break;
      case 'frontKick':
        if(this.images !== this.sprites.frontKick.image){
          this.images = this.sprites.frontKick.image;
          this.currentFrame = 0;
        }
        break;
      case 'frontKickMirrored':
        if(this.images !== this.sprites.frontKickMirrored.image){
          this.images = this.sprites.frontKickMirrored.image;
          this.currentFrame = 0;
          console.log(this.images)
        }
        break;
      case 'lowKick':
        if(this.images !== this.sprites.lowKick.image){
          this.images = this.sprites.lowKick.image;
          this.currentFrame = 0;
        }
        break;
    }
  }
  
}
