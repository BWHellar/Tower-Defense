import 'phaser';

export default class UIScene extends Phaser.Scene
{
  constructor()
  {
    // This allows us to run a scene in parallel
    super({key: 'UI', active: true});
  }

  init()
  {
    this.gameScene = this.scene.get('Game');
  }
  create()
  {
    this.setupUIElements();
    this.setupEvents();
  }

  setupUIElements()
  {
    // These are our text objects in our game through our UI overlay.
    this.scoreText = this.add.text(5,5,'Score: 0', { fontSize: '16px', fill: '#fff'});
    this.healthText = this.add.text(10,490,'Base Health: 0', { fontSize: '16px', fill: '#fff'});
    this.turretsText = this.add.text(490,5,'Turrets Left: 0', { fontSize: '16px', fill: '#fff'});
    this.roundTimeText = this.add.text(230,5,'Round Starts In: 10', { fontSize: '16px', fill: '#fff'});
    this.enemiesText = this.add.text (10,470, 'Enemies Remaining: 0', { fontSize: '16px', fill: '#fff'});
    this.levelText = this.add.text (0,0, 'Level: 0', { fontSize: '40px', fill: '#fff'});

    // center level text
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    Phaser.Display.Align.In.Center(
      this.levelText,
      this.add.zone(width/2, height /2, width, height)
    );

    this.hideUIElements();
  }

  hideUIElements()
  {
    // We are setting the alpha to 0 so we can hide the objects when we dont need them.
    this.scoreText.alpha = 0;
    this.healthText.alpha = 0;
    this.turretsText.alpha = 0;
    this.roundTimeText.alpha = 0;
    this.enemiesText.alpha = 0;
    this.levelText.alpha = 0;
  }
  setupEvents()
  {
    this.gameScene.events.on('displayUI', function()
    {
      // Then when we want to display the UI when we are int he game.
      this.scoreText.alpha = 1;
      this.healthText.alpha = 1;
      this.turretsText.alpha = 1;
      this.enemiesText.alpha = 1;
    }.bind(this));
    // Bind the score update,
    this.gameScene.events.on('updateScore', function(score)
    {
      this.scoreText.setText('Score: ' + score);
    }.bind(this));
    // Enemy update
    this.gameScene.events.on('updateEnemies', function(enemies)
    {
      this.enemiesText.setText('Enemies Remaining: ' + enemies);
    }.bind(this));
    // Bind the health update,
    this.gameScene.events.on('updateHealth', function(health)
    {
      this.healthText.setText('Base Health: ' + health);
    }.bind(this));
    // Bind the Turret limit.
    this.gameScene.events.on('updateTurrets', function(turret)
    {
      this.turretsText.setText('Turrets Left: ' + turret);
    }.bind(this));
    // Bind the hide UI.
    this.gameScene.events.on('hideUI', function()
    {
      this.hideUIElements();
    }.bind(this));

    this.gameScene.events.on('startRound', function (level) {
      this.levelText.setText('Level: ' + level);
      this.levelText.alpha = 1;

      // fade level text
      this.add.tween({
        targets: this.levelText,
        ease: 'Sine.easeInOut',
        duration: 1000,
        delay: 2000,
        alpha:
        {
          getStart: function () { return 1; },
          getEnd: function () { return 0; },
        },
        onComplete: function ()
        {
          this.roundTimeText.setText('Round Start In: 10');
          this.roundTimeText.alpha = 1;
          var timedEvent = this.time.addEvent(
            {
            delay: 1000,
            callbackScope: this,
            repeat: 9,
            callback: function ()
            {
              this.roundTimeText.setText('Round Start In: ' + timedEvent.repeatCount);
              if (timedEvent.repeatCount === 0)
              {
                this.events.emit('roundReady');
                this.roundTimeText.alpha = 0;
              }
            }
          });
        }.bind(this)
      });
    }.bind(this));
  }
}
