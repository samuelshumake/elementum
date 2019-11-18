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
export default class SpellDisplay extends Phaser.Scene {

	constructor () {
		super('SpellDisplay');
	}

	init (data) {
		// Initialization code goes here
	}

	preload () {
		/* ---------- LOADS SPRITE SHEETS ---------- */
		this.load.spritesheet('player', './assets/spriteSheets/idleFinal.png', {
			frameHeight: 39,
			frameWidth: 32,
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
			frameWidth: 32,
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
		this.load.image('tiles', './assets/images/tilemapv2.png');
		this.load.tilemapTiledJSON('display', './assets/map/display.json')

		/* ---------- LOADS SPRITES FOR GAME OBJECTS ---------- */
		this.load.image('platform', './assets/sprites/platform.png');
		this.load.image('spike', './assets/sprites/spike.png');
		this.load.image('rock', './assets/sprites/rock.png');
		this.load.image('box', './assets/sprites/box.png');
		this.load.image('cameraFrame', './assets/sprites/cameraFrame.png');

	}	// ---------- END OF PRELOAD ---------- //

	create (data) {
		ChangeScene.addSceneEventListeners(this);

		// Spell tutorial background loading
		const map = this.make.tilemap({key: 'display'});
		const tileset = map.addTilesetImage('tilemapv2', 'tiles');
		this.layer = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
		this.layer2 = map.createStaticLayer('Tile Layer 2', tileset, 0, 0);
		this.layer.setCollisionByProperty({ collides: true });

		// Create main text
		// var spellText = this.add.text(280, 50, 'SPELLS', {fontSize: 70, color: '#fff'})
		// var fireText = this.add.text(220, 180, 'Fire', {fontSize: 45, color: '#dc143c'});
		// var earthText = this.add.text(460, 180, 'Earth', {fontSize: 45, color: '#679c4d'});
		// var waterText = this.add.text(15, 505, 'Water', {fontSize: 45, color: '#87ceeb'});
		// var airText = this.add.text(680, 505, 'Air', {fontSize: 45, color: '#ffffff'});
		//
		// // Create back button
		// var backButton = this.add.text(50, 50, 'Back', {fontSize: 40, color: '#000000', backgroundColor: '#fff'}).setInteractive();
		// backButton.on('pointerdown', () => this.scene.start('Boot'));

		this.centerScreen = this.physics.add.sprite(400, 430, '1');

		this.player1 = new Player(this, 300, 300, 'player').setScale(1.5);
		this.player2 = new Player(this, 445, 483, 'player').setScale(1.5);
		this.player3 = new Player(this, 355, 292, 'player').setScale(1.5);
		this.player4 = new Player(this, 355, 483, 'player').setScale(1.5);
		this.player3.flipX = true;
		this.player4.flipX = true;

		this.enemy = new Enemy(this, 200, 305, 'slimeAni').setScale(2);
		this.box = new Box(this, 200, 485, 'box').setScale(1.5);
		this.rock = new Rock(this, 600, 465, 'rock').setScale(1.5);

		let camera = this.cameras.main;
		camera.setBounds(0, 0, 800, 640);
		camera.startFollow(this.player1);
		camera.setZoom(2);

		this.spellTimer = 0;
		this.firstTime = true;
	}

	update (time, delta) {
		this.spellTimer++;

		if (this.spellTimer === 150 && !this.firstTime) {
			this.enemy = new Enemy(this, 200, 305, 'slimeAni').setScale(2);
			this.rock = new Rock(this, 600, 465, 'rock').setScale(1.5);
			this.player1.cast(this, 'earth', this.player1.flipX);
		}

		if (this.spellTimer >= 300) {
			this.player1.cast(this, 'earth', this.player1.flipX);
			this.player2.cast(this, 'air', this.player2.flipX);
			this.player3.cast(this, 'fire', this.player3.flipX);
			this.player4.cast(this, 'water', this.player4.flipX);
			this.spellTimer = 0;
			this.firstTime = false;
		}

		this.physics.add.overlap(this.rock, this.player2.air, () => {
			this.player2.spellActive['air'] = false;
			this.player2.air.destroy();
			this.player2.air.push(this, this.rock, this.player2.direction);
		});

		this.physics.add.overlap(this.box, this.player4.water, () => {
			this.player4.spellActive['water'] = false;
			this.player4.water.destroy();
			this.player4.water.suspend(this, this.box, this.player4.direction);
		});

		this.physics.add.overlap(this.enemy, this.player3.fire, () => {
			this.player3.spellActive['fire'] = false;
			this.player3.fire.destroy();
			this.enemy.destroy();
		});

		if (this.player1.raisingEarth) {
			if (this.player1.earthBox.body.height >= 117) {
				this.player1.raisingEarth = false;
			}
			this.player1.earthBox.body.height += 2.1;
			this.player1.y -= 1;
			this.player1.earthBox.body.offset.set(0, -this.player1.earthBox.body.height);
		}

	}

}
