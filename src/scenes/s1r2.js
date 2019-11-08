/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Player from '../sprites/Player.js';
import Enemy from '../sprites/Enemy.js';
import Spell from '../sprites/Spell.js';
import Platform from '../sprites/Platform.js';
import Lever from '../sprites/Lever.js';
import PressurePlate from '../sprites/PressurePlate.js';
import Rock from '../sprites/Rock.js';
export default class s1r2 extends Phaser.Scene {


	constructor () {
		super('s1r2');
	}


	init (data) {
		// Initialization code goes here
	}


	preload () {

		/* ---------- LOADS SPRITE SHEETS ---------- */
		this.load.spritesheet('player', './assets/spriteSheets/idleFinal.png', {	// Combine all player spritesheets into one soon
			frameHeight: 39,
			frameWidth: 34,
		});
		this.load.spritesheet('lever', './assets/spriteSheets/lever.png',{
			frameHeight: 6,
			frameWidth: 9
	    });
		this.load.spritesheet('run', './assets/spriteSheets/runPlayer.png',{
			frameHeight: 39,
			frameWidth: 34
	    });
		this.load.spritesheet('slimeAni', './assets/spriteSheets/slimesprite.png',{
			frameHeight: 14,
			frameWidth:	 21
		});
		this.load.spritesheet('tempPlatform', './assets/spriteSheets/platformMove.png',{
			frameHeight: 32,
			frameWidth:	 96
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
		this.load.spritesheet('pressurePlate', './assets/spriteSheets/pressureplate.png', {
			frameHeight: 6,
			frameWidth: 32
		});

		/* ---------- LOADS BACKGROUND -----------------------*/
		this.load.image('background', './assets/images/backgroundimage1.png');
		this.load.image('topbanner', './assets/images/topbanner.png');
		this.load.image('textBanner', './assets/images/textBackground.png');

		/* ---------- LOADS LEVEL TILEMAP ---------- */
		this.load.image('tiles', './assets/images/tilemapv2.png');
		this.load.tilemapTiledJSON('s1r2', './assets/map/s1r2.json')

		/* ---------- LOADS SPRITES FOR SPELL FRAMES ---------- */
		this.load.image('airFrame', './assets/sprites/airFrame.png');
		this.load.image('bubbleFrame', './assets/sprites/bubbleFrame.png');
		this.load.image('fireFrame', './assets/sprites/fireFrame.png');
		this.load.image('earthFrame', './assets/sprites/earthFrame.png');

		/* ---------- LOADS SPRITES FOR GAME OBJECTS ---------- */
		this.load.image('spike', './assets/sprites/spike.png');
		this.load.image('door', './assets/sprites/door.png');
		this.load.image('rock', './assets/sprites/rock.png');


	}	// ----- END OF PRELOAD ----- //


	create (data) {
	    ChangeScene.addSceneEventListeners(this);

		/* ---------- GLOBAL VARIABLES --------- */
		this.resetLevel = false
		this.gameWidth = this.cameras.main.width
		this.gameHeight = this.cameras.main.height


		/* --------- CREATES BACKGROUND --------- */
		this.add.image(350, 325,'background').setScale(1.1);


		/* ---------- CREATES MAP ---------- */
		const map = this.make.tilemap({key: "s1r2"});
		const tileset = map.addTilesetImage("tilemapv2", "tiles");
		this.layer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
		this.layer.setCollisionByProperty({ collides: true });


		/* ---------- CREATES PLAYER ---------- */
		this.player = new Player(this, 50, 492, 'player');

		/* ---------- ADJUSTS CAMERA ---------- */
		let camera = this.cameras.main;
		camera.setZoom(2);
		camera.startFollow(this.player);
		camera.setBounds(0, 0, 800, 640);


		/* ---------- CREATES DOOR ---------- */
		this.door = this.physics.add.sprite(754, 128, 'door');


		/* ------ CREATE SPIKES ---------------- */
		this.spikeGroup = [];
		for (let i = 0; i <= 5; i++) {
			this.spikeGroup.push(this.physics.add.sprite(16*i + 680, 603, 'spike').setScale(0.3))
		}

		/* ---------- CREATES BOX ---------- */
		this.rock = new Rock(this, 120, 485, 'rock');
		this.rock.setScale(1, 1);
		this.rock2 = new Rock(this, 640, 593, 'rock');
		this.rock2.setScale(1, 0.50)
		this.rockGroup = [this.rock, this.rock2];

		// /* ---------- CREATES ENEMIES ---------- */
		this.enemy1 = new Enemy(this, 150, 100, 'slimeAni');
		this.enemyGroup = [this.enemy1];

		/* ---------- CREATES PLATFORMS ---------- */
		this.platform1 = new Platform(this, 576, 271, 'tempPlatform').setScale(0.66, 1);
		this.platform1.options = ['up', 95, this.platform1, 1, 0];
		this.platform2 = new Platform(this, 640, 528, 'tempPlatform').setScale(0.66, 1);
		this.platform2.options = ['up', 95, this.platform2, 1, 0];
		this.platform3 = new Platform(this, 500, 144, 'tempPlatform').setScale(0.3, 3);
		this.platform3.options = ['right', 95, this.platform3, 1, 1300];

		//this.physics.add.collider(this.enemyGroup, this.platform1);
		this.physics.add.collider(this.enemyGroup, this.platform2);
		this.physics.add.collider(this.enemyGroup, this.rockGroup);


		this.lever1 = new Lever(this, 50, 150, 'lever');
		this.lever2 = new Lever(this, 788, 560, 'lever');
		this.lever2.flipY = true;
		this.lever2.angle = 90;

		this.plate = new PressurePlate(this, 255, 507, 'pressurePlate');


		/* ---------- KEYS FOR INTERACTING ---------- */
		this.switchFire = this.input.keyboard.addKey('one');
		this.switchEarth = this.input.keyboard.addKey('two');
		this.switchWater = this.input.keyboard.addKey('three');
		this.switchAir = this.input.keyboard.addKey('four');
		this.interact = this.input.keyboard.addKey('e');
		this.reset = this.input.keyboard.addKey('r');
		this.castSpell = this.input.keyboard.addKey('space');

	}	// ---------- END OF CREATE ---------- //


	update (time, delta) {

		/* ---------- RESETS LEVEL ---------- */
		if (this.resetLevel) {
			this.scene.start('s1r2')
		}


		/* ---------- STARTS NEXT LEVEL ---------- */
		if (this.nextLevel) {
			this.scene.start('s1r3');
		}

		/* ---------- MOVES PLAYER ---------- */
		this.player.move(this);

		/*----------- ENEMY MOVEMENT -------------- */
		for(var x in this.enemyGroup){
			this.enemyGroup[x].move(this, this.player);
		}

		/* ----------- PLAYER KILLERS ----------- */
		this.physics.overlap(this.player, Object.values(this.enemyGroup), () => this.resetLevel = true);
		this.physics.overlap(this.player, Object.values(this.spikeGroup), () => this.resetLevel = true);
		this.physics.overlap(this.player, this.door, () => this.nextLevel = true);




		/* ---------- CHECKS TO DEACTIVATE SPELLS ---------- */
		if (this.player.spellActive['fire']) {
			this.player.fireball.deactivate(this, this.enemyGroup);
			for (let x in this.enemyGroup) {
				this.physics.overlap(this.player.fireball, this.enemyGroup[x], () => this.enemyGroup[x].deactivate(this, this.player.fireball, x));
			}
		}
		if (this.player.spellActive['water']) {
			this.player.bubble.deactivate(this, this.enemyGroup);
			for (let x in this.enemyGroup) {
				this.physics.overlap(this.player.bubble, this.enemyGroup[x], () => this.enemyGroup[x].deactivate(this, this.player.bubble, x));
			}
			if (this.boxGroup) {
				for (let x in this.boxGroup) {
					this.physics.add.overlap(this.boxGroup[x], this.player.bubble, () => {
						this.player.bubble.suspend(this, this.boxGroup[x]);
					});
				}
			}
		}
		if (this.player.spellActive['air']) {
			this.player.airwave.deactivate(this, this.enemyGroup);
			for (let x in this.enemyGroup) {
				this.physics.overlap(this.player.airwave, this.enemyGroup[x], () => this.enemyGroup[x].deactivate(this, this.player.airwave, x));
			}
			if (this.rockGroup) {
				for (let x in this.rockGroup) {
					this.physics.add.overlap(this.rockGroup[x], this.player.airwave, () => {
						this.player.airwave.push(this, this.rockGroup[x], this.player.flipX);
					});
				}
			}
			if (this.boxGroup) {
				for (let x in this.boxGroup) {
					this.physics.add.overlap(this.boxGroup[x], this.player.airwave, () => {
						this.player.airwave.push(this, this.boxGroup[x], this.player.flipX);
					});
				}
			}
		}


		/* ---------- CASTING SPELLS ---------- */
		if (this.switchFire.isDown) {
			this.player.currentSpell = 'fire';
		} else if (this.switchEarth.isDown) {
			this.player.currentSpell = 'earth';
		} else if (this.switchWater.isDown) {
			this.player.currentSpell = 'water';
		} else if (this.switchAir.isDown) {
			this.player.currentSpell = 'air';
		}

		if (this.reset.isDown) {
			this.resetLevel = true;
		}

		// Casts spell if cooldown timer has been met
		if (this.castSpell.isDown && this.player.spellTimer > 70 ) {
			this.player.cast(this, this.player.currentSpell, this.player.flipX);
	 	}

		if (this.interact.isDown) {
			this.lever1.flip(this, [this.platform1]);
			this.lever2.flip(this, [this.platform2]);
		}

		if (this.physics.overlap(this.rock, this.plate)) {
			this.plate.trip(this, [this.platform3]);
		} else if (this.plate.tripped) {
			this.plate.deactivate(this, [this.platform3]);
		}

    }	// ----- END OF UPDATE ----- //

}	// ----- END OF PHASER SCENE ----- //
