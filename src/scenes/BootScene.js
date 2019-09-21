/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('logo', './assets/logo.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
	// Add event listener
	ChangeScene.addSceneEventListeners(this);

	// Placeholder background color
    this.cameras.main.setBackgroundColor(0x008080);

	// Shows Stage-Room in corner
	let srDebug = this.add.text(0, 0, 'Boot Scene');


  }

  update (time, delta) {
    // Update the scene
  }
}
