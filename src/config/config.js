/*global Phaser*/

export default {
	type: Phaser.AUTO,
	parent: 'phaser-example',
	scale: {
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	width: 800,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: { y: 0 }
		}
	},
pixelArt: true
};
