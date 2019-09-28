/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Player from '../sprites/Player.js';
import Spell from '../sprites/Spell.js';

export default class s1r1 extends Phaser.Scene {
	constructor () {
		super('s1r1');
	}


	init (data) {
		// Initialization code goes here
	}


	preload () {

		/* ---------- LOADS SPRITE SHEETS ---------- */
	    // Load sprite sheets
		this.load.spritesheet('player', './assets/spriteSheets/idleSprite.png', {
			frameHeight: 39,
			frameWidth: 34,
		});
		this.load.spritesheet('lever', './assets/spriteSheets/lever.png',{
			frameHeight: 6,
			frameWidth: 9
	    });
		this.load.spritesheet('leverBack', './assets/spriteSheets/leverBack.png',{
			frameHeight: 6,
			frameWidth: 9
	    });
		this.load.spritesheet('run', './assets/spriteSheets/run sprite.png',{
			frameHeight: 39,
			frameWidth: 34
	    });


		/* ---------- LOADS SPRITES FOR SPELLS ---------- */
		this.load.image('fireball', './assets/sprites/fireball.png');
		this.load.image('enemy', './assets/sprites/slime.png');
		this.load.image('bubble', './assets/sprites/bubble.png')
		this.load.image('platform', './assets/sprites/ground2.png');
		this.load.image('airwave', './assets/sprites/airwave.png');


		/* ---------- LOADS LEVEL TILEMAP ---------- */
	    this.load.image("tiles", "./assets/map/Tiles_32x32.png");
	    this.load.tilemapTiledJSON("map", "./assets/map/level.json");

	}


	create (data) {
	    ChangeScene.addSceneEventListeners(this);
		
		this.spellActive = {
			fire: false,
			earth: false,
			water: false,
			air: false
		}

		/* ---------- STAGE-ROOM DEBUGGER ---------- */
		this.posDebug = this.add.text(this.cameras.main.width - 175, 0, '');
		var srDebug = this.add.text(0, 0, 'Stage 1, Room 1');

		/* ---------- CREATES MAP ---------- */
		// Placeholder background color
		this.cameras.main.setBackgroundColor(0xb0d6c4);

		// Tileset art image taken from https://opengameart.org/content/platform-tileset-nature
	    const map = this.make.tilemap({key: "map"});
	    const tileset = map.addTilesetImage("Tiles_32x32", "tiles");
	    const layer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
	    layer.setCollisionByProperty({ collides: true });


		/* ---------- CREATES PLAYER ---------- */
		this.player = new Player(this, 10, 500, 'player');
		this.physics.add.collider(this.player, layer);


		/* ---------- CREATES ANIMATIONS ---------- */
			/* ----- LEVER ----- */
		// this.anims.create({
		// 	key: "flipRight",
		// 	frames: this.anims.generateFrameNumbers("lever", {start:0, end:3}),
		// 	frameRate: 15,
		// 	repeat: 0
		// });
		// this.anims.create({
		// 	key: "flipLeft",
		// 	frames: this.anims.generateFrameNumbers("leverBack", {start:0, end:3}),
		// 	frameRate: 15,
		// 	repeat: 0
		// });
		// 	/* ----- PLAYER ----- */
		// this.anims.create({
		// 	key: "run",
		// 	frames: this.anims.generateFrameNumbers("run", {start:0, end:7}),
		// 	frameRate: 15,
		// 	repeat: 0
		// });
		// this.anims.create({
		// 	key: "idle",
		// 	frames: this.anims.generateFrameNumbers("player", {start:0, end:0}),
		// 	frameRate: 15,
		// 	repeat: 0
		// });


	}


	update (time, delta) {

		/* ---------- POSITION DEBUGGER ---------- */
		this.posDebug.setText(`Position: ${this.player.x-32}, ${-1*(this.player.y-568).toFixed(0)}`);

		this.player.move();


		if (this.spellActive['fire']) {
			if (this.player.fireball.x < 0 || this.player.fireball.x > this.cameras.main.width) {
				this.player.fireball.destroy();
				this.spellActive['fire'] = false
			}
		}
		if (this.spellActive['water']) {
			if (this.player.bubble.x < 0 || this.player.bubble.x > this.cameras.main.width) {
				this.player.bubble.destroy();
				this.spellActive['water'] = false;
			}
		}
		if (this.spellActive['air']) {
			if (this.player.airWave.x < 0 || this.player.airWave.x > this.cameras.main.width) {
				this.player.airWave.destroy();
				this.spellActive['air'] = false;
			}
		}


		/* ---------- CASTING SPELLS ---------- */
		// Keys for shooting
		this.switchFire = this.input.keyboard.addKey('one');
	    this.switchEarth = this.input.keyboard.addKey('two');
	    this.switchWater = this.input.keyboard.addKey('three');
	    this.switchAir = this.input.keyboard.addKey('four');
		this.castSpell = this.input.keyboard.addKey('space');

		if (this.switchFire.isDown) {
			this.player.currentSpell = 'fire';
		} else if (this.switchEarth.isDown) {
			this.player.currentSpell = 'earth';
		} else if (this.switchWater.isDown) {
			this.player.currentSpell = 'water';
		} else if (this.switchAir.isDown) {
			this.player.currentSpell = 'air';
		}

		if (this.castSpell.isDown) {
			this.player.cast(this, this.player.currentSpell, this.player.flipX);
	 	}



    }

	/* ---------- SPELL EFFECT ---------- */
	// Hit with fire
	hitEnemy (fireball, enemy) {
		enemy.disableBody(true, true);
		fireball.disableBody(true, true);
	}
	// Hit with air
	pushEnemy (airwave, enemy) {
		if (airwave.x < enemy.x) {
			enemy.setVelocityX(300);
		} else {
			enemy.setVelocityX(-300);
		}
		airwave.disableBody(true, true);
	}
	// Hit with water
	suspendEnemy(bubble, enemy){
		enemy.y -= 100
		enemy.setGravity(0, 0)
		bubble.disableBody(true, true);
	}
	// Pull lever
	pullLever(){
		if (this.eKey.isDown){
			if(this.flipped == 0){
				this.lever.anims.play("flipRight",true);
				this.flipped = 1;
			}
		}
	}

}
