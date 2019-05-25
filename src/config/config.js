export default {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 640,
  height: 512,
  pixelArt: true,
  roundPixels: true,
  // These are Phaser 3 specific physics engines that are designed for games like this.
  physics:
  {
    default: 'arcade',
    arcade:
    {
      // Turn on this if you need to work on physics
      debug: false,
      gravity:
      {
        y: 0
      }
    }
  }
};
