/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Player from '../sprites/Player.js';
import Enemy from '../sprites/Enemy.js';
import Spell from '../sprites/Spell.js';
import Platform from '../sprites/Platform.js';
import Lever from '../sprites/Lever.js';
import PressurePlate from '../sprites/PressurePlate.js';
import Rock from '../sprites/Rock.js';
import Box from '../sprites/Box.js';
export default class s1r5 extends Phaser.Scene {

	constructor () {
		super('s2r1');
	}

	init (data) {
		// Initialization code goes here
	}

	preload () {
		/* ---------- LOADS SPRITE SHEETS ---------- */
		this.load.spritesheet('player', './assets/spriteSheets/idleFinal.png', {
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
		this.load.spritesheet('water', './assets/spriteSheets/water.png', {
			frameHeight: 32,
			frameWidth: 32,
		});
		this.load.spritesheet('earth', './assets/spriteSheets/earth.png', {
			frameHeight: 96,
			frameWidth: 32,
		});
		this.load.spritesheet('fire', './assets/spriteSheets/fire.png', {
			frameHeight: 32,
			frameWidth: 48,
		});
		this.load.spritesheet('air', './assets/spriteSheets/air.png', {
			frameHeight: 32,
			frameWidth: 48,
		});
		this.load.spritesheet('pressurePlate', './assets/spriteSheets/pressureplate.png', {
			frameHeight: 6,
			frameWidth: 32
		});

		/* ---------- LOADS LEVEL TILEMAP ---------- */
		this.load.image('tiles', './assets/images/tilemapv3.png');
		this.load.tilemapTiledJSON('s2r1', './assets/map/s2r1.json')

		/* ---------- LOADS SPRITES FOR GAME OBJECTS ---------- */
		this.load.image('platform', './assets/sprites/platform.png');
		this.load.image('spike', './assets/sprites/spike.png');
		this.load.image('rock', './assets/sprites/rock.png');
		this.load.image('box', './assets/sprites/box.png');
		this.load.image('cameraFrame', './assets/sprites/cameraFrame.png');
	}	// ---------- END OF PRELOAD ---------- //

	create (data) {
		ChangeScene.addSceneEventListeners(this);

		/* ---------- GLOBAL VARIABLES --------- */
		this.resetLevel = false
		this.gameWidth = this.cameras.main.width
		this.gameHeight = this.cameras.main.height

		/* --------- CREATES BACKGROUND --------- */
		this.add.image(350, 325,'background').setScale(1.1);

		/* ---------- CREATES MAP ---------- */
		const map = this.make.tilemap({key: "s2r1"});
		const tileset = map.addTilesetImage("tilemapv3", "tiles");
		this.layer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
		this.layer.setCollisionByProperty({ collides: true });

		/* ---------- CREATES PLAYER ---------- */
		this.player = new Player(this, 100, 200, 'player');

		/* ---------- ADJUSTS CAMERA ---------- */
		let camera = this.cameras.main;
		// camera.setZoom(2);
		// camera.startFollow(this.player);
		// camera.setBounds(0, 0, 800, 640);

		/* ---------- CREATES DOOR ---------- */
		this.door = this.physics.add.sprite(712, 325);

		/* ---------- CREATES ROCKS ---------- */
		// this.rock = new Rock(this, 4150, 485, 'rock');
		// this.rock.setScale(1, 1);
		// this.rock2 = new Rock(this, 6400, 593, 'rock');
		// this.rock2.setScale(1, 0.50)
		// this.rockGroup = [this.rock, this.rock2];

		// /* ---------- CREATES ENEMIES ---------- */
		// this.enemy1 = new Enemy(this, 550, 500, 'slimeAni');
		// this.enemy2 = new Enemy(this, 475, 500, 'slimeAni');
		// this.enemy3= new Enemy(this, 300, 500, 'slimeAni');
		// this.enemyGroup = [this.enemy1, this.enemy2, this.enemy3];

		/* ---------- CREATES SPIKES ------------ */
		this.spikeGroup = [];
		for (let i = 0; i <= 33; i++) {
			var spike = this.physics.add.sprite(16*i + 232, 603, 'spike').setScale(0.3);
			spike.body.immovable = true;
			this.spikeGroup.push(spike);
		}

		/* ---------- CREATES PLATFORMS ---------- */
		this.platform = new Platform(this, 704, 463, 'platform').setScale(1.33, 0.3);
		this.platform.options = ['left', 130];

		/* ---------- CREATES COLLIDERS --------- */
		// this.physics.add.collider(this.enemyGroup, this.platform);
		// this.physics.add.collider(this.enemyGroup, this.rockGroup);

		/* ---------- CREATES BOXES -------------- */
		this.box = new Box(this, 170, 200, 'box').setScale(1.75);
		this.box.body.setImmovable(true);
		this.boxGroup = [this.box];

		/* ---------- CREATES PRESSURE PLATES -------- */
		// this.plate = new PressurePlate(this, 60, 250, 'pressurePlate');
		// this.plate.flipY = true

		/* --------- CREATES LEVERS ----------- */
		this.lever = new Lever(this, 170, 439, 'lever');
		// this.lever.angle = 90;
		// this.lever.flipX = true;

		/* ---------- KEYS FOR INTERACTING ---------- */
		this.switchFire = this.input.keyboard.addKey('one');
		this.switchAir = this.input.keyboard.addKey('two');
		this.switchEarth = this.input.keyboard.addKey('three');
		this.switchWater = this.input.keyboard.addKey('four');
		this.interact = this.input.keyboard.addKey('e');
		this.reset = this.input.keyboard.addKey('r');
		this.castSpell = this.input.keyboard.addKey('space');

	}	// ---------- END OF CREATE ---------- //

	update (time, delta) {

		/* ---------- RESETS LEVEL ---------- */
		if (this.resetLevel) {
			this.scene.start('s2r1')
		}

		/* ---------- STARTS NEXT LEVEL ---------- */
		if (this.nextLevel) {
			this.scene.start('Boot')
		}

		/* ---------- MOVES PLAYER ---------- */
		this.player.move(this);

		/*----------- ENEMY MOVEMENT -------------- */
		// for(var x in this.enemyGroup){
		// 	this.enemyGroup[x].move(this, this.player);
		// }

		/* ----------- PLAYER KILLERS ----------- */
		//this.physics.overlap(this.player, Object.values(this.enemyGroup), () => this.resetLevel = true);
		this.physics.overlap(this.player, this.door, () => this.nextLevel = true);
		this.physics.overlap(this.player, this.spikeGroup, () => this.resetLevel = true);

		/* ---------- CHECKS TO DEACTIVATE SPELLS ---------- */
		if (this.player.spellActive['fire']) {
			// this.player.fire.deactivate(this, this.enemyGroup);
			// for (let x in this.enemyGroup) {
			// 	this.physics.overlap(this.player.fire, this.enemyGroup[x], () => this.enemyGroup[x].deactivate(this, this.player.fire, x));
			// }
		}
		if (this.player.spellActive['water']) {
			// this.player.water.deactivate(this, this.enemyGroup);
			// for (let x in this.enemyGroup) {
			// 	this.physics.overlap(this.player.water, this.enemyGroup[x], () => this.enemyGroup[x].deactivate(this, this.player.water, x));
			// }
			if (this.boxGroup) {
				this.player.water.deactivate(this, this.boxGroup);
				for (let x in this.boxGroup) {
					this.physics.add.overlap(this.boxGroup[x], this.player.water, () => {
						this.player.water.suspend(this, this.boxGroup[x]);
					});
				}
			}
		}
		if (this.player.spellActive['air']) {
			// this.player.air.deactivate(this, this.enemyGroup);
			// for (let x in this.enemyGroup) {
			// 	this.physics.overlap(this.player.air, this.enemyGroup[x], () => this.enemyGroup[x].deactivate(this, this.player.air, x));
			// }
			if (this.rockGroup) {
				this.player.water.deactivate(this, this.RockGroup);
				for (let x in this.rockGroup) {
					this.physics.add.overlap(this.rockGroup[x], this.player.air, () => {
						this.player.air.push(this, this.rockGroup[x], this.player.direction);
					});
				}
			}
			if (this.boxGroup) {
				this.player.air.deactivate(this, this.boxGroup);
				for (let x in this.boxGroup) {
					this.physics.add.overlap(this.boxGroup[x], this.player.air, () => {
						this.player.air.push(this, this.boxGroup[x], this.player.direction);
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

		if (this.player.raisingEarth) {
			if (this.player.earthBox.body.height >= 117) {
				this.player.raisingEarth = false;
			}
			this.player.earthBox.body.height += 2.1;
			this.player.y -= 1;
			this.player.earthBox.body.offset.set(0, -this.player.earthBox.body.height);
		}

		/* ---------- PRESSURE PLATE INTERACTIONS ------- */
		// if (this.physics.overlap(this.enemyGroup, this.plate)) {
		// 	this.plate.trip(this, [this.platform]);
		// }
		// if (this.physics.overlap(this.player, this.plate)) {
		// 	this.plate.trip(this, [this.platform]);
		// }
		// if (!this.physics.overlap(this.player, this.plate)) {
		// 	this.plate.untrip(this, [this.platform]);
		// }
		// if (this.physics.overlap(this.boxGroup, this.plate)) {
		// 	this.plate.trip(this, [this.platform]);
		// }

		/* ----------- LEVER INTERACTIONS ------- */
		if (this.interact.isDown) {
			this.lever.flip(this, [this.platform]);
		}

	}	// ----- END OF UPDATE ----- //

}	// ----- END OF PHASER SCENE ----- //
