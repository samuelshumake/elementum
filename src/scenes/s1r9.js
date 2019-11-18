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
export default class s1r9 extends Phaser.Scene {

	constructor () {
		super('s1r9');
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
		this.load.spritesheet('gui','./assets/spriteSheets/gui.png',{
			frameHeight: 32,
			frameWidth: 32
		});

		/* ---------- LOADS LEVEL TILEMAP ---------- */
		this.load.image('tiles', './assets/images/tilemapv3.png');
		this.load.tilemapTiledJSON('s1r9', './assets/map/s1r9.json')

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
		this.resetLevel = false;
		this.gameWidth = this.cameras.main.width;
		this.gameHeight = this.cameras.main.height;

		/* ---------- CREATES MAP ---------- */
		const map = this.make.tilemap({key: "s1r9"});
		const tileset = map.addTilesetImage("tilemapv3", "tiles");
		this.layer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
		this.layer.setCollisionByProperty({ collides: true });
		this.layer2 = map.createStaticLayer("Foreground", tileset, 0,0);
		this.layer3 = map.createStaticLayer("Vines", tileset, 0,0);

		/* ---------- CREATES PLAYER ---------- */
		this.player = new Player(this, 650	, 200, 'player');

		/* ---------- ADJUSTS CAMERA ---------- */
		let camera = this.cameras.main;
		camera.setZoom(2);
		camera.startFollow(this.player, true, 0.1);
		camera.setBounds(0, 0, 800, 640);

		/* ---------- CREATES DOOR ---------- */
		this.door = this.physics.add.sprite(754, 576);

		/* ------ CREATE SPIKES ---------------- */
		this.spikeGroup = [];
		for (let i = 0; i <= 0; i++) {
			this.spikeGroup.push(this.physics.add.sprite(16*i + 2010, 540, 'spike').setScale(0.3))
		}

		/* ---------- CREATES BOX ---------- */
		this.rock = new Rock(this, 6200, 195, 'rock');
		this.rockGroup = [this.rock];

		// /* ---------- CREATES ENEMIES ---------- */
		this.enemy1 = new Enemy(this, 600, 455, 'slimeAni');
		this.enemy2 = new Enemy(this, 60, 250, 'slimeAni');
		this.enemyGroup = [this.enemy1, this.enemy2];

		/* ---------- CREATES PLATFORMS ---------- */
		this.platform1 = new Platform(this, 365, 4800, 'platform');
		this.platform1.options = ['right', 500, this.platform1, 0.8, 3000];
		this.platform2 = new Platform(this, 120, 5600, 'platform');
		this.platform2.options = ['left', 200, this.platform2, 1, 2000];
		this.platform2.flipX = true;

		this.physics.add.collider(this.enemyGroup, this.platform1);
		this.physics.add.collider(this.enemyGroup, this.platform2);
		this.physics.add.collider(this.platform1,this.rock);
		this.physics.add.collider(this.enemyGroup, this.rock);

		this.lever1 = new Lever(this, 48, 4980, 'lever');
		this.lever2 = new Lever(this, 270, 3750, 'lever');

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
			this.scene.start('s1r9')
		}

		/* ---------- STARTS NEXT LEVEL ---------- */
		if (this.nextLevel) {
			this.scene.start('s1r10');
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
			this.player.fire.deactivate(this, this.enemyGroup);
			for (let x in this.enemyGroup) {
				this.physics.overlap(this.player.fire, this.enemyGroup[x], () => this.enemyGroup[x].deactivate(this, this.player.fire, x));
			}
		}
		if (this.player.spellActive['water']) {
			this.player.water.deactivate(this, this.enemyGroup);
			for (let x in this.enemyGroup) {
				this.physics.overlap(this.player.water, this.enemyGroup[x], () => this.enemyGroup[x].deactivate(this, this.player.water, x));
			}
			if (this.boxGroup) {
				for (let x in this.boxGroup) {
					this.physics.add.overlap(this.boxGroup[x], this.player.water, () => {
						this.player.water.suspend(this, this.boxGroup[x]);
					});
				}
			}
		}
		if (this.player.spellActive['air']) {
			this.player.air.deactivate(this, this.enemyGroup);
			for (let x in this.enemyGroup) {
				this.physics.overlap(this.player.air, this.enemyGroup[x], () => this.enemyGroup[x].deactivate(this, this.player.air, x));
			}
			if (this.rockGroup) {
				for (let x in this.rockGroup) {
					this.physics.add.overlap(this.rockGroup[x], this.player.air, () => {
						this.player.air.push(this, this.rockGroup[x], this.player.direction);
					});
				}
			}
			if (this.boxGroup) {
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

		if (this.interact.isDown) {
			this.lever1.flip(this, [this.platform1]);
			this.lever2.flip(this, [this.platform1]);
		}
	}	// ----- END OF UPDATE ----- //

}	// ----- END OF PHASER SCENE ----- //
