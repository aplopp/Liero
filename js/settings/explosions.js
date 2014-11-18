define({
	special: {
		name: 'Special Explosion',
		duration: 1200,
		animation: {
			colors: [
				{ position: 0, value: '#fff' },
				{ position: .2, value: '#00B1FF' },
				{ position: .4, value: '#00E1FF' },
				{ position: .7, value: '#cc0000' },
				{ position: .9, value: '#94FFE8' },
				{ position: 1, value: '#fff' }
			],
			radius: [
				{ position: 0, value: 25 },
				{ position: .5, value: 50 },
				{ position: .7, value: 5 },
				{ position: .8, value: 12 },
				{ position: 1, value: 1 }
			]
		},
	},
	big: {
		name: 'Big Explosion',
		duration: 1000,
		animation: {
			colors: [
				{ position: 0, value: '#00B1F7' },
				{ position: .2, value: '#F7D200' },
				{ position: .4, value: '#F73A00' },
				{ position: .6, value: '#E80000' },
				{ position: 1, value: '#750000' }
			],
			radius: [
				{ position: 0, value: 40 },
				{ position: .5, value: 20 },
				{ position: .8, value: 15 },
				{ position: 1, value: 1 }
			]
		},
	},
	medium: {
		name: 'Medium Explosion',
		duration: 1000,
		animation: {
			colors: [
				{ position: 0, value: '#00B1F7' },
				{ position: .2, value: '#F7D200' },
				{ position: .4, value: '#F73A00' },
				{ position: .6, value: '#E80000' },
				{ position: 1, value: '#750000' }
			],
			radius: [
				{ position: 0, value: 1 },
				{ position: .5, value: 20 },
				{ position: 1, value: 1 }
			]
		},
	},
	small: {
		name: 'Small Explosion',
		duration: 1000,
		animation: {
			colors: [
				{ position: 0, value: '#00B1F7' },
				{ position: .2, value: '#F7D200' },
				{ position: .4, value: '#F73A00' },
				{ position: .6, value: '#E80000' },
				{ position: 1, value: '#750000' }
			],
			radius: [
				{ position: 0, value: 1 },
				{ position: .5, value: 20 },
				{ position: 1, value: 1 }
			]
		}
	}
});