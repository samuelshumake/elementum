export { addSceneEventListeners };

function addSceneEventListeners(that) {

	that.input.keyboard.on(
		'keydown_ESC',
			function() {
				that.scene.start('Boot');
		}
	);

	that.input.keyboard.on(
		'keydown_ONE',
			function() {
				that.scene.start('s1r1');
		}
	);

	that.input.keyboard.on(
		'keydown_TWO',
			function() {
				that.scene.start('s1r2');
		}
	);

	that.input.keyboard.on(
		'keydown_THREE',
			function() {
				that.scene.start('s1r3');
		}
	);
}
