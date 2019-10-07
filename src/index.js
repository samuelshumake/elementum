/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
import s1r1 from './scenes/s1r1.js';
import s1r2 from './scenes/s1r2.js';
import s1r3 from './scenes/s1r3.js';
import Config from './config/config.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
	this.scene.add('s1r1', s1r1);
	this.scene.add('s1r2', s1r2);
	this.scene.add('s1r3', s1r3);
    this.scene.start('s1r2');
  }
}

window.game = new Game();
