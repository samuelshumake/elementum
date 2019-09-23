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

    // Declare variables for center of the scene and player position
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }


  create (data) {
    ChangeScene.addSceneEventListeners(this);

	// Shows Stage-Room number and player position for debugging purposes
	this.posDebug = this.add.text(this.cameras.main.width - 175, 0, '');
	var srDebug = this.add.text(0, 0, 'Stage 1, Room 1');

	// Placeholder background color
	this.cameras.main.setBackgroundColor(0xb0d6c4);

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

	this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	this.fireballs = this.physics.add.group({
		defaultKey: 'fireball',
		maxSize: 1
	});
  }


  update (time, delta) {

	  // Updates the player position debug text
	  this.posDebug.setText(`Position: ${this.player.x-32}, ${-1*(this.player.y-568).toFixed(0)}`);


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
	  if (cursors.up.isDown && this.player.body.onFloor()) {
		  this.player.setVelocityY(-500);
		  this.player.setAccelerationY(1500);
	  }

	  // Makes the shoot function
	  this.shoot = function(player, direction){

		// Initializes the fireball
	  	var fireball = this.fireballs.get();
    	fireball
    		.enableBody(true, player.x, player.y, true, true, true)

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

	  // Try to shoot, if there's already an active fireball, an error will
	  // arise, in which case the catch block will just pass
	  try {
		  if (cursors.space.isDown) {
			  this.shoot(this.player, this.player.flipX, this.shoot);
		  }
	  }

	  catch(err) {}

  }


	// Function for disabling an enemy when hit
	hitEnemy (fireball, enemy) {
		console.log('hit');
		enemy.disableBody(true, true);
		fireball.disableBody(true, true);
	}

}
