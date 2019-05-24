import 'phaser';

export default class TitleScene extends Phaser.Scene
{
  constructor()
  {
    super('Title');
  }

  create()
  {
    // Title image
    this.title = this.add.image(0, 0, 'Title');
    this.centerObject(this.title, 1);
  }
  centerObject(gameObject, offset = 0)
  {
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    gameObject.x = width/2;
    gameObject.y = height/2 - offset *100;
  }
}
