/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Player from '../sprites/Player.js';
import Enemy from '../sprites/Enemy.js';
import Spell from '../sprites/Spell.js';
import Platform from '../sprites/Platform.js';
export default class SpellDisplay extends Phaser.Scene {
	constructor () {
		super('Spells');
	}

	init (data) {
    // Initialization code goes here
	}

	preload () {
    // Preload assets
	this.load.image('logo', './assets/images/logo.png');
	this.load.image('tiles', './assets/images/tilemapv2.png');
	this.load.tilemapTiledJSON('display', './assets/map/display.json');

	// Load spritesheets
	this.load.spritesheet('player', './assets/spriteSheets/idleFinal.png', {
		frameHeight: 39,
		frameWidth: 34,
	});
	this.load.spritesheet('run', './assets/spriteSheets/runPlayer.png',{
		frameHeight: 39,
		frameWidth: 34
		});
	this.load.spritesheet('slimeAni', './assets/spriteSheets/slimesprite.png',{
		frameHeight: 14,
		frameWidth:	 21
	});
	this.load.spritesheet('manaBar', './assets/spriteSheets/manaPotion.png', {
		frameHeight: 64,
		frameWidth: 64,
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

	// Load sprites for game OBJECTS
	this.load.image('spike', './assets/sprites/spike.png');
	this.load.image('rock', './assets/sprites/rock.png');
	this.load.image('box', './assets/sprites/box.png');

  // Declare variables for center of the scene
  this.centerX = this.cameras.main.width / 2;
  this.centerY = this.cameras.main.height / 2;

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

	// Creates mana bar
	this.manaBar = this.add.sprite(this.cameras.main.width - 50, 40, 'manaBar', 27);
	this.anims.create({
		key: "regenMana",
		frames: this.anims.generateFrameNumbers("manaBar", {start: 0, end: 27}),
		frameRate: 24,
	});


	/* ---------- CREATES PLAYER ---------- */
	this.player = new Player(this, 200, 310, 'player');
	this.player2 = new Player(this, 525, 310, 'player');
	this.player3 = new Player(this, 200, 480, 'player');
	this.player4 = new Player(this, 450, 480, 'player');


	// Create main text
	var title = this.add.text(275, 100, 'Spells');
	title.setFontSize(70);
	title.setColor('#ffffff');
	// Element texts
	var fire = this.add.text(23, 315, 'Fire');
	fire.setFontSize(45);
	fire.setColor('#DC143C');
	var earth = this.add.text(655, 315, 'Earth');
	earth.setFontSize(45);
	earth.setColor('#808000');
	var water = this.add.text(15, 505, 'Water');
	water.setFontSize(45);
	water.setColor('#87CEEB');
	var air = this.add.text(680, 505, 'Air');
	air.setFontSize(45);
	air.setColor('#ffffff');

	// Create back button
	var play = this.add.text(50, 50, 'Back').setInteractive();
	play.setFontSize(40);
	play.setColor('#000000');
	play.on('pointerover', function() {
		play.setColor('#ffffff');
	 });
	play.on('pointerout', function() {
		play.setColor('#000000');
	 });
	play.on('pointerdown', function() {
		this.scene.start('Boot');
	}, this);

  }

  update (time, delta) {


		/* ---------- CHECKS TO DEACTIVATE SPELLS ---------- */
		if (this.player.spellActive['fire']) {
			this.player.fireball.deactivate(this, this.enemyGroup);
			for (let x in this.enemyGroup) {
				this.physics.overlap(this.player.fireball, this.enemyGroup[x], () => this.enemyGroup[x].deactivate(this, this.player.fireball, x));
			}
		}
		if (this.player3.spellActive['water']) {
			this.physics.add.overlap(this.box, this.player3.bubble, () => {			// fix this
				this.player3.bubble.suspend(this, this.box);
			})
		}
		if (this.player4.spellActive['air']) {
			this.physics.add.overlap(this.rock, this.player4.airwave, () => {			// fix this
				this.player4.airwave.push(this, this.rock);
			})
		}


		/* ---------- CASTING SPELLS ---------- */
		this.player.currentSpell = 'fire';
		this.player2.currentSpell = 'earth';
		this.player3.currentSpell = 'water';
		this.player4.currentSpell = 'air';

		// Casts spell if cooldown timer has been met
		if (this.player.spellTimer > 70 ) {
			// -------- Spawn slime
			this.enemy1 = new Enemy(this, 350, 310, 'slimeAni');
			this.enemyGroup = [this.enemy1];
			for(var x in this.enemyGroup){
				this.enemyGroup[x].move(this, this.player);
			}
			// --------- Spawn ROCK
			this.rock = this.physics.add.sprite(550, 475, 'rock');
			this.rock.setScale(0.8, 1);
			this.physics.add.collider(this.rock, this.layer);
			this.physics.add.collider(this.player, this.rock);
			this.rock.body.immovable = false;
			this.rock.setCollideWorldBounds = true;
			this.rock.setGravity(0, 600);
			// ---------- CREATE box
			this.box = this.physics.add.sprite(340, 495, 'box');
			this.physics.add.collider(this.box, this.layer);
			this.physics.add.collider(this.player, this.box);
			this.box.body.immovable = false;
			this.box.setGravity(0, 600);
			// -------- Cast spells
			this.player.cast(this, this.player.currentSpell, this.player.flipX);
			this.player2.cast(this, this.player2.currentSpell, this.player2.flipX);
			this.player3.cast(this, this.player3.currentSpell, this.player3.flipX);
			this.player4.cast(this, this.player4.currentSpell, this.player4.flipX);
			this.manaBar.play('regenMana', true);
			this.player.spellTimer = 70;
		}

  }
}
