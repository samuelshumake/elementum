import Platform from './Platform.js'

export default class Interactable extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		scene.sys.updateList.add(this);
		scene.sys.displayList.add(this);

		/* ------CONSTANTS AND VARIBLES------- */
		this.ON_PLATFORM = true;

		scene.physics.world.enableBody(this, 0);

    this.body.immovable = true;
		this.body.setGravity(0, 600);
		this.body.setCollideWorldBounds(true);
		this.setScale(2);

	    scene.anims.create({
			key: "flipRight",
			frames: scene.anims.generateFrameNumbers("lever", {start:0, end:3}),
			frameRate: 15,
			repeat: 0
			});

	}


  flip(scene){
		var eKey = scene.input.keyboard.addKey("E");
		if(eKey.isDown){
				this.play("flipRight");

		}

  }

  interactTile(objectToMove){

  }

  interactSprite(spriteToMove, action){


  }

}
