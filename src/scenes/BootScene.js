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
		this.load.image('mainmenu', './assets/images/mainmenu.png');

		this.centerX = this.cameras.main.width / 2;
		this.centerY = this.cameras.main.height / 2;
	}

	create (data) {
		ChangeScene.addSceneEventListeners(this);

		var menu = this.add.image(this.centerX, this.centerY, 'mainmenu').setScale(5);

		// Title
		this.add.text(this.centerX - 200, this.centerY - 180, 'ELEMENTUM', {
			fontFamily: "Din",
			fontStyle: 'italic',
			color: '#000000',
			fontSize: 70
		});

		// Play button
		let playButton = this.physics.add.sprite(this.centerX + 190, this.centerY + 35).setScale(6.8, 2.2).setInteractive();
		playButton.on('pointerdown', () => this.scene.start('s0r1'));

		// Spell display button
		let spellButton = this.physics.add.sprite(this.centerX - 190, this.centerY + 35).setScale(6.8, 2.2).setInteractive();
		spellButton.on('pointerdown', () => this.scene.start('SpellDisplay'));

	}

	update (time, delta) {
	}
}
