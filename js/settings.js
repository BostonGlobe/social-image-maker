window.SETTINGS = {
	'embedlyKey': 'dev', // insert your Embedly API key here
	'options': {
		'platform': {
			'default': 'facebook',
			'choices': {
				'facebook': { w: 1200, h: 627 },
				'twitter': { w: 1024, h: 512 },
				'instagram': {w: 640, h: 640 }
			}	
		},
		'font': {
			'default': 'helvetica',
			'choices': {
				'helvetica': 'Helvetica, Arial, sans-serif',
				'georgia': 'Georgia, Times New Roman, serif'
			}
		}
	},
	'imageHelper': function(src) {
		// do some regex to tweak img src (ex. pull down better img quality)
		return src.replace(/960w|585w/, '1920w');
	}
};