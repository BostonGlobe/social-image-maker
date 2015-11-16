window.SETTINGS = {
	'embedlyKey': 'dev', // insert your Embedly API key here
	'options': {
		'platform': {
			'default': 'Facebook Retina',
			'choices': {
				'Facebook Retina': { w: 2400, h: 1254 },
				'Twitter Retina': { w: 2048, h: 1024 },
				'Instagram Retina': {w: 1280, h: 1280 },
                'Facebook': { w: 1200, h: 627 },
				'Twitter': { w: 1024, h: 512 },
				'Instagram': {w: 640, h: 640 }
			}	
		},
		'font': {
			'default': 'helvetica',
			'choices': {
				'helvetica': 'Helvetica, Arial, sans-serif',
				'georgia': 'Georgia, Times New Roman, serif',
			}
		}
	},
	'imageHelper': function(src) {
		// do some regex to tweak img src (ex. pull down better img quality)
		return src.replace(/960w|585w/, '1920w');
	}
};