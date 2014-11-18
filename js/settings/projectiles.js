define({
	grenade: {
		weight: 20,
		width: 40,
		hitsPlayer: true,
		hitDamage: 30,
		explodeOnCollision: false,
		affectedByPlayerMotion: true,
		model: {
			name: 'Grenade',
			color: '#cc0000',
			delayToExplosion: 1000,
			delayToExplosionVariability: 0,
			explosion: 'big'
		}
	},
	rocket: {
		weight: 100,
		width: 20,
		hitsPlayer: true,
		hitDamage: 15,
		explodeOnCollision: true,
		affectedByPlayerMotion: true,
		model: {
			name: 'Rocket',
			color: '#00cc00',
			delayToExplosion: 1000,
			delayToExplosionVariability: 0,
			explosion: 'big',
		},
		physics: {
			acceleration: 50,
			bounce: .4,
			friction: 0,
			gravity: 0
		}
		},
	bullet: {
		weight: 5,
		width: 2,
		hitsPlayer: true,
		hitDamage: 1,
		explodeOnCollision: false,
		affectedByPlayerMotion: true,
		model: {
			name: 'Bullet',
			color: '#000',
			delayToExplosion: 3000,
			delayToExplosionVariability: 0,
			explosion: 'small'
		},
		physics: {
			gravity: 1,
			bounce: .8
		}
	},
	flame: {
		weight: 1,
		width: 10,
		hitDamage: 5,
		explodeOnCollision: true,
		affectedByPlayerMotion: true,
		model: {
			name: 'Flame',
			color: 'orange',
			delayToExplosionVariability: 100,
			explosion: 'special',
		}
	}
});