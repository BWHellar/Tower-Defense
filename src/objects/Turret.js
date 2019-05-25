import 'phaser';

export default class Turret extends Phaser.GameObjects.Image{
  constructor(scene, x, y, map)
  {
    super(scene, x, y, 'tower');

    this.scene = scene;
    this.map = map;
    this.nextTic = 0;

    //Add turrets
    this.scene.add.existing(this);
    this.setScale(-0.8);
  }

  update(time, delta)
  {
    if (time > this.nextTic)
    {
      this.fire();
      this.nextTic = time + 1000;
    }
  }

  place(i, j)
  {
    this.y = j * 64 + 32;
    this.x = i * 54 + 32;
    this.map[i][j]= 1;
  }

  fire()
  {
    var enemy = this.scene.getEnemy(this.x, this.y, 100);
    if(enemy)
    {
      var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      this.scene.addBullet(this.x, this.y, angle);
      this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
    }
  }
}
