import Spell from './Spell.js';

export default class Player extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);


		/* ------CONSTANTS AND VARIBLES------- */
		// Sets players physical body
		scene.physics.world.enableBody(this, 0);
		scene.physics.add.collider(this, scene.layer);
		scene.physics.add.collider(this.body, scene.spikes, scene.resetLevel, null, this);
		this.body.setGravity(0, 600);

		// Initializes spell cooldown timer
		this.spellTimer = 100;

		this.jumpHeld = false;

		// Checks which spells are active
		this.spellActive = {
			fire: false,
			earth: false,
			water: false,
			air: false
		}

		// Initializes player's current spell
		this.currentSpell = 'fire';

		// Makes spell frames transparent
		// scene.earthFrame.alpha = 0.2;
		// scene.waterFrame.alpha = 0.2;
		// scene.airFrame.alpha = 0.2;


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
				if (this.body.blocked.down || scene.physics.overlap(this, scene.rock) || scene.physics.overlap(this, scene.box)) {
					if (this.spellActive['earth'] === true) {
						this.platform.body.setVelocityY(250);
						this.spellActive['earth'] = false;
						setTimeout(() => {this.platform.destroy()}, 350);
						setTimeout(() => {
							this.platform = scene.physics.add.existing(new Spell(scene, this.x, this.body.bottom + 15, 'earth'));
							this.spellActive['earth'] = true;
							this.platform.raise(scene, this)}, 600);
					} else {
						this.platform = scene.physics.add.existing(new Spell(scene, this.x, this.body.bottom + 15, 'earth'));
						this.spellActive['earth'] = true;
						this.platform.raise(scene, this);
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

	// changeSpellFrame(scene, frame) {
	// 	scene.frameGroup.forEach( obj => obj.alpha = 0.2);
	// 	scene.frameGroup[frame].alpha = 1;
	// }
}
