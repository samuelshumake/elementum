export default class Spell extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);

		scene.physics.world.enableBody(this, 0);
		this.body.setImmovable(true);

		this.key = key;
	}

	deactivate(scene, enemyGroup) {

		if (this.x < 0 || this.x > scene.gameWidth) {
			scene.spellActive[`${this.key}`] = false;
			this.destroy();
		} else if (scene.physics.overlap(Object.values(enemyGroup), this)) {
			var enemy = this.getClosestEnemy(scene, this, scene.enemyGroup)
			scene.spellActive[`${this.key}`] = false;
			this.destroy();
			switch (this.key) {
				case 'fire':
					scene.enemyGroup[enemy].destroy();
					scene.enemyGroup.splice(enemy, 1);
					break;
				case 'water':
					this.suspend(scene, scene.enemyGroup[enemy]);
					break;
				case 'air':
					this.push(scene, scene.enemyGroup[enemy], scene.player.direction);
					break;
			}

		}
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
		enemy.canMove = false;
		enemy.body.setGravity(0, 0);
		enemy.body.setVelocityX(0);
		enemy.body.setVelocityY(-200);
		setTimeout(() => {enemy.body.setGravity(0, 600); enemy.canMove = true}, 1200);
	}

	push(scene, enemy, direction) {
		console.log(enemy);
		enemy.canMove = false;
		if (direction) {
			enemy.body.setVelocityX(-150);
		} else {
			enemy.body.setVelocityX(150);
		}
		setTimeout(() => {enemy.body.setVelocityX(0); enemy.canMove = true}, 1200);

	}

	getClosestEnemy(scene, spell, enemyGroup) {

		let closest = 10000;
		var closestEnemy;

		for (let i = 0; i < enemyGroup.length; i++) {
			let dx = spell.x - enemyGroup[i].x
			if (Math.sqrt(dx * dx) < closest) {
				closest = Math.max(spell.x, enemyGroup[i].x) - Math.min(spell.x, enemyGroup[i].x)
				closestEnemy = i
			}
		}

		return closestEnemy;
	}


}
