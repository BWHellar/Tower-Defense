import 'phaser';
import map from '../config/map';

export default class GameScene extends Phaser.Scene
{
  constructor()
  {
    super('Game');
  }
  init()
  {
    this.map = map.map(function(arr)
    {
      return arr.slice();
    });
  }
  create()
  {
    this.createMap();
    this.createPath();
    this.createCursor();
  }
  createCursor()
  {
    this.cursor = this.add.image(32,32, 'cursor');
    this.cursor.setScale(2);
    this.cursor.alpha = 0;
    // This will allow us to follwo the pointer.
    this.input.on('pointermove', function (pointer)
    {
      var i = Math.floor(pointer.y/64);
      var j = Math.floor(pointer.x/64);

      if(this.canPlaceTurret(i,j))
      {
        // This is so the cursor is centered in the cell.
        this.cursor.setPosition(j*64+32,i*64+32);
        this.cursor.alpha = .8;
      }
      // We use this so we hide the cursor if we are in a spot we are unabel to drop turrets in.
      else
      {
        this.cursor.alpha = 0;
      }
    }.bind(this));
  }
  // This allows us to place. The binding function allows us to pass in to the above scope.
  canPlaceTurret(i,j)
  {
    return this.map[i][j]===0;
  }

  createPath()
  {
    this.graphics = this.add.graphics();
    //Path Creation
    this.path = this.add.path(96, -32);
    this.path.lineTo(96, 164);
    this.path.lineTo(480, 164);
    this.path.lineTo(480, 544);

    this.graphics.lineStyle(3, 0xffffff, 1);
    this.path.draw(this.graphics);
  }
  createMap()
  {
    //Map Creation
    this.bgMap = this.make.tilemap({ key: 'level1' });
    // Add tileset image
    this.tiles = this.bgMap.addTilesetImage('terrain');

    // Create background layer
    this.backgroundLayer = this.bgMap.createStaticLayer('Background', this.tiles, 0, 0);
    // Add tower
    this.add.image(480,480,'base');
  }
}
