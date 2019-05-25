import 'phaser';
import levelConfig from '../config/levelConfig';

export default class Enemy extends Phaser.GameObjects.Image
{
  constructor(scene, x, y, path)
  {
    super(scene, x, y, 'enemy');

    this.scene = scene;
    this.path = path;
    this.hp = 0;
    this.enemySpeed = 0;
    this.follower = {t: 0, vec: new Phaser.Math.Vector2() };
    //Adds the enemy to the scenes
    this.scene.add.existing(this);
  }
  //Update function
  update(time, delta)
  {
    //Move the t point along the Path
    this.follower.t += this.enemySpeed * delta;

    this.path.getPoint(this.follower.t, this.follower.vec);

    // Rotate Check
    if(this.follower.vec.y > this.y && this.follower.vec.y !== this.y) this.angle = 0;
    if(this.follower.vec.x > this.x && this.follower.vec.x !== this.x) this.angle = -90;
    this.setPosition(this.follower.vec.x, this.follower.vec.y);

    //Check to see if the path is over
    if (this.follower.t >=1)
    {
      this.setActive(false);
      this.setVisible(false);
    }
  }
  // Where they start
  startOnPath()
  {
    // reset helth
    this.hp = levelConfig.initial.enemyHealth + levelConfig.incremental.enemyHealth;
    // reset enemySpeed
    this.enemySpeed = levelConfig.inital.enemySpeed * levelConfig.incremental.enemySpeed;
    this.follower.t = 0;

    // get x and y of given point of Path
    this.path.getPoint(this.follower.t, this.follower.vec);
    // And set it
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
  }
  // Updates Hp
  recieveDamage(damage)
  {
    this.hp -=damage;
    // If goes to zero
    if(this.hp<=0)
    {
      // We set invisible because we want to do an object pool.
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
