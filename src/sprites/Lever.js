export default class Lever extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);


		/* ------ PROPERTIES ------- */
		scene.physics.world.enableBody(this, 0);
    	this.body.immovable = true;
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

	flip(scene, object, direction, distance, cameraOptions ) {
		if (scene.physics.overlap(this, scene.player) && !this.flipped) {
			this.flipped = true;
			this.play("flipRight",true);
			object.move(scene, direction, distance);
			this.newCamera = scene.cameras.add(858, 384, 400, 200).setScroll(cameraOptions[0], cameraOptions[1]).setZoom(cameraOptions[2]).fadeIn(700);
			this.cameraFrame = scene.add.sprite(849, 398, 'cameraFrame').setScale(3.5, 3).setScrollFactor(0, 0);
			setTimeout(() => {scene.cameras.remove(this.newCamera); this.cameraFrame.destroy()}, cameraOptions[3]);
		}



	}


}
