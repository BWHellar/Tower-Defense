export default {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 6400,
  height: 512,
  pixelArt: true,
  roundPixels: true,
  // These are Phaser 3 specific physics engines that are designed for games like this.
  physics:
  {
    default: 'arcade',
    arcade:
    {
      debug: true,
      gravity:
      {
        y: 0
      }
    }
  }
};
