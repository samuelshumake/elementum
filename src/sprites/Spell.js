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

	// TODO: Raising earth platform isn't consistent, plus you can cheese it
	//		 by continously casting the spell to go to the top of the screen
	raise(scene, player) {
		scene.physics.add.collider(player, this);
		scene.tweens.add({
			targets: this,
			y: player.y - 30,
			ease: 'Linear',
			duration: 800
		});
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
