import Spell from './Spell.js';

export default class Player extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);

		scene.physics.world.enableBody(this, 0);
		scene.physics.add.collider(this, scene.layer);
		scene.physics.add.collider(this, scene.platform1)
		this.body.setGravity(0, 600);
		this.body.setCollideWorldBounds(true);
		this.setScale(1);

		this.currentSpell = 'fire';

		scene.anims.create({
			key: "flipRight",
			frames: scene.anims.generateFrameNumbers("lever", {start:0, end:3}),
			frameRate: 15,
			repeat: 0
		});
		scene.anims.create({
			key: "flipLeft",
			frames: scene.anims.generateFrameNumbers("leverBack", {start:0, end:3}),
			frameRate: 15,
			repeat: 0
		});
		   /* ----- PLAYER ----- */
		scene.anims.create({
			key: "run",
			frames: scene.anims.generateFrameNumbers("run", {start:0, end:7}),
			frameRate: 15,
			repeat: 0
		});
		scene.anims.create({
			key: "idle",
			frames: scene.anims.generateFrameNumbers("player", {start:0, end:0}),
			frameRate: 15,
			repeat: 0
		});
		scene.anims.create({
			key: "jumpPlayer",
			frames: scene.anims.generateFrameNumbers("jumpPlayer", {start:0, end:10}),
			frameRate: 15,
			repeat: 0
		});

	}

	/* ---------- MOVEMENT FUNCTIONS ---------- */
	move() {
		var cursors = this.scene.input.keyboard.createCursorKeys();
		var speed = 5;

		// Give the player left and right movement
		if (cursors.left.isDown) {
			this.x -= speed;
			this.flipX = true;
			if(this.body.onFloor()){
				this.play("run",true);
			}
		} else if (cursors.right.isDown) {
			this.x += speed;
			this.flipX = false
			if(this.body.onFloor()){
				this.play("run",true);
			}
		} else {
			if(this.body.onFloor())
			this.play("idle",true);
		}

		// Give the player jumping movement
		if (cursors.up.isDown && this.body.onFloor()){
			this.body.y -= 20;
			this.body.setVelocityY(-500)
			this.body.setAccelerationY(1300);
			this.play("jumpPlayer",true);
		}
	}


	/* ---------- SPELL-CASTING FUNCTIONS ---------- */
	cast(scene, spell, direction = false) {
		this.direction = direction;
		switch (spell) {

			/* ----- FIRE ----- */
			case 'fire':
				if (scene.spellActive['fire'] === true) {
					return;
				}
				this.fireball = scene.physics.add.existing(new Spell(scene, this.x + 40, this.y, 'fireball'));
				scene.spellActive['fire'] = true;
				this.fireball.shoot(direction);
				break;


			/* ----- EARTH ----- */
			case 'earth':
				if (scene.spellActive['earth'] === true) {
					this.platform.destroy();
					scene.spellActive['earth'] = false;
				}
				this.platform = scene.physics.add.existing(new Spell(scene, this.x, this.y+90, 'platform'));
				scene.spellActive['earth'] = true;
				this.platform.raise(scene, this)
				break;


			/* ----- WATER ----- */
			case 'water':
				if (scene.spellActive['water'] === true) {
					return;
				}
				this.bubble = scene.physics.add.existing(new Spell(scene, this.x + 40, this.y, 'bubble'));
				scene.spellActive['water'] = true;
				this.bubble.shoot(direction);
				break;


			/* ----- AIR ----- */
			case 'air':
				if (scene.spellActive['air'] === true) {
					return;
				}
				this.airWave = scene.physics.add.existing(new Spell(scene, this.x + 40, this.y, 'airwave'));
				scene.spellActive['air'] = true;
				this.airWave.shoot(direction);
				break;
		 }


	}


}
