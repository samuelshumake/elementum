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

	}

	/* ---------- MOVEMENT FUNCTIONS ---------- */
	move(player) {

		var dx = Math.sqrt(Math.pow(player.x - this.body.x, 2));
		var dy = Math.sqrt(Math.pow(player.y - this.body.y, 2));

		if (dx <= 200 && dy < 50 && this.canMove) {
			if (this.body.x < player.x) {
				this.body.setVelocityX(40)
			} else {
				this.body.setVelocityX(-40)
			}


			this.play("jump",true);
		}
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
