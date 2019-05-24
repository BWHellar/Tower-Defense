import 'phaser';

export default class TitleScene extends Phaser.Scene
{
  constructor()
  {
    super('Title');
  }
  // Our overarching create function.
  create()
  {
    this.createTitle();
    this.createPlayButton();
  }
  // This function creates out title.
  createTitle()
  {
    this.titleImage = this.add.image(0, 0, 'title');
    this.centerObject(this.titleImage, 1);
  }
  // This function creates our play button.
  createPlayButton()
  {
    this.gameButton = this.add.sprite(0,0, 'blueButton1').setInteractive();
    this.centerObject(this.gameButton,-1);


    this.gameText = this.add.text(0,0,'Play', {fontSize: '32px', fill: '#fff'});
    Phaser.Display.Align.In.Center(this.gameText, this.gameButton);

    this.gameButton.on('pointerdown', function (pointer)
    {
      this.scene.start('Game');
    }.bind(this));
    this.gameButton.on('pointerover', function (pointer)
    {
      this.gameButton.setTexture('blueButton2');
    }.bind(this));
    this.gameButton.on('pointerout', function (pointer)
    {
      this.gameButton.setTexture('blueButton1');
    }.bind(this));
  }
  // This function centers objects.
  centerObject(gameObject, offset = 0)
  {
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    gameObject.x = width/2;
    gameObject.y = height/2 - offset *100;
  }
}
