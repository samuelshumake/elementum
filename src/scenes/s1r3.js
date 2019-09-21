/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class s1r3 extends Phaser.Scene {
  constructor () {
    super('s1r3');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('logo', './assets/sprites/player.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    ChangeScene.addSceneEventListeners(this);

	// Placeholder background color
	this.cameras.main.setBackgroundColor(0x008080);

	// Shows Stage-Room in corner
    let srDebug = this.add.text(0, 0, 'Stage 1, Room 3');

  }

  update (time, delta) {
    // Update the scene
  }
}
