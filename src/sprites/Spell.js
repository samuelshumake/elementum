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
		this.setScale(1.5, 3)
		scene.physics.add.collider(player, this);
		this.body.setVelocityY(-150);
		setTimeout(() => {this.body.setVelocityY(0)}, 750)
	}

	suspend(scene, enemy) {
		enemy.body.setGravity(0, 0);
		enemy.body.setVelocityY(-200);
		setTimeout(() => {enemy.body.setGravity(0, 600)}, 1200);
	}

	push(scene, enemy, direction) {
		if (direction) {
			enemy.body.setVelocityX(-150);
		} else {
			enemy.body.setVelocityX(150);
		}
		setTimeout(() => {enemy.body.setVelocityX(0)}, 1200);
	}


}
