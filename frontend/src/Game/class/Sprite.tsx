export class Sprite {
  position: Position;
  height: number;
  width: number;
  images: HTMLImageElement[];
  scale: number;
  currentFrame: number;
  elapseFrame: number;
  holdFrame: number;
  offset: Position;
  type: string;
  constructor({
    type,
    position,
    imageSources,
    scale = 1,
    offset = {x: 0, y: 0}
  }: {type: string, position: Position; imageSources: string[]; scale?: number, offset : Position }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.images = imageSources.map((source) => {
      const image = new Image();
      image.src = source;
      return image;
    });
    this.scale = scale;
    this.currentFrame = 0;
    this.elapseFrame = 0;
    this.holdFrame = 10;
    this.offset = offset;
    this.type = type;
  }

  draw(c: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement) {
    const currentImage = this.images[this.currentFrame];
    if(currentImage && currentImage.complete){
      if(this.type === 'bg'){
        c?.drawImage(
          currentImage,
          this.position.x,
          this.position.y,
          canvas.width,
          canvas.height
        );
      }
      else if (currentImage) {
        c?.drawImage(
          currentImage,
          this.position.x - this.offset.x,
          this.position.y - this.offset.y,
          currentImage.width * this.scale,
          currentImage.height * this.scale
        );
      }
    }
  }

  attack(type: string) {}
  animateFrame(){
    this.elapseFrame++;
    if (this.elapseFrame % this.holdFrame === 0) {
      // console.log(this.currentFrame + ' ' + this.images[0].src)
      if (this.currentFrame < this.images.length - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }
  update(c: CanvasRenderingContext2D | null, canvas: any) {
    this.draw(c, canvas);
    this.animateFrame();
  }
}
