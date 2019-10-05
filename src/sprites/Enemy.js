export default class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);

		scene.physics.world.enableBody(this, 0);
		this.body.setCollideWorldBounds(true);
		scene.physics.add.collider(this, scene.layer);
		this.body.setCollideWorldBounds(true);
		this.body.setGravity(0, 600);
		this.setScale(1);

		/* -------------ANIMATION CREATION---------- */
		scene.anims.create({
			key: "jump",
			frames: scene.anims.generateFrameNumbers("slimeAni", {start:0, end:10}),
			frameRate: 15,
			repeat: 0
		});

		this.canMove = true;
		this.moveTimer = Math.floor(Math.random() * 10)

	}

	/* ---------- MOVEMENT FUNCTIONS ---------- */
	move(scene, player) {
		this.moveTimer++;

		if (this.body.blocked.down === false) {
			this.canMove = false;
		} else {
			this.canMove = true;
		}


		var dx = Math.sqrt(Math.pow(player.x - this.body.x, 2));
		var dy = Math.sqrt(Math.pow(player.y - this.body.y, 2));

		if (this.canMove && dx <= 200 && dy < 50) {
			if (this.body.x < player.x) {
				this.body.setVelocityX(40)
			} else {
				this.body.setVelocityX(-40)
			}
		} else {
			if (this.canMove && this.moveTimer < 250) {
				this.body.setVelocityX(20);
			} else if (this.canMove && this.moveTimer < 500) {
				this.body.setVelocityX(-20);
			} else {
				this.moveTimer = 0;
			}
		}



		this.play("jump",true);
		// if (player.x < this.body.x) {
		// 	this.body.setVelocityX(-20);
		// 	this.flipX = true;
		// 	this.play("jump",true);
		// } else {
		// 	this.body.setVelocityX(20);
		// 	this.flipX = false;
		// 	this.play("jump",true);
		// }
	}

}
