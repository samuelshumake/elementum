/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
import SpellDisplay from './scenes/SpellDisplay.js';
import s0r1 from './scenes/s0r1.js';
import s0r2 from './scenes/s0r2.js';
import s0r3 from './scenes/s0r3.js';
import s0r4 from './scenes/s0r4.js';
import s0r5 from './scenes/s0r5.js';
import s0r6 from './scenes/s0r6.js';
import s1r1 from './scenes/s1r1.js';
import Config from './config/config.js';

class Game extends Phaser.Game {
	constructor () {
		super(Config);
		this.scene.add('Boot', BootScene);
		this.scene.add('Spells', SpellDisplay);
		this.scene.add('s0r1', s0r1);
		this.scene.add('s0r2', s0r2);
		this.scene.add('s0r3', s0r3);
		this.scene.add('s0r4', s0r4);
		this.scene.add('s0r5', s0r5);
		this.scene.add('s0r6', s0r6);
		this.scene.add('s1r1', s1r1);
		this.scene.start('s1r1');
  }
}

window.game = new Game();
