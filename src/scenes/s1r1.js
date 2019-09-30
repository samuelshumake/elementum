/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Player from '../sprites/Player.js';
import Enemy from '../sprites/Enemy.js';
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
		this.load.spritesheet('slimeAni', './assets/spriteSheets/slimesprite.png',{
			frameHeight: 14,
			frameWidth:	 21
		});


		/* ---------- LOADS SPRITES FOR SPELLS ---------- */
		this.load.image('fireball', './assets/sprites/fireball.png');
		this.load.image('slime', './assets/sprites/slime.png');
		this.load.image('bubble', './assets/sprites/bubble.png')
		this.load.image('platform', './assets/sprites/ground2.png');
		this.load.image('airwave', './assets/sprites/airwave.png');


		/* ---------- LOADS LEVEL TILEMAP ---------- */
	    this.load.image("tiles", "./assets/map/tileset.png");
	    this.load.tilemapTiledJSON("map", "./assets/map/level.json");

	}	// ----- END OF PRELOAD ----- //


	create (data) {
	    ChangeScene.addSceneEventListeners(this);

		// Initializes spell cooldown timer
		this.spellTimer = 0;

		// Array that keeps track of if a spell is active
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
	    const tileset = map.addTilesetImage("tileset", "tiles");
	    this.layer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
		this.layer.setCollisionByProperty({ collides: true });
		this.spikes = map.createStaticLayer('spikes', tileset, 0, 630);


		/* ---------- CREATES PLAYER ---------- */
		this.player = new Player(this, 30, 550, 'player');


		/* ---------- CREATES ENEMIES ---------- */
		this.enemyGroup = [];
		for (let i = 0; i < 4; i++) {
			this.enemyGroup.push(new Enemy(this, 150 * i + 150, 500, 'slimeAni'));

		}
		/* ---------- GLOBAL VARIABLES --------- */
		this.RESET_LEVEL = false

	}	// ----- END OF CREATE ----- //


	update (time, delta) {
		// Increments the spell cooldown timer
		this.spellTimer++;

		/* ---------- POSITION DEBUGGER ---------- */
		this.posDebug.setText(`Position: ${this.player.x-32}, ${-1*(this.player.y-568).toFixed(0)}`);


		/* ---------- MOVES PLAYER ---------- */
		this.player.move(); // See: Player.js

		/*----------- Enemy AI -------------- */
		for(var x in this.enemyGroup){
			this.enemyGroup[x].move(this.player);
		}

		/* ----------- SPIKES ----------- */
		if (this.player.y >= 620 || (this.player.y > 550 && this.player.x > 550)) {
			console.log("dead");
			this.scene.start("s1r1");
			return;
		};
		/* ----------- RESET SCENE -------*/

		if (this.physics.overlap(Object.values(this.enemyGroup), this.player)){
			console.log("restart");
			this.scene.start("s1r1");
			return;
		}


		/* ---------- CHECKS TO DEACTIVATE SPELLS ---------- */
		if (this.spellActive['fire']) {
			if (this.player.fireball.x < 0 || this.player.fireball.x > this.cameras.main.width) {
				this.player.fireball.destroy();
				this.spellActive['fire'] = false;
			}
			if (this.physics.overlap(Object.values(this.enemyGroup), this.player.fireball)) {
				var closestInd = getClosestEnemy(this.player.fireball, this.enemyGroup);
				this.player.fireball.destroy()
				this.spellActive['fire'] = false;
				this.enemyGroup[closestInd].destroy();
				this.enemyGroup.splice(closestInd,1);
			}
		}

		if (this.spellActive['water']) {
			if (this.player.bubble.x < 0 || this.player.bubble.x > this.cameras.main.width) {
				this.player.bubble.destroy();
				this.spellActive['water'] = false;
			}
			if (this.physics.overlap(Object.values(this.enemyGroup), this.player.bubble)) {
				var closestInd = getClosestEnemy(this.player.bubble, this.enemyGroup);
				this.player.bubble.suspend(this, this.enemyGroup[closestInd])
				this.player.bubble.destroy();
				this.spellActive['water'] = false;
			}
		}

		if (this.spellActive['air']) {
			if (this.player.airWave.x < 0 || this.player.airWave.x > this.cameras.main.width) {
				this.player.airWave.destroy();
				this.spellActive['air'] = false;
			}
			if (this.physics.overlap(Object.values(this.enemyGroup), this.player.airWave)) {
				var closestInd = getClosestEnemy(this.player.airWave, this.enemyGroup);
				this.player.airWave.push(this, this.enemyGroup[closestInd], this.player.direction);
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

		// Switches current spell
		if (this.switchFire.isDown) {
			this.player.currentSpell = 'fire';
		} else if (this.switchEarth.isDown) {
			this.player.currentSpell = 'earth';
		} else if (this.switchWater.isDown) {
			this.player.currentSpell = 'water';
		} else if (this.switchAir.isDown) {
			this.player.currentSpell = 'air';
		}

		// Casts spell if cooldown timer has been met
		if (this.castSpell.isDown && this.spellTimer > 50) {
			this.spellTimer = 0
			this.player.cast(this, this.player.currentSpell, this.player.flipX);
	 	}

		this.physics.add.overlap(this.player, this.spikes, () => {this.scene.restart()});


    }	// ----- END OF UPDATE ----- //

}	// ----- END OF PHASER SCENE ----- //




function getClosestEnemy(spell, enemyGroup) {

	let closest = 10000;
	var closestEnemy;

	for (let i = 0; i < enemyGroup.length; i++) {
		if (Math.max(spell.x, enemyGroup[i].x) - Math.min(spell.x, enemyGroup[i].x) < closest) {
			closest = Math.max(spell.x, enemyGroup[i].x) - Math.min(spell.x, enemyGroup[i].x)
			closestEnemy = i
		}
	}

	return closestEnemy;
}
