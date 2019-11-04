export default class Lever extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);


		/* ------ PROPERTIES ------- */
		scene.physics.world.enableBody(this, 0);
    this.body.immovable = true
		this.setScale(3);
		this.flipX = true;
		this.flipped = false;

		/* ------ CREATES ANIMATION ------- */
	    scene.anims.create({
			key: "flipRight",
			frames: scene.anims.generateFrameNumbers("lever", {start:0, end:3}),
			frameRate: 15,
			repeat: 0
		});

	}

	flip(scene, object, direction, distance) {
		if (scene.physics.overlap(this, scene.player) && !this.flipped) {
			this.play("flipRight",true)
			object.move(scene, direction, distance);
			this.flipped = true;
		}


	}

}
