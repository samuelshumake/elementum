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
	this.load.image('logo', './assets/images/logo.png');
	this.load.image('mainmenu', './assets/images/mainmenu.png');
	this.load.image('textBanner', './assets/images/textBackground.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
	}

  create (data) {
	// Add event listener
	ChangeScene.addSceneEventListeners(this);

	// Main Menu background loading
	var logo = this.add.image(this.centerX, this.centerY, 'mainmenu');
	logo.setScale(6.25)

	// Title text
	var title = this.add.text(50, 100, 'Elementum').setInteractive();
	title.setFontSize(70);
	title.setColor('#000000');

	// Create play button
	var play = this.add.text(580, 170, 'Play').setInteractive();
	play.setFontSize(40);
	play.setColor('#000000');
	play.on('pointerover', function() {
		play.setColor('#ffffff');
	 });
	play.on('pointerout', function() {
		play.setColor('#000000');
	 });
	play.on('pointerdown', function() {
		this.scene.start('s0r1');
	}, this);

	// Create elements button
	var elements = this.add.text(535, 450, 'Elements').setInteractive();
	elements.setFontSize(40);
	elements.setColor('#000000');
	elements.on('pointerover', function() {
		elements.setColor('#ffffff');
	 });
	elements.on('pointerout', function() {
		elements.setColor('#000000');
	 });
	elements.on('pointerdown', function() {
		this.scene.start('SpellDisplay');
	}, this);


  }

  update (time, delta) {
    // Update the scene

  }
}
