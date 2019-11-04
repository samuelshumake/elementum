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

	flip(scene, object) {
		if (scene.physics.overlap(this, scene.player) && !this.flipped) {
			this.flipped = true;
			this.play("flipRight",true);
			object.forEach(function(i) {
				i.move(scene, i.options[0], i.options[1]);
				let newCamera = scene.cameras.add(858, 384, 400, 200).startFollow(i.options[2]).setZoom(i.options[3]).fadeIn(700);
				newCamera.setBounds(0, 0, 800, 640);
				let cameraFrame = scene.add.sprite(849, 398, 'cameraFrame').setScale(3.5, 3).setScrollFactor(0, 0);
				setTimeout(() => {scene.cameras.remove(newCamera); cameraFrame.destroy()}, i.options[4]);
			});
		}



	}


}
