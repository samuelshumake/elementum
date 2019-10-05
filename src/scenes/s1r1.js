/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Player from '../sprites/Player.js';
import Enemy from '../sprites/Enemy.js';
import Spell from '../sprites/Spell.js';
import Platform from '../sprites/Platform.js';
import Interactable from '../sprites/Interactable.js';
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
		this.load.spritesheet('player', './assets/spriteSheets/idleFinal.png', {
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
		this.load.spritesheet('jumpPlayer', './assets/spriteSheets/jumpC.png',{
			frameHeight: 44,
			frameWidth:	 34
		});
		this.load.spritesheet('tempPlatform', './assets/spriteSheets/platformMove.png',{
			frameHeight: 32,
			frameWidth:	 96
		});


		/* ---------- LOADS SPRITES FOR SPELLS ---------- */
		this.load.image('fire', './assets/sprites/fireball.png');
		this.load.image('slime', './assets/sprites/slime.png');
		this.load.image('water', './assets/sprites/bubble.png')
		this.load.image('earth', './assets/sprites/ground2.png');
		this.load.image('air', './assets/sprites/airwave.png');

		/* ---------- LOADS SPRITES FOR SPELL FRAMES ---------- */
		this.load.image('airFrame', './assets/sprites/airFrame.png');
		this.load.image('bubbleFrame', './assets/sprites/bubbleFrame.png');
		this.load.image('fireFrame', './assets/sprites/fireFrame.png');
		this.load.image('earthFrame', './assets/sprites/earthFrame.png');


		/* ---------- LOADS LEVEL TILEMAP ---------- */
	    this.load.image("tiles", "./assets/map/tileset.png");
	    this.load.tilemapTiledJSON("map", "./assets/map/level.json");

	}	// ----- END OF PRELOAD ----- //


	create (data) {
	    ChangeScene.addSceneEventListeners(this);


		/* ---------- GLOBAL VARIABLES --------- */
		this.resetLevel = false
		this.gameWidth = this.cameras.main.width
		this.gameHeight = this.cameras.main.height


		// Array that keeps track of if a spell is active
		this.spellActive = {
			fire: false,
			earth: false,
			water: false,
			air: false
		}


		/* ---------- STAGE-ROOM DEBUGGER ---------- */
		this.posDebug = this.add.text(this.cameras.main.width - 175, 0, '');
		// var srDebug = this.add.text(0, 0, 'Stage 1, Room 1');

		/* ---------- CREATES SPELL FRAMES ---------- */
		this.fireFrame = this.add.sprite(32, 32, 'fireFrame');
		this.earthFrame = this.add.sprite(95, 32, 'earthFrame');
		this.bubbleFrame = this.add.sprite(158, 32, 'bubbleFrame');
		this.airFrame = this.add.sprite(221, 32, 'airFrame');
		this.fireFrame.setScale(2);
		this.earthFrame.setScale(2);
		this.bubbleFrame.setScale(2);
		this.airFrame.setScale(2);


		/* ---------- CREATES MAP ---------- */
		// Placeholder background color
		this.cameras.main.setBackgroundColor(0xb0d6c4);

		// Tileset art image taken from https://opengameart.org/content/platform-tileset-nature
	  	const map = this.make.tilemap({key: "map"});
	  	const tileset = map.addTilesetImage("tileset", "tiles");
	  	this.layer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
			this.layer.setCollisionByProperty({ collides: true });
			this.spikes = map.createStaticLayer('Spikes', tileset, 0, 630);
			var door = map.createDynamicLayer('Door', tileset);
			//console.log(door.properties);
			door.forEachTile(function(tile){
				console.log(tile.index);
				tile.destroy();
			});


			const debugGraphics = this.add.graphics().setAlpha(0.75);
			this.layer.renderDebug(debugGraphics, {
  		tileColor: null, // Color of non-colliding tiles
  		collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
  		faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
			});



		/* ---------- CREATES PLAYER ---------- */
		this.player = new Player(this, 30, 550, 'player');

		// Initializes spell cooldown timer
		this.spellTimer = 100;

		// Initializes jump cooldown timer
		this.jumpTimer = 100;

		/* ---------- CREATES ENEMIES ---------- */
		this.enemyGroup = [];
		for (let i = 0; i < 4; i++) {
			this.enemyGroup.push(new Enemy(this, 150 * i + 150, 300, 'slimeAni'));
		 }


		/* ----- CREATE PLATFORM SPRITES ------- */
		this.platform1 = new Platform(this, 500, 500, 'tempPlatform');

		/* ----- CREATE LEVER ------------------ */
		this.lever = new Interactable(this, 250,500, 'lever');
		this.lever2 = new Interactable(this, 350,400, 'lever');

		// Keys for interacting
		this.switchFire = this.input.keyboard.addKey('one');
	  this.switchEarth = this.input.keyboard.addKey('two');
	  this.switchWater = this.input.keyboard.addKey('three');
	  this.switchAir = this.input.keyboard.addKey('four');
		this.interact = this.input.keyboard.addKey('e');
		this.castSpell = this.input.keyboard.addKey('space');


		/* ----- CREATE SPIKES ----------------- */
		this.spikes = this.add.group({
			allowGravity: false,
			immovable: true
		});
		this.spikesArray = []
		const spikeObjects = map.getObjectLayer('Spikes')['objects'];
		spikeObjects.forEach(spikeObject => {
			const spike = this.spikes.create(spikeObject.x, spikeObject.y + 0 - spikeObject.height, 'Spikes').setOrigin(0,0);

		});


	}	// ----- END OF CREATE ----- //


	update (time, delta) {
		if (this.resetLevel) {
			this.scene.start('s1r1')
		}

		if (this.nextLevel) {
			this.scene.start('s1r2')
		}

		// Increments the spell cooldown timer
		this.spellTimer++;
		this.jumpTimer++;


		/* ---------- POSITION DEBUGGER ---------- */
		this.posDebug.setText(`Position: ${this.player.x-17}, ${-1*(this.player.y-568).toFixed(0)}`);

		/* ---------- SPELL FRAME CHECKER ---------- */
		switch (this.player.currentSpell) {
			case 'fire':
				this.fireFrame.alpha = 1;
				this.earthFrame.alpha = 0.2;
				this.bubbleFrame.alpha = 0.2;
				this.airFrame.alpha = 0.2;
				break;
			case 'earth':
				this.fireFrame.alpha = 0.2;
				this.earthFrame.alpha = 1;
				this.bubbleFrame.alpha = 0.2;
				this.airFrame.alpha = 0.2;
				break;
			case 'water':
				this.fireFrame.alpha = 0.2;
				this.earthFrame.alpha = 0.2;
				this.bubbleFrame.alpha = 1;
				this.airFrame.alpha = 0.2;
				break;
			case 'air':
				this.fireFrame.alpha = 0.2;
				this.earthFrame.alpha = 0.2;
				this.bubbleFrame.alpha = 0.2;
				this.airFrame.alpha = 1;
				break;
		}

		/* ---------- MOVES PLAYER ---------- */
		this.player.move(this);


		/*----------- Enemy AI -------------- */
		for(var x in this.enemyGroup){
			this.enemyGroup[x].move(this, this.player);
		}

		/* ----------- PLAYER KILLERS ----------- */
		//this.physics.overlap(this.player, this.spikes, () => this.resetLevel = true);
		this.physics.overlap(this.player, Object.values(this.enemyGroup), () => this.resetLevel = true);
		this.physics.overlap(this.player, this.spike, () => this.resetLevel = true);

		/*---------- PLATFORM MECHANICS ----*/


		/* ---------- CHECKS TO DEACTIVATE SPELLS ---------- */
		if (this.spellActive['fire']) {
			this.player.fireball.deactivate(this, this.enemyGroup);
		}
		if (this.spellActive['water']) {
			this.player.bubble.deactivate(this, this.enemyGroup);
		}
		if (this.spellActive['air']) {
			this.player.airwave.deactivate(this, this.enemyGroup);
		}

		/* ---------- CASTING SPELLS ---------- */
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
		if (this.castSpell.isDown && this.spellTimer > 100) {
			this.spellTimer = 0
			this.player.cast(this, this.player.currentSpell, this.player.flipX);
	 	}

		// Checks if player hits spikes
		this.physics.add.overlap(this.player, this.spikes, () => {console.log("reset");this.resetLevel = true});
		this.lever.flip(this, this.platform1,0);
		this.lever2.flip(this, this.platform1,1);
		//console.log(this.lever.body.touching)

    }	// ----- END OF UPDATE ----- //

}	// ----- END OF PHASER SCENE ----- //

function nextLevel() {
	this.scene.start('s1r2');
	return false;
}

function getClosestEnemy(spell, enemyGroup) {

	let closest = 10000;
	var closestEnemy;

	for (let i = 0; i < enemyGroup.length; i++) {
		let dx = spell.x - enemyGroup[i].x
		if (Math.sqrt(dx * dx) < closest) {
			closest = Math.max(spell.x, enemyGroup[i].x) - Math.min(spell.x, enemyGroup[i].x)
			closestEnemy = i
		}
	}

	return closestEnemy;
}
