export default class Spell extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);

		scene.physics.world.enableBody(this, 0);
		scene.physics.add.collider(this, scene.layer);
		this.body.setImmovable(true);

		this.key = key;

		/* ---------- SPELL ANIMATIONS ---------- */

		scene.anims.create({
			key: "bubbleAni",
			frames: scene.anims.generateFrameNumbers("water", {start:0, end:21}),
			frameRate: 32,
			repeat: -1
		});
		scene.anims.create({
			key: "earthAni",
			frames: scene.anims.generateFrameNumbers("earth", {start:0, end:6}),
			frameRate: 15,
			repeat: -1
		});
		scene.anims.create({
			key: "fireAni",
			frames: scene.anims.generateFrameNumbers("fire", {start:0, end:7}),
			frameRate: 10,
			repeat: -1
		});
		scene.anims.create({
			key: "airAni",
			frames: scene.anims.generateFrameNumbers("air", {start:0, end:3}),
			frameRate: 10,
			repeat: -1
		});
	}

	deactivate(scene, enemyGroup) {
		if (this.x < 0 || this.x > scene.gameWidth) {
			scene.player.spellActive[`${this.key}`] = false;
			this.destroy();
		} else if (this.body.x > scene.player.x + 400 || this.body.x < scene.player.x - 400) {
			scene.player.spellActive[`${this.key}`] = false;
			this.destroy();
		} else if (this.body.velocity.x === 0) {
			scene.player.spellActive[`${this.key}`] = false;
			this.destroy();
		}
	}

	shoot(direction) {
		if (this.key === 'water') {
			this.play('bubbleAni', true);
		} else if (this.key === 'fire') {
			this.play('fireAni', true);
		} else if (this.key === 'air') {
			this.play('airAni', true);
		}
		if (!direction) {
			this.body.setVelocityX(300);
		} else {
			this.body.setVelocityX(-300);
			this.flipX = true;
		}
	}

	raise(scene, player) {
		this.play('earthAni', true);
		scene.physics.add.collider(player, this);
		this.body.setVelocityY(-150);
		setTimeout(() => {this.body.setVelocityY(0)}, 750)
	}

	suspend(scene, enemy) {
		enemy.canMove = false;
		enemy.body.setGravity(0, 0);
		enemy.body.setVelocityX(0);
		enemy.body.setVelocityY(-200);
		setTimeout(() => enemy.body.setGravity(0, 600), 1000);
	}

	push(scene, enemy, direction) {
		enemy.canMove = false;
		if (direction) {
			enemy.body.setVelocityX(-150);
		} else {
			enemy.body.setVelocityX(150);
		}
		setTimeout(() => {enemy.body.setVelocityX(0); enemy.canMove = true}, 1200);
	}

}
