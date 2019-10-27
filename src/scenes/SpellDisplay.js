/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Player from '../sprites/Player.js';
import Enemy from '../sprites/Enemy.js';
import Spell from '../sprites/Spell.js';
import Platform from '../sprites/Platform.js';
import Rock from '../sprites/Rock.js';
import Box from '../sprites/Box.js';
export default class SpellDisplay extends Phaser.Scene {
	constructor () {
		super('SpellDisplay');
	}

	init (data) {
    // Initialization code goes here
	}

	preload () {
	    // Preload assets
		this.load.spritesheet('player', './assets/spriteSheets/idleFinal.png', {	// Combine all player spritesheets into one soon
			frameHeight: 39,
			frameWidth: 34,
		});
		this.load.spritesheet('slimeAni', './assets/spriteSheets/slimesprite.png',{
			frameHeight: 14,
			frameWidth:	 21
		});
		this.load.spritesheet('water', './assets/spriteSheets/bubbleAnimation.png', {
			frameHeight: 32,
			frameWidth: 32,
		});
		this.load.spritesheet('earth', './assets/spriteSheets/earthAnimation.png', {
			frameHeight: 32,
			frameWidth: 64,
		});
		this.load.spritesheet('fire', './assets/spriteSheets/fireballAnimation.png', {
			frameHeight: 32,
			frameWidth: 48,
		});
		this.load.spritesheet('air', './assets/spriteSheets/airAnimation.png', {
			frameHeight: 32,
			frameWidth: 48,
		});

		/* ---------- LOADS BACKGROUND -----------------------*/
		this.load.image('background', './assets/images/backgroundimage1.png');

		/* ---------- LOADS LEVEL TILEMAP ---------- */
		this.load.image('tiles', './assets/images/tilemapv2.png');
		this.load.tilemapTiledJSON('display', './assets/map/display.json');

		this.load.image('box', './assets/sprites/box.png');
		this.load.image('rock', './assets/sprites/rock.png');
	}

  create (data) {
	// Add event listener
	ChangeScene.addSceneEventListeners(this);

	// Spell tutorial background loading
	const map = this.make.tilemap({key: 'display'});
	const tileset = map.addTilesetImage('tilemapv2', 'tiles');
	this.layer = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
	this.layer2 = map.createStaticLayer('Tile Layer 2', tileset, 0, 0);
	this.layer.setCollisionByProperty({ collides: true });

	// Create main text
	var spellText = this.add.text(280, 50, 'SPELLS', {fontSize: 70, color: '#fff'})
	var fireText = this.add.text(220, 180, 'Fire', {fontSize: 45, color: '#dc143c'});
	var earthText = this.add.text(460, 180, 'Earth', {fontSize: 45, color: '#679c4d'});
	var waterText = this.add.text(15, 505, 'Water', {fontSize: 45, color: '#87ceeb'});
	var airText = this.add.text(680, 505, 'Air', {fontSize: 45, color: '#ffffff'});

	// Create back button
	var backButton = this.add.text(50, 50, 'Back', {fontSize: 40, color: '#000000', backgroundColor: '#fff'}).setInteractive();
	backButton.on('pointerdown', () => this.scene.start('Boot'));

	this.player1 = this.physics.add.sprite(445, 290, 'player').setScale(1.5).setGravity(0, 800);
	this.player2 = this.physics.add.sprite(445, 483, 'player').setScale(1.5);
	this.player3 = this.physics.add.sprite(355, 290, 'player').setScale(1.5);
	this.player4 = this.physics.add.sprite(355, 483, 'player').setScale(1.5);
	this.player3.flipX = true;
	this.player4.flipX = true;

	this.physics.add.collider(this.layer, this.player1);

	this.enemy = new Enemy(this, 200, 305, 'slimeAni');


	this.box = new Box(this, 200, 485, 'box').setScale(0.8).body.setGravity(0, 800);
	this.rock = new Rock(this, 600, 500, 'rock').setScale(0.8).body.setGravity(0, 800);


	this.fireball = new Spell(this, 330, 290, 'fire');
	this.earthSpell = new Spell(this, 445, 335, 'earth');
	this.waterSpell = new Spell(this, 355, 483, 'water');
	this.airwave = new Spell(this, 445, 483, 'air');

	this.fireball.shoot(true);
	this.earthSpell.raise(this, this.player1);
	setTimeout(() => this.earthSpell.destroy(), 850);
	this.waterSpell.shoot(true);
	this.airwave.shoot(false);

	this.spellTimer = 0;
  }

  update (time, delta) {
	  this.spellTimer++;

	  if (this.spellTimer >= 200) {
		  this.fireball = new Spell(this, 330, 290, 'fire');
		  this.earthSpell = new Spell(this, 445, 335, 'earth');
		  this.waterSpell = new Spell(this, 355, 483, 'water');
		  this.airwave = new Spell(this, 445, 483, 'air');

		  this.fireball.shoot(true);
		  this.earthSpell.raise(this, this.player1);
		  setTimeout(() => this.earthSpell.destroy(), 850);
		  this.waterSpell.shoot(true);
		  this.airwave.shoot(false);

		  this.spellTimer = 0;
	  }

	  if (this.waterSpell.active && this.waterSpell.x <= 210) {
		this.waterSpell.destroy();
		this.box.setGravity(0, -100);
  		this.box.setVelocityY(-200);
  		setTimeout(() => {
			this.box.setVelocity(0);
			this.box.setGravity(0, 300)}, 500)

	  }

	  if (this.physics.overlap(this.fireball, this.enemy)) {
		  this.fireball.destroy();
		  this.enemy.destroy();
		  setTimeout(() => this.enemy = new Enemy(this, 200, 305, 'slimeAni'), 1100);
	  }

	  if (this.airwave.active && this.airwave.x >= 550) {
		  this.airwave.destroy();
		  this.rock.setVelocity(300, 0);
		  setTimeout(() => {
			  this.rock.destroy();
			  this.rock = new Rock(this, 600, 500, 'rock').setScale(0.8).body.setGravity(0, 800)}, 1000);

	  }


  }

}
