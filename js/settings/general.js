define({
	canvasID: 'stage',
	displayID: 'display',
	/** frames/per second. */
	FPS: 60,
	map: 'map2',
	stage: {
		ratio: 2,
	},
	physics: {
		/** acceleration from gravity, in px/s */
		gravity: 1000,
		// gravity: 0,
		/** deceleration from groundFriction, in decimal lost per frame */
		surfaceFriction: .05,
		/** deceleration from airFriction, in px/s */
		airFriction: 0
	},
	jumpSurfaceDetection: 6,
});