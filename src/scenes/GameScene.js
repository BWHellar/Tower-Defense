import 'phaser';
import map from '../config/map';
import Enemy from '../objects/Enemy';
import Turret from '../objects/Turret';
import Bullet from '../objects/Bullet';
import levelConfig from '../config/levelConfig';

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
    this.nextEnemy = 0;
    this.score = 0;
    this.baseHealth = 3;
    this.availableTurrets = 2;
    this.roundStarted = false;

    this.events.emit('displayUI');
    this.events.emit('updateHealth', this.baseHealth);
    this.events.emit('updateScore', this.score);
    this.events.emit('updateTurrets', this.availableTurrets);

    this.uiScene = this.scene.get('UI');
  }

  create()
  {
    this.events.emit('startRound');

    this.uiScene.events.on('roundReady', function()
    {
      this.roundStarted = true;
    }.bind(this));
    
    this.createMap();
    this.createPath();
    this.createCursor();
    this.createGroups();
  }

  update(time, delta)
  {
    // Checks if its time for new enemy
    if (time> this.nextEnemy && this.roundStarted === true)
    {
      var enemy = this.enemies.getFirstDead();
      if (!enemy)
      {
        enemy = new Enemy(this,0, 0, this.path);
        this.enemies.add(enemy);
      }
      if(enemy)
      {
        enemy.setActive(true);
        enemy.setVisible(true);

        //Place Enemy at the start
        enemy.startOnPath();

        this.nextEnemy = time +2000;
      }
    }
  }

  updateScore(score)
  {
    this.score += score;
    this.events.emit('updateScore', this.score);
  }

  updateHealth(health)
  {
    this.baseHealth -= health;
    this.events.emit('updateHealth', this.baseHealth);

    if(this.baseHealth <= 0)
    {
      this.events.emit('hideUI');
      this.scene.start('Title');
    }
  }

  updateTurrets()
  {
    this.availableTurrets--;
    this.events.emit('updateTurrets', this.availableTurrets);
  }

  createGroups()
  {
    this.enemies = this.physics.add.group({classType: Enemy, runChildUpdate: true});
    this.turrets = this.add.group({ classType: Turret, runChildUpdate: true});
    this.bullets = this.physics.add.group({classType: Bullet, runChildUpdate: true});

    this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy.bind(this));
    this.input.on('pointerdown', this.placeTurret.bind(this));
  }
  // This creates the cursor so we can tie it to the red box we used to place the turrets.
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
    return this.map[i][j]===0 && this.availableTurrets >0;
  }
  // This allows us to create the path that enemies will follow later.
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
  // This will create the map for us.
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

  getEnemy(x, y, distance)
  {
    var enemyUnits = this.enemies.getChildren();
    for(var i = 0; i < enemyUnits.length; i++)
    {
      if(enemyUnits[i].active && Phaser.Math.Distance.Between(x,y, enemyUnits[i].x, enemyUnits[i].y) <= distance)
      return enemyUnits[i];
    }
    return false;
  }

  addBullet(x,y,angle)
  {
    var bullet = this.bullets.getFirstDead();
    if(!bullet)
    {
      bullet = new Bullet(this,0,0);
      this.bullets.add(bullet);
    }
    bullet.fire(x,y,angle);
  }

  placeTurret(pointer)
  {
    var i = Math.floor(pointer.y/64);
    var j = Math.floor(pointer.x/64);

    if(this.canPlaceTurret(i,j))
    {
      var turret = this.turrets.getFirstDead();
      if(!turret)
      {
        turret = new Turret(this,0,0,this.map);
        this.turrets.add(turret);
      }
      turret.setActive(true);
      turret.setVisible(true);
      turret.place(i,j);
      this.updateTurrets();
    }
  }

  damageEnemy(enemy, bullet)
  {
    if(enemy.active === true && bullet.active === true)
    {
      bullet.setActive(false);
      bullet.setVisible(false);

      enemy.recieveDamage(50);
      enemy.recieveDamage(levelConfig.initial.bulletDamage);
    }
  }
}
