/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
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


	    // Declare variables for center of the scene and player position
	    this.centerX = this.cameras.main.width / 2;
	    this.centerY = this.cameras.main.height / 2;
	}


	create (data) {
	    ChangeScene.addSceneEventListeners(this);


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


		/* ---------- CREATES PLAYER AND ENEMIES ---------- */
		// Adds character into the scene
		this.player = this.physics.add.sprite(10, 500, 'player');
		this.playerPos = [this.player.x-32, (-1*this.player.y-568).toFixed(0)];
		this.player.setCollideWorldBounds(true);
		this.player.setScale(2);
		this.player.setGravity(0, 800);

		// Add enemy group in
		this.enemyGroup = this.physics.add.group({
			key: 'enemy',
			repeat: 2,
			setXY: {
				x: 500,
				y: 500,
				stepX: 100
			},
		});
		// Modify the enemies
		this.enemyGroup.children.iterate( child => {
			child.setScale(2);
			child.setCollideWorldBounds(true);
			child.setGravity(0, 800);
		});


		/* ---------- CREATES LEVERS ---------- */
		this.lever = this.physics.add.sprite(100,500,'lever');
		this.lever.setScale(4);
		this.lever.setCollideWorldBounds(true);
		this.lever.setGravity(0, 1000);
		this.flipped = 0;
		this.physics.add.collider(this.player, this.lever);
		this.physics.add.collider(this.lever, layer);
		this.physics.add.collider(this.player, layer);


		/* ---------- CREATES SPELLS ---------- */
		// Adds fireballs and limits to 1 on screen
		this.fireballs = this.physics.add.group({
			defaultKey: 'fireball',
			maxSize: 1
		});
		// Adds bubbles and limits to 1 on screen
		this.bubbles = this.physics.add.group({
	      defaultKey: 'bubble',
	      maxSize: 1
		});
		// Adds earth platform and limits to 1 on screen
		this.platforms = this.physics.add.group({
			defaultKey: 'platform',
			maxSize: 1
		});
		// Adds air waves and limits to 1 on screen
		this.airwaves = this.physics.add.group({
			defaultKey: 'airwave',
			maxSize: 1
		});


		/* ---------- CREATES ANIMATIONS ---------- */
			/* ----- LEVER ----- */
		this.anims.create({
			key: "flipRight",
			frames: this.anims.generateFrameNumbers("lever", {start:0, end:3}),
			frameRate: 15,
			repeat: 0
		});
		this.anims.create({
			key: "flipLeft",
			frames: this.anims.generateFrameNumbers("leverBack", {start:0, end:3}),
			frameRate: 15,
			repeat: 0
		});
			/* ----- PLAYER ----- */
		this.anims.create({
			key: "run",
			frames: this.anims.generateFrameNumbers("run", {start:0, end:7}),
			frameRate: 15,
			repeat: 0
		});
		this.anims.create({
			key: "idle",
			frames: this.anims.generateFrameNumbers("player", {start:0, end:0}),
			frameRate: 15,
			repeat: 0
		});


		/* ---------- CREATES 'FIRE' KEYSTROKE ---------- */
		this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	}


	update (time, delta) {

		/* ---------- POSITION DEBUGGER ---------- */
		this.posDebug.setText(`Position: ${this.player.x-32}, ${-1*(this.player.y-568).toFixed(0)}`);


		/* ---------- CHECKS TO SEE IF AIR/FIRE/WATER SPELLS HAVE HIT ---------- */
		// Checks to see if fireballs have hit an enemy
		this.fireballs.children.each(
			(b) => {
				if (b.active) {
					this.physics.add.overlap(
						b,
						this.enemyGroup,
						this.hitEnemy,
						null,
						this
					);
					if (b.x < 0) {
						b.setActive(false);
					} else if (b.x > this.cameras.main.width) {
						b.setActive(false);
					}
				}
			});
		// Checks to see if bubbles have hit an enemy
		this.bubbles.children.each(
			(a) => {
				if (a.active) {
					this.physics.add.overlap(
						a,
						this.enemyGroup,
						this.suspendEnemy,
						null,
						this
					);
				if (a.x <0) {
					a.setActive(false);
				} else if (a.x > this.cameras.main.width) {
					a.setActive(false);
				}
			}
			}
		);
		// Checks to see if airwaves have hit an enemy
		this.airwaves.children.each(
			(b) => {
				if (b.active) {
					this.physics.add.overlap(
						b,
						this.enemyGroup,
						this.pushEnemy,
						null,
						this
					);
					if (b.x < 0) {
						b.setActive(false);
					} else if (b.x > this.cameras.main.width) {
						b.setActive(false);
					}
				}
			}
		);


		/* ---------- CASTING SPELLS ---------- */
		// Keys for shooting
		this.eKey = this.input.keyboard.addKey('E');
	    this.bKey = this.input.keyboard.addKey('B');
	    this.vKey = this.input.keyboard.addKey('V');
	    this.fKey = this.input.keyboard.addKey('F');

			/* ----- SHOOT FUNCTIONS ----- */
		// Air
		try {
			if (cursors.space.isDown) {
				this.shootAir(this.player, this.player.flipX);
			}
		} catch(err) {}

		// Water
		try {
			if (this.bKey.isDown) {
				this.shootWater(this.player, this.player.flipX);
			}
		} catch(err) {}

		// Fire
		try {
			if (this.fKey.isDown) {
				this.shootFire(this.player, this.player.flipX);
			}
		} catch(err) {}

		// Earth
		try {
			if (this.vKey.isDown) {
				this.raisePlatform(this.player);
			}
		} catch(err) {}

			/* ----- SPELL FUNCTIONS ----- */
		// Shooting fire
		this.shootFire = (player, direction) => {
			var fireball = this.fireballs.get();
			fireball
				.enableBody(true, player.x, player.y, true, true, true);

			// Checks to see which direction the fireball shoots
			switch (direction) {
				case true:
					fireball.setVelocityX(-600);
					break;
				case false:
					fireball.setVelocityX(600);
					break;
			}
		}
		// Shooting water
		this.shootWater = (player, direction) => {
			var bubble = this.bubbles.get();
			bubble
				.enableBody(true, player.x, player.y, true, true, true)

			// Check which direction the bubble shoots
			switch (direction){
				case true:
					bubble.setVelocityX(-600);
					break;
				case false:
					bubble.setVelocityX(600);
					break;
			}
		}
		// Shoots air
		this.shootAir = (player, direction) => {
			var airwave = this.airwaves.get();
			airwave
				.enableBody(true, player.x, player.y, true, true, true);

			// Checks to see which direction the fireball shoots
			switch (direction) {
				case true:
					airwave.setVelocityX(-600);
					break;
				case false:
					airwave.setVelocityX(600);
					break;
			}
		}
		// Raises earth
		this.raiseEarth = (player) => {
			var platform = this.platforms.get();
			platform
				.enableBody(true, player.x, player.y + 40, true, true, false);
			platform.setScale(1, 2);
			this.physics.add.collider(player, platform);
			platform.setImmovable(true);

			/* ----- ANIMATIONS ----- */
			// Platform
			this.tweens.add({
				targets: platform,
				x: player.x,
				y: 590,
				ease: 'Linear',
				duration: 200
			});
			// Player
			this.tweens.add({
				targets: player,
				y: 520,
				ease: 'Linear',
				duration: 160
			});
		}


		/* ---------- MOVEMENT FUNCTIONS ---------- */
		var cursors = this.input.keyboard.createCursorKeys();
		var speed = 5;

		// Give the player left and right movement
		if (cursors.left.isDown) {
			this.player.x -= speed;
			this.player.flipX = true;
			this.player.play("run",true);
		} else if (cursors.right.isDown) {
			this.player.x += speed;
			this.player.flipX = false
			this.player.play("run",true);
		} else {
			this.player.play("idle",true);
		}

		// Give the player jumping movement
		if (cursors.up.isDown && this.player.body.onFloor()){
			this.player.setVelocityY(-500);
			this.player.setAccelerationY(1500);
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
