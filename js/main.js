(function() {
	var $canvas = $('.smear-canvas');
	var init = function() {
		if(SETTINGS.embedlyKey) {
			setupEvents();	
		} else {
			alert('You must setup an embedly key and add it to the to main.js');
		}
	};

 	// handle user input
	var setupEvents = function() {
		$('.smear-options button').on('click', function() {
			var el = $(this);
			var prop = el.attr('data-prop');
			var val = el.attr('data-val');
			adjustOptions[prop]({ el: el, val: val });
		});

		$('.smear-options input').on('keyup', function() {
			var el = $(this);
			var prop = el.attr('data-prop');
			var val = el.val();
			adjustOptions[prop]({ el: el, val: val });
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
		$('.thinking').addClass('hide');
		$('.story').removeClass('hide');
		if(data.error) {
			alert('something is wrong.');
		} else {
			createCanvas(data);
			
		}
	};

	// append image and set proper color
	var createCanvas = function(data) {
		// get image url
		var img = data.images[0];

		var bg = 'url("' + img.url + '")';
		// set canvas bg
		$('.canvas--image').css('background-image', bg);

		//set bg color and text based on dominant colors in image
		var choice = getBestColor(img.colors);
		$canvas.removeClass().addClass('smear-canvas ' + choice);
		
		// $('.option--color').find('button').removeClass('selected');
		// $('.option--color').find('.' + choice).addClass('selected');
		
		// set dimensions based on default platform
		$canvas.css({
			width: SETTINGS.platforms[SETTINGS.defaultPlatform].w,
			height: SETTINGS.platforms[SETTINGS.defaultPlatform].h
		});
	};

	// returns better overlay option (white or black) based on dominant colors
	var getBestColor = function(colors) {
		var best = {black: 0, white: 0};
		var num = Math.min(colors.length, 3);

		for(var i = 0; i < num; i++) {
			var color = colors[i];
			if(color.weight > 0.1) {
				var o = Math.round(((parseInt(color.color[0]) * 299) + (parseInt(color.color[1]) * 587) + (parseInt(color.color[2]) * 114)) /1000);
				var choice = o > 125 ? 'black' : 'white';
				best[choice]++;
			}
		}

		return best['black'] > best['white'] ? 'dark-on-light' : 'light-on-dark';
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
		    	var html = '<p>Right click and save image. Now go smear it all over the internet.</p>';
		    	$('.smear-output').empty().append(html).append(canvas);
		    }
		});
	};

	// functionality for each option selected
	var adjustOptions = {
		platform: function(params) {
			toggleSelected(params);

			$canvas.css({
				width: SETTINGS.platforms[params.val].w,
				height: SETTINGS.platforms[params.val].h
			});
		},
		font: function(params) {
			toggleSelected(params);

			var quote = params.el.parents('.story').find('.canvas-quote');
			quote.css('font-family', params.val);
		},
		size: function(params) {
			params.val = parseInt(params.val);
			var quote = params.el.parents('.story').find('.canvas-quote');
			var size = parseInt(quote.css('font-size')) + params.val;
			quote.css('font-size', size);
		},
		align: function(params) {
			toggleSelected(params);
			var quote = params.el.parents('.story').find('.canvas-quote');
			quote.css('text-align', params.val);	
		},
		position: function(params) {
			var canvas = params.el.parents('.story').find('.canvas-image');
			var cssProp;
			var bgPosition;
			if(params.val === 'up' || params.val === 'down') {
				cssProp = 'background-position-y';
			} else {
				cssProp = 'background-position-x';
			}
			bgPosition = parseInt(canvas.css(cssProp));
			bgPosition += (params.val === 'up' || params.val === 'right') ? 5 : -5;
			bgPosition = Math.min(Math.max(0, bgPosition), 100);
			bgPosition += '%';
			canvas.css(cssProp, bgPosition);
		},
		layout: function(params) {
			toggleSelected(params);
			var quote = params.el.parents('.story').find('.canvas-quote');
			quote.removeClass().addClass('canvas-quote').addClass(params.val);
		},
		color: function(params) {
			toggleSelected(params);
			$canvas.removeClass().addClass('smear-canvas ' + params.val);
		},
		quoteText: function(params) {
			var val = params.val.trim();
			$('.quote-text').text(val);
		},
		quoteAttribution: function(params) {
			var val = params.val.trim();
			$('.quote-attribution').text(val);
		}
	};

	init();
})();
