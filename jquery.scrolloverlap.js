/* 
 * jquery.scrolloverlap
 * Source: https://github.com/rafadev/jquery.scrolloverlap
 * Copyright (C) 2012, Rafael Ponieman
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
(function($){
	var init, state;

	init = function(options){
		var defaults = {
			shrinkStart: 0.5,
			shrinkHeight: 150
		}

		return this.each(function(){
			var $el = $(this), data = $el.data('scrolloverlap');
			if(!data){
				data = {};
				data.options = $.extend(defaults, options);
				data.$children = $el.children();
				data.heights = {};
				data.sumPrevious = {};
				
				$el.data('scrolloverlap', data);
				
				data.$children.each(function(index){
					data.heights[index] = $(this).height();
					if(index == 0){
						data.sumPrevious[0] = 0;
					} else {
						data.sumPrevious[index] = sumPrevious($el, index);
					}
				});
			}
			
			state($el);
			$(window).scroll(function(){
				state($el);
			}).resize(function(){
				state($el);
			});
		});
	}
	
	sumPrevious = function($el, index){
		var data = $el.data('scrolloverlap'), height = data.heights[index], sum = 0;
		for(c = 0; c < index; c++){
			sum += data.heights[c] - data.options.shrinkHeight;
		}
		return sum;
	}
	
	state = function($el){
		var data = $el.data('scrolloverlap'), 
			wind = $(window), 
			wHeight = wind.height(), 
			scrollTop = wind.scrollTop();
		
		data.$children.each(function(index){
			var newHeight = 0;
			if((scrollTop + wHeight * data.options.shrinkStart > 
					data.sumPrevious[index] + data.heights[index]) && 
				(scrollTop + wHeight * data.options.shrinkStart - data.options.shrinkHeight < 
					data.sumPrevious[index] + data.heights[index])){
				newHeight = data.heights[index] - (scrollTop + wHeight * data.options.shrinkStart - data.sumPrevious[index] - data.heights[index]);
			} else if(scrollTop > data.sumPrevious[index] + data.heights[index] - wHeight * data.options.shrinkStart){
				newHeight = data.heights[index] - data.options.shrinkHeight;
			} else {
				newHeight = data.heights[index];
			}
			$(this).height(newHeight);
		});
	}
	
    publicMethods = {
        init: init
    };

	$.fn.scrolloverlap = function (method) {
		if (publicMethods[method]) {
			return publicMethods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return publicMethods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.scrolloverlap');
		}
    };	
   
})(jQuery);
