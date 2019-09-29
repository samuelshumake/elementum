export default class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);

		scene.physics.world.enableBody(this, 0);
		scene.physics.add.collider(this, scene.layer);
		this.body.setGravity(0, 600);
		this.setScale(2);

	}


}
