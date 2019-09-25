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
    // Load player sprite
    this.load.spritesheet('player', './assets/spriteSheets/player.png', {
		frameHeight: 32,
		frameWidth: 32,
	});

	// Load enemy and fireball sprite
	this.load.image('fireball', './assets/sprites/fireball.png');
	this.load.image('enemy', './assets/sprites/slime.png');
  this.load.spritesheet('lever', './assets/spriteSheets/lever.png',{
    frameHeight: 6,
    frameWidth: 9
  });
  this.load.spritesheet('leverBack', './assets/spriteSheets/leverBack.png',{
    frameHeight: 6,
    frameWidth: 9
  });
  this.load.image('bubble', './assets/sprites/bubble.png')
	this.load.image('platform', './assets/sprites/ground2.png');
	this.load.image('airwave', './assets/sprites/airwave.png');

    // Declare variables for center of the scene and player position
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    // Load level
    this.load.image("tiles", "./assets/map/Tiles_32x32.png");
    this.load.tilemapTiledJSON("map", "./assets/map/level.json");

  }


  create (data) {
    ChangeScene.addSceneEventListeners(this);
    const map = this.make.tilemap({key: "map"});
    // Tileset art image taken from https://opengameart.org/content/platform-tileset-nature
    const tileset = map.addTilesetImage("Tiles_32x32", "tiles");
    const layer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
    layer.setCollisionByProperty({ collides: true });

	// Shows Stage-Room number and player position for debugging purposes
	this.posDebug = this.add.text(this.cameras.main.width - 175, 0, '');
	var srDebug = this.add.text(0, 0, 'Stage 1, Room 1');

	// Placeholder background color
	this.cameras.main.setBackgroundColor(0xb0d6c4);

	// Adds character into the scene
  // Add Level to Scene
  this.lever = this.physics.add.sprite(100,500,  'lever');
  this.lever.setScale(4);
  this.lever.setCollideWorldBounds(true);
  this.lever.setGravity(0, 1000);
  this.flipped = 0;

	this.player = this.physics.add.sprite(10, 500, 'player');
	this.playerPos = [this.player.x-32, (-1*this.player.y-568).toFixed(0)];
	this.player.setCollideWorldBounds(true);
	this.player.setScale(2);
	this.player.setGravity(0, 800);

  //collisionn between
  this.physics.add.collider(this.player, this.lever);
  this.physics.add.collider(this.player, layer);





	var fireball, fireballs, enemy, enemyGroup, bubble, bubbles;
	this.nextFire = 0;
	this.fireRate = 200;
	this.bulletSpeed = 1000;

	// Add fireball group in
	this.fireballs = this.physics.add.group({
		defaultKey: 'fireball',
		maxSize: 100							// 100 fireballs maximum
	});

  this.bubble = this.physics.add.group({
    defaultKey: 'bubble',
    maxSize: 100
  })

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

	// Adds space key as "use spell"
	this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	// Adds fireballs and limits to 1 on screen
	this.fireballs = this.physics.add.group({
		defaultKey: 'fireball',
		maxSize: 1
	});

  //create bubble group and assign it a keyboard key
  //this.bKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
  this.bubbles = this.physics.add.group({
    defaultKey: 'bubble',
    maxSize: 1
  })

	// Adds earth platform and limits to 1 on screen
	this.platforms = this.physics.add.group({
		defaultKey: 'platform',
		maxSize: 1
	});

  //Animations
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

	// Adds air waves and limits to 1 on screen
	this.airwaves = this.physics.add.group({
		defaultKey: 'airwave',
		maxSize: 1
	});
  }


  update (time, delta) {

	  // Updates the player position debug text
	  this.posDebug.setText(`Position: ${this.player.x-32}, ${-1*(this.player.y-568).toFixed(0)}`);

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
		  }
	  );

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


	  // Initialize movement variables
	  var cursors = this.input.keyboard.createCursorKeys();
    this.eKey = this.input.keyboard.addKey('E');
    this.bKey = this.input.keyboard.addKey('B');
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

	  // Initialize movement variables
	  var cursors = this.input.keyboard.createCursorKeys();
	  var speed = 5;


	  // Give the player left and right movement
	  if (cursors.left.isDown) {
		  this.player.x -= speed;
		  this.player.flipX = true;
	  } else if (cursors.right.isDown) {
		  this.player.x += speed;
		  this.player.flipX = false
	  }

	  // Give the player jumping movement
	  if (cursors.up.isDown && this.player.body.onFloor()){
		  this.player.setVelocityY(-500);
		  this.player.setAccelerationY(1500);
	  }

	  // Makes the shoot function
	  this.shoot = (player, direction) => {

		// Initializes the fireball
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

    this.shootWater = function(player, direction){

      //Initialize shootWater
      var bubble = this.bubbles.get();
      bubble
        .enableBody(true,player.x,player.y, true, true, true)

      // Check which direction the fireball shoots
      switch (direction){
        case true:
          bubble.setVelocityX(-600);
          break;
        case false:
          bubble.setVelocityX(600);
          break;
      }
    }
	  // Activates air spell
	  this.shootAir = (player, direction) => {

		// Initializes the fireball
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

	  // Activates the earth spell Raise Platform
	  this.raisePlatform = (player) => {

		var platform = this.platforms.get();
		platform
			.enableBody(true, player.x, player.y + 40, true, true, false);
		platform.setScale(1, 2);
		this.physics.add.collider(player, platform);
		platform.setImmovable(true);
		this.tweens.add({
			targets: platform,
			x: player.x,
			y: 590,
			ease: 'Linear',
			duration: 200
		});

		this.tweens.add({
			targets: player,
			y: 520,
			ease: 'Linear',
			duration: 160
		});
	  }



	  // Try to shoot, if there's already an active fireball, an error will
	  // arise, in which case the catch block will just pass
	  try {
		  if (cursors.space.isDown) {
			  this.shootAir(this.player, this.player.flipX, this.shoot);
		  }
	  }
	  catch(err) {}

    try {
		  if (this.bKey.isDown) {
			  this.shootWater(this.player, this.player.flipX, this.shootWater);
		  }
	  }
	  catch(err) {}
    //lever mechanic
    //TODO: Lever gravity is too high rn
    if (this.eKey.isDown){
      this.physics.add.overlap(this.lever, this.player, this.pullLever,null, this);
    }
  }



	// Function for disabling an enemy when hit
	hitEnemy (fireball, enemy) {
		console.log('hit');
		enemy.disableBody(true, true);b
		fireball.disableBody(true, true);
	}


	// TODO: Fix shooting and hitEnemy mechanics
  shoot(pointer) {
	  console.log('Shoot!');
	  var velocity = Phaser.Math.Vector2();
	  var fireball = this.fireballs.get();
	  fireball.setGravity(0, -800);
	  fireball
	  	.enableBody(true, this.player.x, this.player.y, true, true)
		.setAngle(180)
		.setVelocityX(500);
  }
  shootWater(pointer){
    console.log('ShootWater!');
	  var velocity = Phaser.Math.Vector2();
	  var bubble = this.bubbles.get();
	  bubble.setGravity(0, -800);
	  bubble
	  	.enableBody(true, this.player.x, this.player.y, true, true)
		.setAngle(180)
		.setVelocityX(500);
  }

	// TODO: Wait for tiles then use collideSpriteVsTilemapLayer
	pushEnemy (airwave, enemy) {
		if (airwave.x < enemy.x) {
			enemy.setVelocityX(300);
		} else {
			enemy.setVelocityX(-300);
		}
		airwave.disableBody(true, true);

  }

  suspendEnemy(bubble, enemy){
    console.log('suspend!');
    enemy.y -= 100
    enemy.setGravity(0, 0)
    bubble.disableBody(true, true);
  }

  pullLever(){
    if (this.eKey.isDown){
      if(this.flipped == 0){
        this.lever.anims.play("flipRight",true);
        this.flipped = 1;
      }
    }
  }

}
