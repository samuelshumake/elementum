/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
import Player from '../sprites/Player.js';
import Enemy from '../sprites/Enemy.js';
import Spell from '../sprites/Spell.js';
import Platform from '../sprites/Platform.js';
import Interactable from '../sprites/Interactable.js';
export default class s0r2 extends Phaser.Scene {

	constructor () {
		super('s0r2');
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
		this.load.spritesheet('run', './assets/spriteSheets/runPlayer.png',{
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
		this.load.spritesheet('walkPlayer', './assets/spriteSheets/walkspritesheet.png',{
			frameHeight:44,
			frameWidth: 34
		});
		this.load.spritesheet('tempPlatform', './assets/spriteSheets/platformMove.png',{
			frameHeight: 32,
			frameWidth:	 96
		});
		this.load.spritesheet('tank', './assets/spriteSheets/tank.png', {
			frameHeight: 39,
			frameWidth: 34,
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

		/* ---------- LOADS BACKGROUND -----------------------*/
		this.load.image('background', './assets/images/backgroundimage1.png');
		this.load.image('topbanner', './assets/images/topbanner.png');
		this.load.image('textBanner', './assets/images/textBackground.png');

		/* ---------- LOADS LEVEL TILEMAP ---------- */
		this.load.image('tiles', './assets/images/newTileMap.png');
		this.load.tilemapTiledJSON('tutorial_1', './assets/map/tutorial_1.json')
		this.load.tilemapTiledJSON('map', './assets/map/level.json');

		/* ---------- LOADS SPRITES FOR SPELL FRAMES ---------- */
		this.load.image('airFrame', './assets/sprites/airFrame.png');
		this.load.image('bubbleFrame', './assets/sprites/bubbleFrame.png');
		this.load.image('fireFrame', './assets/sprites/fireFrame.png');
		this.load.image('earthFrame', './assets/sprites/earthFrame.png');

		/* ---------- LOADS SPRITES FOR GAME OBJECTS ---------- */
		this.load.image('spike', './assets/sprites/spike.png');
		this.load.image('rock', './assets/sprites/rock.png');
		this.load.image('door', './assets/sprites/door.png');

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
		const map = this.make.tilemap({key: 'tutorial_earth'});
		const tileset = map.addTilesetImage('newTileMap', 'tiles');
		this.layer = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
		this.layer.setCollisionByProperty({ collides: true });


		/* ---------- TOP BANNER ---------- */
		this.add.image(350, 35,'topbanner').setScale(15, 1.7);

		/* ---------- CREATES MANA BAR ---------- */
		this.manaBar = this.add.sprite(this.cameras.main.width - 50, 40, 'manaBar', 27);
		this.anims.create({
			key: "regenMana",
			frames: this.anims.generateFrameNumbers("manaBar", {start: 0, end: 27}),
			frameRate: 24,
		});

		this.add.image(425, 170,'textBanner').setScale(10.5, 1.9);
		this.tutorialText = this.add.text(125, 150, 'Press 1, 2, 3, and 4 to cycle through spells and space to cast.');
		this.tutorialText = this.add.text(175, 175, 'Try using the Earth spell to overcome tall obstacles.');


		/* ---------- CREATES SPELL FRAMES ---------- */
		this.fireFrame = this.add.sprite(48, 40, 'fireFrame');
		this.earthFrame = this.add.sprite(111, 40, 'earthFrame');
		this.bubbleFrame = this.add.sprite(174, 40, 'bubbleFrame');
		this.airFrame = this.add.sprite(237, 40, 'airFrame');


		/* ---------- CREATES PLAYER ---------- */
		this.player = new Player(this, 50, 524, 'player');

		/* ---------- CREATES DOOR ---------- */
		this.door = this.physics.add.sprite(755, 320, 'door');


		/* ---------- CREATES KEYS FOR INTERACTING ---------- */
		// Keys for interacting
		this.switchFire = this.input.keyboard.addKey('one');
		this.switchEarth = this.input.keyboard.addKey('two');
		this.switchWater = this.input.keyboard.addKey('three');
		this.switchAir = this.input.keyboard.addKey('four');
		this.interact = this.input.keyboard.addKey('e');
		this.castSpell = this.input.keyboard.addKey('space');

	}	// ---------- END OF CREATE ---------- //


	update (time, delta) {

		/* ---------- RESETS LEVEL ---------- */
		if (this.resetLevel) {
			this.scene.start('s0r2')
		}

		/* ---------- STARTS NEXT LEVEL ---------- */
		if (this.nextLevel) {
			this.scene.start('s0r3')
		}


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


		this.physics.overlap(this.player, this.door, () => this.nextLevel = true);

		/* ---------- CHECKS TO DEACTIVATE SPELLS ---------- */
		if (this.player.spellActive['fire']) {
			this.player.fireball.deactivate(this, this.enemyGroup);
		}
		if (this.player.spellActive['water']) {
			this.player.bubble.deactivate(this, this.enemyGroup);
			this.physics.add.overlap(this.rock, this.player.bubble, () => {
				this.player.bubble.suspend(this, this.rock);
			})
		}
		if (this.player.spellActive['air']) {
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
		if (this.castSpell.isDown && this.player.spellTimer > 70 ) {
			this.player.cast(this, this.player.currentSpell, this.player.flipX);
			this.manaBar.play('regenMana', true);
	 	}

    }	// ----- END OF UPDATE ----- //

}	// ----- END OF PHASER SCENE ----- //
