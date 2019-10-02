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
		this.body.setGravity(0, 600);
		this.body.setCollideWorldBounds(true);
		this.setScale(1);

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

		// Give the player left and right movement
		if (cursors.left.isDown) {
			this.body.setVelocityX(-250);
			this.flipX = true;
			if(this.body.onFloor()){
				this.play("run",true);
			}
		} else if (cursors.right.isDown) {
			this.body.setVelocityX(250);
			this.flipX = false
			if(this.body.onFloor()){
				this.play("run",true);
			}
		} else {
			this.body.setVelocityX(0);
			if(this.body.onFloor())
			this.play("idle",true);
		}

		// Give the player jumping movement
		if (cursors.up.isDown && scene.jumpTimer > 40) {
			this.body.y -= 20;
			scene.jumpTimer = 0;
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
			case 'earth':							// THINK ABOUT CALLBACK OR ASYNC FUNCTIONS
				if (scene.spellActive['earth'] === true) {
					this.platform.body.setVelocityY(200);
					scene.spellActive['earth'] = false;
					setTimeout(() => {this.platform.destroy}, 750);
					this.platform = scene.physics.add.existing(new Spell(scene, this.x, this.y+90, 'platform'));
					scene.spellActive['earth'] = true;
					this.platform.raise(scene, this);
					break;
				} else {
					this.platform = scene.physics.add.existing(new Spell(scene, this.x, this.y+90, 'platform'));
					scene.spellActive['earth'] = true;
					this.platform.raise(scene, this);
					break;
				}


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
