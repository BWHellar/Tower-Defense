import 'phaser';

export default class Bullet extends Phaser.GameObjects.Image{
  constructor(scene, x, y)
  {
    super(scene, x, y, 'bullet');

    this.scene = scene;
    this.dx = 0;
    this.dy = 0;
    //So the bullet doesnt go on forever.
    this.lifespan = 0;
    this.speed = Phaser.Math.GetSpeed(600,1);
    //Add bullet
    this.scene.add.existing(this);
  }

  update(time, delta)
  {
    this.lifespan -= delta;

    this.x += this.dx * (this.speed * delta);
    this.y += this.dy * (this.speed * delta);

    if (this.lifespan <= 0)
    {
      this.setActive(false);
      this.setVisible(false);
    }
  }
  fire(x,y,angle)
  {
    this.setActive(true);
    this.setVisible(true);

    this.setPosition(x,y);

    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);

    this.lifespan = 300;
  }
}
