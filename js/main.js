(function() {
	var $canvas = $('.sim-canvas');
	var $canvasImage = $('.canvas--image');
	var $canvasQuote = $('.canvas--quote');
	var $quoteText = $('.quote--text');
	var $quoteCredit = $('.quote--credit');
	var $story = $('.story');
	var $thinking = $('.thinking');
	
	var _canvasOptions;

	var FONT_SIZE = { max: 56, min: 24 };
	var RANGE_MIDDLE = 5;

	var init = function() {
		setupOptions();
		if(SETTINGS.embedlyKey) {
			setupEvents();
			checkDev();
		} else {
	 		alert('You must setup an embedly key and add it to the to main.js');	
		}
	};

	var checkDev = function() {
		if(SETTINGS.embedlyKey === 'dev') {
			showOptions({images:[{url:'img/placeholder.jpg'}]});
		}
	};

	var setupOptions = function() {
		for(var name in SETTINGS.options) {
			var option = SETTINGS.options[name];
			appendChoices(name, option);
		}
	};

	var appendChoices = function(name, option) {
		var select = $('.option--' + name).find('select');
		for(var choice in option.choices) {
			var selected = choice === SETTINGS.options[name]['default'] ? ' selected' : '';
			var html = '<option data-prop="' + name + '" value="' + choice + '" ' + selected + '>' + choice + '</option>';
			select.append(html);
		}
	};

 	// handle user input
	var setupEvents = function() {
		$('.options--item button').on('click', function() {
			var el = $(this);
			var prop = el.attr('data-prop');
			var val = el.attr('data-val');
			_canvasOptions[prop]({ el: el, val: val });
		});

		$('.options--item select').on('change', function() {
			var el = $(this);
			var prop = el.attr('data-prop');
			var val = el.val();
			_canvasOptions[prop]({ el: el, val: val });
		});

		$('.options--item .input-text').on('keyup', function() {
			var el = $(this);
			var prop = el.attr('data-prop');
			var val = el.val();
			_canvasOptions[prop]({ el: el, val: val });
		});

		$('.options--item .input-range').on('input', function() {
			var el = $(this);
			var prop = el.attr('data-prop');
			var val = +el.val();
			_canvasOptions[prop]({ el: el, val: val });
		});

		$('.generate').on('click', createOutput );

		$('.story-form').on('submit', extract);
	};

	// get data from embedly
	var extract = function(e) {
		e.preventDefault();
		var $el = $('.story-form--input');
		var url = $el.val().trim();
		$el.val('');

		$('.thinking').removeClass('hide');
		$.embedly.extract(url, {key: SETTINGS.embedlyKey}).progress(function(data) {
			showOptions(data);
		});
		return false;
	};

	// reveal options ui
	var showOptions = function(data) {
		$thinking.addClass('hide');
		$story.removeClass('hide');

		// default to light text on dark bg
		$canvas.addClass('light-on-dark');

		if(data.error) {
			alert('Embedly could not find anything for that url.');
		} else {
			createCanvas(data);
		}

		$('html, body').animate({
			scrollTop: $story.offset().top
		});
	};

	// append image and set proper color
	var createCanvas = function(data) {
		// get image src
		if(data.images.length) {
			var img = data.images[0];
			var src = img.url;

			if(SETTINGS.imageHelper && typeof SETTINGS.imageHelper === 'function') {
				src = SETTINGS.imageHelper(src);
			}

			var bg = 'url("' + src + '")';
			// set canvas bg
			$('.canvas--image').css('background-image', bg);
			
			// set dimensions based on default platform
			var defaultPlatform = SETTINGS.options['platform'].default;
			var defaultFont = SETTINGS.options['font'] ? SETTINGS.options['font'].default : null;

			$canvas.css({
				'width': SETTINGS.options['platform'].choices[defaultPlatform].w,
				'height': SETTINGS.options['platform'].choices[defaultPlatform].h,
				'font-family': defaultFont ? SETTINGS.options['font'].choices[defaultFont] : 'Helvetica, sans-serif'
			});
		} else {
			alert('Embedly does not have any images associated with this story. Try a direct link to the image file.');
		}
	};

	// toggle selected button in options view
	var toggleSelected = function(params) {
		params.el.siblings().removeClass('selected');
		params.el.addClass('selected');
	};

	// create png from canvas
	var createOutput = function() {
		var el = $canvas[0];
		html2canvas(el, {
			letterRendering: true,
			allowTaint: true,
		    onrendered: function(canvas) {
		    	var html = '<p>Right click and save image to download.</p>';
		    	$('.sim-output').empty().append(html).append(canvas);
		    }
		});
	};

	// calculate offset based on height of el for true middle
	var updateLayoutMargin = function() {
		var margin = 0;
		var middle = $canvas.hasClass('middle');
		if(middle) {
			var h = $canvasQuote.height();
			margin = -h * 0.5;
		}
		$canvasQuote.css('margin-top', margin);
	};	

	// functionality for each option selected
	_canvasOptions = {
		text: function(params) {
			var val = params.val.trim();
			$quoteText.text(val);
			updateLayoutMargin();
		},
		credit: function(params) {
			var val = params.val.trim();
			$quoteCredit.text(val);
			updateLayoutMargin();
		},
		platform: function(params) {
			$canvas.css({
				width: SETTINGS.options['platform'].choices[params.val].w,
				height: SETTINGS.options['platform'].choices[params.val].h
			});
		},
		position: function(params) {
			var cssProp;
			var bgPosition;
			if(params.val === 'up' || params.val === 'down') {
				cssProp = 'background-position-y';
			} else {
				cssProp = 'background-position-x';
			}
			bgPosition = parseInt($canvasImage.css(cssProp));
			bgPosition += (params.val === 'up' || params.val === 'right') ? 5 : -5;
			bgPosition = Math.min(Math.max(0, bgPosition), 100);
			bgPosition += '%';
			$canvasImage.css(cssProp, bgPosition);
		},
		layout: function(params) {
			$canvas.removeClass('top bottom middle').addClass(params.val);
			updateLayoutMargin();
		},
		align: function(params) {
			$canvasQuote.removeClass('left center right').addClass(params.val);
		},
		font: function(params) {
			var stack = SETTINGS.options['font'].choices[params.val];
			$canvas.css('font-family', stack);
		},
		size: function(params) {
			params.val = parseInt(params.val);
			var size = parseInt($canvasQuote.css('font-size')) + params.val;
			size = Math.min(FONT_SIZE.max, Math.max(FONT_SIZE.min, size));
			$canvasQuote.css('font-size', size);
		},
		shadow: function(params) {
			if(params.val === 'on') {
				$canvasQuote.addClass('text-shadow');
			} else {
				$canvasQuote.removeClass('text-shadow');
			}
		},
		contrast: function(params) {
			var offset = Math.abs(params.val - RANGE_MIDDLE);
			var className = params.val - RANGE_MIDDLE > 0 ? 'dark-on-light': 'light-on-dark';
			var opacity = 1 - offset * 0.1;

			$canvas.removeClass('light-on-dark dark-on-light').addClass(className);
			$canvasImage.css('opacity', opacity);
		}
	};

	init();
})();
