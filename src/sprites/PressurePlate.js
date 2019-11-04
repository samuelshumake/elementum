export default class PressurePlate extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);


		/* ------ PROPERTIES ------- */
		scene.physics.world.enableBody(this, 0);
		this.body.immovable = true;
		this.tripped = false;
		this.setScale(1.5)

		/* ------ CREATES ANIMATION ------- */
		scene.anims.create({
			key: "plateDown",
			frames: scene.anims.generateFrameNumbers("plate", {start:0, end:3}),
			frameRate: 15,
			repeat: 0
		});
		scene.anims.create({
			key: "plateUp",
			frames: scene.anims.generateFrameNumbers("plate", {start:3, end:0}),
			frameRate: 15,
			repeat: 0
		});

	}

	trip(scene, object, direction, distance) {
		if (scene.physics.overlap(this, scene.player) && !this.tripped) {
			this.play("plateDown",true);
			object.move(scene, direction, distance);
			this.tripped = true;
		}
		if (scene.physics.overlap(this, scene.player) && this.tripped){
			this.play("plateUp", true);
			object.move(scene, direction, distance * -2);
			this.tripped = false;
		}
		if (scene.physics.overlap(this, scene.rockGroup) && !this.tripped) {
			this.play("plateDown",true);
			object.move(scene, direction, distance);
			this.tripped = true;
		}
		if (scene.physics.overlap(this, scene.rockGroup) && this.tripped){
			this.play("plateUp", true);
			object.move(scene, direction, distance * -2);
			this.tripped = false;
		}


	}

}
