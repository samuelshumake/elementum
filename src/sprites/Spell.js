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
		this.setScale(1.8, 3)
		scene.physics.add.collider(player, this);
		this.body.setVelocityY(-150);
		setTimeout(() => {this.body.setVelocityY(0)}, 750)
	}

	suspend(scene, enemy) {
		scene.tweens.add({
			targets: enemy,
			y: enemy.y - 400,
			ease: 'Linear',
			duration: 400
		});
		enemy.body.setGravity(0, 0);
	}

	push(scene, enemy, direction) {

		if (direction) {
			scene.tweens.add({
				targets: enemy,
				x: enemy.x - 100,
				ease: 'Linear',
				duration: 400
			});
		} else {
			scene.tweens.add({
				targets: enemy,
				x: enemy.x + 100,
				ease: 'Linear',
				duration: 400
			});
		}
	}


}
