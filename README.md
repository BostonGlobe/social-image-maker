# Social Image Maker

Generate sharable images with quotes that *super fast*.

## Setup
Clone repo: `git clone https://github.com/BostonGlobe/social-image-maker.git`

### Logo
- Replace temp logo in `img` folder with your own 96x96 png file (save as `img/logo.png`)

### Fonts
- Create custom fonts in `settings.css`

### Settings
`js/settings.js` is where you want to do any other customizations, including:
- Embedly API key (required)
- Supported social platforms and target dimensions (required)
- Custom font options
- Image helper function to replace parts of source url

Here is an example settings config:

```
window.SETTINGS = {
	'embedlyKey': '*** key_value ***',
	'options': {
		'platform': {
			'default': 'facebook',
			'choices': {
				'facebook': { w: '1200', h: '627' },
				'twitter': { w: '1024', h: '512' },
				'instagram': {w: 640, h: 640 }
			}	
		},
		'font': {
			'default': 'benton',
			'choices': {
				'benton': 'Benton, Helvetica, Arial, sans-serif',
				'miller': 'Miller, Georgia, serif'
			}
		}
	},
	'imageHelper': function(src) {
		// do some regex to tweak img src (ex. pull down better img quality)
		return src.replace(/960w|585w/, '1920w');
	}
};
```
