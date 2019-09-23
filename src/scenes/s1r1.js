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
    // Preload assets
    this.load.spritesheet('player', './assets/spriteSheets/player.png', {
		frameHeight: 32,
		frameWidth: 32,
	});

	this.load.image('ground2', './assets/sprites/ground2.png');
	this.load.image('fireball', './assets/sprites/fireball.png');
	this.load.image('enemy', './assets/sprites/slime.png');
  this.load.spritesheet('lever', './assets/spriteSheets/lever.png',{
    frameHeight: 6,
    frameWidth: 9
  });

    // Declare variables for center of the scene and player position
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    ChangeScene.addSceneEventListeners(this);

	// Placeholder background color
	this.cameras.main.setBackgroundColor(0xb0d6c4);

	// // Creates the ground layer
	// var map = this.make.tilemap({ key: 'map' });
    // var tileset = map.addTilesetImage('kenney_redux_64x64');
    // var layer = map.createDynamicLayer(0, tileset, 0, 0);
	//
    // // Set up the layer to have matter bodies. Any colliding tiles will be given a Matter body.
    // map.setCollisionByProperty({ collides: true });
    // this.matter.world.convertTilemapLayer(layer);

	// Adds character into the scene
  // Add Level to Scene
  this.lever1 = this.physics.add.sprite(100,500,  'lever');
  this.lever1.setScale(4);
  this.lever1.setCollideWorldBounds(true);

	this.player = this.physics.add.sprite(10, 500, 'player');
	this.playerPos = [this.player.x-32, (-1*this.player.y-568).toFixed(0)];
	this.player.setCollideWorldBounds(true);
	this.player.setScale(2);

  //collisionn between
  this.physics.add.collider(this.player, this.lever);





	var fireball, fireballs, enemy, enemyGroup;
	this.nextFire = 0;
	this.fireRate = 200;
	this.bulletSpeed = 1000;

	// Add fireball group in
	this.fireballs = this.physics.add.group({
		defaultKey: 'fireball',
		maxSize: 100							// 100 fireballs maximum
	});

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
	this.enemyGroup.children.iterate( child => {
		child.setScale(2);
		child.setCollideWorldBounds(true);
	});


	// Shows Stage-Room number and player position for debugging purposes
	this.posDebug = this.add.text(this.cameras.main.width - 175, 0, '');
	var srDebug = this.add.text(0, 0, 'Stage 1, Room 1');

  //Animations
  this.anims.create({
    key: "flipRight",
    frames: this.anims.generateFrameNumbers("lever", {start:0, end:3}),
    frameRate: 15,
    repeat: 0
  });
  }

  update (time, delta) {

	  // Initialize movement variables
	  var cursors = this.input.keyboard.createCursorKeys();
    this.eKey = this.input.keyboard.addKey('E');
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

	  // TODO: Fix shooting mechanic
	  if (cursors.space.isDown) {
		  this.shoot()
	  }
    else{
      this.lever1.anims.play("flipRight",true)
    }



	  // Updates the player position debug text
	  this.posDebug.setText(`Position: ${this.player.x-32}, ${-1*(this.player.y-568).toFixed(0)}`);
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

  hitEnemy(fireball, enemy){
	  console.log('Hit!');
	  enemy.disableBody(true, true);
	  fireball.disableBody(true, true);

  }

}
