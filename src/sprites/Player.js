import Spell from './Spell.js';

export default class Player extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);


		/* ------CONSTANTS AND VARIBLES------- */
		scene.physics.world.enableBody(this, 0);
		scene.physics.add.collider(this, scene.layer);
		scene.physics.add.collider(this.body, scene.spikes, scene.resetLevel, null, this);
		this.body.setGravity(0, 600);
		this.spellTimer = 100;
		this.jumpHeld = false;
		this.raisingPlatform = false;

		// Checks which spells are active
		this.spellActive = {
			fire: false,
			earth: false,
			water: false,
			air: false
		}

		// Initializes player's current spell
		this.currentSpell = 'fire';

		/* ------ ANIMATIONS ------- */
		scene.anims.create({
			key: "flipRight",
			frames: scene.anims.generateFrameNumbers("lever", {start:0, end:3}),
			frameRate: 15,
			repeat: 0
		});
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
	move(scene) {
		var cursors = this.scene.input.keyboard.createCursorKeys();

		this.spellTimer++;

		if (this.jumpHeld) {
			this.jumpHeld = !cursors.up._justUp;
		}

		this.canJump = (!this.jumpHeld && (this.body.touching.down || this.body.blocked.down));

		// Give the player left and right movement
		if (cursors.left.isDown) {
			this.body.setVelocityX(-250);
			this.flipX = true;
			if (this.body.blocked.down || scene.physics.add.overlap(this.body, this.platform)) {
				this.play("run",true);
			}
		} else if (cursors.right.isDown) {
			this.body.setVelocityX(250);
			this.flipX = false
			if (this.body.blocked.down || scene.physics.add.overlap(this.body, this.platform)) {
				this.play("run",true);
			}
		} else {
			this.body.setVelocityX(0);
			if (this.body.blocked.down || scene.physics.add.overlap(this.body, this.platform)) {
				this.play("idle",true);
			}
		}

		// Give the player jumping movement
		if (cursors.up.isDown && this.canJump) {
			this.jumpTimer = 0;
			this.jumpHeld = true;
			this.body.setVelocityY(-600)
			this.body.setAccelerationY(1300);
		}

		// Allows the player to crouch
		// if (cursors.down.isDown) {
		// 	this.body.setSize(this.width, 32);
		// } else {
		// 	this.body.setSize(this.width, this.height);
		// }
	}


	/* ---------- SPELL-CASTING FUNCTIONS ---------- */
	cast(scene, spell, direction = false) {
		this.direction = direction;
		this.spellTimer = 0;
		switch (spell) {

			/* ----- FIRE ----- */
			case 'fire':
				if (this.spellActive['fire'] === true) {
					return;
				}
				this.fireball = scene.physics.add.existing(new Spell(scene, this.x, this.y, 'fire'));
				this.spellActive['fire'] = true;
				this.fireball.shoot(scene, direction);
				break;


			/* ----- EARTH ----- */
			case 'earth':
				if (this.body.blocked.down || this.body.touching.down) {
					if (this.spellActive['earth'] === true) {
						this.spellActive['earth'] = false;
						this.platform.destroy();
						this.platformBox.destroy();
					} else {
						this.spellActive['earth'] = true;
						this.platformBox = scene.physics.add.existing(new Spell(scene, this.x, this.body.bottom + 15));
						this.platform = scene.physics.add.existing(new Spell(scene, this.x, this.body.bottom, 'earth'));
						this.platform.setOrigin(0.5, 1);
						this.platformBox.body.setSize(32, 1);

						this.platform.play('earthAni2', true);
						this.platformBox.raise(scene, this);
					}
				}
				break;

			/* ----- WATER ----- */
			case 'water':
				if (this.spellActive['water'] === true) {
					return;
				}
				this.bubble = scene.physics.add.existing(new Spell(scene, this.x, this.y, 'water'));
				this.spellActive['water'] = true;
				this.bubble.shoot(scene, direction);
				break;


			/* ----- AIR ----- */
			case 'air':
				if (this.spellActive['air'] === true) {
					return;
				}
				this.airwave = scene.physics.add.existing(new Spell(scene, this.x, this.y, 'air'));
				this.spellActive['air'] = true;
				this.airwave.shoot(scene, direction);
				break;
		}

	}

}
