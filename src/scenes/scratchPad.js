/* ---------- SPELL EFFECT ---------- */
// Hit with fire
hitEnemy (fireball, enemy) {
	enemy.disableBody(true, true);
	fireball.disableBody(true, true);
}
// Hit with air
pushEnemy (airwave, enemy) {
	if (airwave.x < enemy.x) {
		enemy.setVelocityX(300);
	} else {
		enemy.setVelocityX(-300);
	}
	airwave.disableBody(true, true);
}
// Hit with water
suspendEnemy(bubble, enemy){
	enemy.y -= 100
	enemy.setGravity(0, 0)
	bubble.disableBody(true, true);
}
// Pull lever
pullLever(){
	if (this.eKey.isDown){
		if(this.flipped == 0){
			this.lever.anims.play("flipRight",true);
			this.flipped = 1;
		}
	}
}
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




this.bullets.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.enemyGroup,
            this.hitEnemy,
            null,
            this
          );
          if (b.y < 0) {
            b.setActive(false);
          } else if (b.y > this.cameras.main.height) {
            b.setActive(false);
          } else if (b.x < 0) {
            b.setActive(false);
          } else if (b.x > this.cameras.main.width) {
            b.setActive(false);
          }
        }
      }.bind(this)
    );
