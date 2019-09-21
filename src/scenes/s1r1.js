/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class s1r1 extends Phaser.Scene {
  constructor () {
    super('s1r1');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.spritesheet('player', './assets/spriteSheets/player.png', {
		frameHeight: 32,
		frameWidth: 32,
	});

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    ChangeScene.addSceneEventListeners(this);

	// Placeholder background color
	this.cameras.main.setBackgroundColor(0x008080);

	// Shows Stage-Room in corner
	let srDebug = this.add.text(0, 0, 'Stage 1, Room 1');

	// Adds character into the scene
	this.player = this.physics.add.sprite(300, 400, 'player');
	this.player.setCollideWorldBounds(true);
	this.player.setScale(2);


  }

  update (time, delta) {
    // Update the scene
  }
}
