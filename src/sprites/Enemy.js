export default class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);

		scene.physics.world.enableBody(this, 0);
		this.body.setCollideWorldBounds(true);
		scene.physics.add.collider(this, scene.layer);
		scene.physics.add.collider(this, scene.player);
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

		/* ---------- MOVEMENT FUNCTIONS ---------- */

	}
	move(player) {
		if(player.x < this.body.x){
		this.body.x -= .5;
		this.flipX = true;
		this.play("jump",true);
		}
		else{
			this.body.x += .5;
			this.flipX = false;
			this.play("jump",true);

		}
	}
		/* ---------- COLLISION FUNCTIONS ---------- */
	resetLevel(){
		scene.RESET_LEVEL = true;
	}
}
