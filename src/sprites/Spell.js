export default class Spell extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);

		scene.physics.world.enableBody(this, 0);
		this.body.setImmovable(true);

	}

	shoot(direction) {
		if (!direction) {
			this.body.setVelocityX(300);
		} else {
			this.body.setVelocityX(-300);
			this.flipX = true;
		}

	}

	raise(scene, player) {
		scene.physics.add.collider(player, this);
		scene.tweens.add({
			targets: this,
			y: player.y - 30,
			ease: 'Linear',
			duration: 800
		});
	}

}
