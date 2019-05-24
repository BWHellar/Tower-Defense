import 'phaser';

export default class PreloaderScene extends Phaser.Scene
{
  constructor()
  {
    super('Preloader');
  }

  //This will be called first before the preload
  init()
  {
    this.readyCount = 0;
  }

  preload()
  {
    //Timer Event
    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);
    this.createPreLoader();
    this.loadAsset();
  }
  // This is our preloader.
  createPreLoader()
  {
    // The good thing about the Phaser framework is uses a Camera as it is specifically designed for games.
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    // This will add a logo to out project on start.
    this.add.image(width/2, height/2-100, 'logo');
    // Now we are going to display a progress bar for loading the assets in the program.
    // .graphics allos us to create objects without loading a file.
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width/2-160, height/2-30,320,50);

    // This is our loading text (As in this is where it says Loading)
    var loadingText = this.make.text
    ({
      x: width/2,
      y: height/2-50,
      text: "Loading...",
      style: {
        font:'20px monospace',
        fill:'#ffffff'
      }
    });
    // We are setting the load origin to the center so it is above and centered above the load bar.
    loadingText.setOrigin(0.5, 0.5);
    // This is our loading text (As in this is where the percentage is)
    var percentText = this.make.text
    ({
      x: width/2,
      y: height/2-5,
      text: "0%",
      style: {
        font:'18px monospace',
        fill:'#ffffff'
      }
    });
    // We are setting the load origin to the center so it is above and centered above the load bar.
    percentText.setOrigin(0.5, 0.5);
    // This is our loading text (As in this is where we will diaply what is loading)
    var assetText = this.make.text
    ({
      x: width/2,
      y: height/2+50,
      text: "",
      style: {
        font:'18px monospace',
        fill:'#ffffff'
      }
    });
    // We are setting the load origin to the center so it is above and centered above the load bar.
    assetText.setOrigin(0.5, 0.5);

    // Our update
    this.load.on('progress', function (value)
    {
      // This is so we get a nice number between 0-100
      percentText.setText(parseInt(value*100) + '%');
      progressBar.clear();
      // We want to put an inner rect inside our progress box.
      progressBar.fillStyle(0xfffffff, 1);
      progressBar.fillRect(width/2-150,height/2-20,300*value,30);
    });

    // Update file progress text.
    this.load.on('fileprogress', function(file)
    {
    assetText.setText('Loading asset: ' + file.key);
    });

    //Remove progress bar
    this.load.on('complete', function()
    {
      progressBox.destroy();
      progressBar.destroy();
      assetText.destroy();
      loadingText.destroy();
      percentText.destroy();
      this.ready();
    }.bind(this));
  }
  // This is our function to load up all the assets we will be needing.
  loadAsset()
  {
    this.load.image('logo', 'src/assets/Smiley.png');
    this.load.image('bullet', 'src/assets/level/Bullet.png');
    this.load.image('tower', 'src/assets/level/tankRed.png');
    this.load.image('tankSand', 'src/assets/level/tankSand.png');
    this.load.image('tankBody', 'src/assets/level/tankBody.png');
    this.load.image('cursor', 'src/assets/ui/cursor.png');
    this.load.image('title', 'src/assets/ui/title.png');
    this.load.image('blueButton1', 'src/assets/ui/blueButton1.png');
    this.load.image('blueButton2', 'src/assets/ui/blueButton2.png');

    // This is just a logo we want to load.
    this.load.image('logo2', 'src/assets/Smiley.png');

    // Since we are doing a tower defense we will be using a json file and then having out terrain populate the tilemap.
    this.load.tilemapTiledJSON('level1', 'src/assets/level/level1.json');
    this.load.spritesheet('terrain', 'src/assets/level/terrain.png', { frameWidth:64, frameHeight:64});
  }
  // This function will fire when the game is ready to load to the title.
  ready()
  {
    this.readyCount++;
    if (this.readyCount ===2)
    {
      this.scene.start('Title');
    }
  }
}
