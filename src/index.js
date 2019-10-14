/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
import tutorial_1 from './scenes/tutorial_1.js';
import tutorial_earth from './scenes/tutorial_earth.js';
import tutorial_water from './scenes/tutorial_water.js';
import tutorial_fire from './scenes/tutorial_fire.js';
import tutorial_air from './scenes/tutorial_air.js';
import earth_stage from './scenes/earth_stage.js';
import Config from './config/config.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
	  this.scene.add('tutorial_1', tutorial_1);
	  this.scene.add('tutorial_earth', tutorial_earth);
    this.scene.add('tutorial_water', tutorial_water);
    this.scene.add('tutorial_fire', tutorial_fire);
    this.scene.add('tutorial_air', tutorial_air);
	  this.scene.add('earth_stage', earth_stage);
    this.scene.start('tutorial_1');
  }
}

window.game = new Game();
