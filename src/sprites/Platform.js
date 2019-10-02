export default class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
	    scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);

		scene.physics.world.enableBody(this, 0);
	    scene.physics.add.collider(this, scene.player);

	    this.body.immovable = true
		this.setScale(1);

	    scene.anims.create({
	      key: "platformR",
	      frames: scene.anims.generateFrameNumbers("tempPlatform", {start:0, end:0}),
	      frameRate: 15,
	      repeat: 0
	    });
	    scene.anims.create({
	      key: "platformL",
	      frames: scene.anims.generateFrameNumbers("tempPlatform", {start:1, end:1}),
	      frameRate: 15,
	      repeat: 0
	    });
	    scene.anims.create({
	      key: "platformU",
	      frames: scene.anims.generateFrameNumbers("tempPlatform", {start:2, end:2}),
	      frameRate: 15,
	      repeat: 0
	    });
	    scene.anims.create({
	      key: "platformD",
	      frames: scene.anims.generateFrameNumbers("tempPlatform", {start:3, end:3}),
	      frameRate: 15,
	      repeat: 0
	    });

  }

  moveRight(){

  }

  moveLeft(){

  }

  moveUp(){

  }

  moveDown(){

  }

}
