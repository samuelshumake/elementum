

		/* ---------- CREATES PLAYER AND ENEMIES ---------- */
		// Adds character into the scene
		//this.player = this.physics.add.sprite(10, 500, 'player');
//this.playerPos = [this.player.x-32, (-1*this.player.y-568).toFixed(0)];
		//this.player.setCollideWorldBounds(true);
		//this.player.setScale(2);
		//this.player.setGravity(0, 800);


		// Add enemy group in
		this.enemyGroup = this.physics.add.group({
			key: 'enemy',
			repeat: 2,
			setXY: {
				x: 500,
				y: 500,
				stepX: 100
			},
		});
		// Modify the enemies
		this.enemyGroup.children.iterate( child => {
			child.setScale(2);
			child.setCollideWorldBounds(true);
			child.setGravity(0, 800);
		});




// Add enemy group in
this.enemyGroup = this.physics.add.group({
	key: 'enemy',
	repeat: 2,
	setXY: {
		x: 500,
		y: 500,
		stepX: 100
	},
});
// Modify the enemies
this.enemyGroup.children.iterate( child => {
	child.setScale(2);
	child.setCollideWorldBounds(true);
	child.setGravity(0, 800);
});


/* ---------- CREATES LEVERS ---------- */
this.lever = this.physics.add.sprite(100,500,'lever');
this.lever.setScale(4);
this.lever.setCollideWorldBounds(true);
this.lever.setGravity(0, 1000);
this.flipped = 0;
this.physics.add.collider(this.player, this.lever);
this.physics.add.collider(this.lever, layer);
this.physics.add.collider(this.player, layer);

/* ---------- CREATES LEVERS ---------- */
this.lever = this.physics.add.sprite(100,500,'lever');
this.lever.setScale(4);
this.lever.setCollideWorldBounds(true);
this.lever.setGravity(0, 1000);
this.flipped = 0;


/* ---------- CREATES SPELLS ---------- */
// Adds fireballs and limits to 1 on screen
this.fireballs = this.physics.add.group({
	defaultKey: 'fireball',
	maxSize: 1
});
// Adds bubbles and limits to 1 on screen
this.bubbles = this.physics.add.group({
  defaultKey: 'bubble',
  maxSize: 1
});
// Adds earth platform and limits to 1 on screen
this.platforms = this.physics.add.group({
	defaultKey: 'platform',
	maxSize: 1
});
// Adds air waves and limits to 1 on screen
this.airwaves = this.physics.add.group({
	defaultKey: 'airwave',
	maxSize: 1
});




// Shooting water
this.shootWater = (player, direction) => {
	var bubble = this.bubbles.get();
	bubble
		.enableBody(true, player.x, player.y, true, true, true)

	// Check which direction the bubble shoots
	switch (direction){
		case true:
			bubble.setVelocityX(-600);
			break;
		case false:
			bubble.setVelocityX(600);
			break;
	}
}
// Shoots air
this.shootAir = (player, direction) => {
	var airwave = this.airwaves.get();
	airwave
		.enableBody(true, player.x, player.y, true, true, true);

	// Checks to see which direction the fireball shoots
	switch (direction) {
		case true:
			airwave.setVelocityX(-600);
			break;
		case false:
			airwave.setVelocityX(600);
			break;
	}
}


// Raises earth
this.raiseEarth = (player) => {
	var platform = this.platforms.get();
	platform
		.enableBody(true, player.x, player.y + 40, true, true, false);
	platform.setScale(1, 2);
	this.physics.add.collider(player, platform);
	platform.setImmovable(true);

	/* ----- ANIMATIONS ----- */
	// Platform
	this.tweens.add({
		targets: platform,
		x: player.x,
		y: 580,
		ease: 'Linear',
		duration: 200
	});
	// Player
	this.tweens.add({
		targets: player,
		y: 510,
		ease: 'Linear',
		duration: 160
	});
}
