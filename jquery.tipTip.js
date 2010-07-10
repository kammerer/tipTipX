 /*
 * TipTip
 * Copyright 2010 Drew Wilson
 * www.drewwilson.com
 * code.drewwilson.com/entry/tiptip-jquery-plugin
 *
 * Version 1.3   -   Updated: Mar. 23, 2010
 *
 * This Plug-In will create a custom tooltip to replace the default
 * browser tooltip. It is extremely lightweight and very smart in
 * that it detects the edges of the browser window and will make sure
 * the tooltip stays within the current window size. As a result the
 * tooltip will adjust itself to be displayed above, below, to the left 
 * or to the right depending on what is necessary to stay within the
 * browser window. It is completely customizable as well via CSS.
 *
 * This TipTip jQuery plug-in is dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($){
  function TipTip(elements, options) {
		var defaults = { 
      suffix: "default",
			activation: "hover",
			keepAlive: false,
			maxWidth: "600px",
			edgeOffset: 8,
			defaultPosition: "bottom",
			delay: 400,
			fadeIn: 200,
			fadeOut: 200,
			attribute: "title",
			content: false, // HTML or String to fill TipTIp with
		  enter: function(){},
		  exit: function(){}
	  };

	 	this.opts = $.extend(defaults, options);
    this.elements = elements;
  
    var suffix = this.opts.suffix;

	 	// Setup tip tip elements and render them to the DOM
	 	if ($("#tiptip_holder-" + suffix).length <= 0) {
	 		this.tiptip_holder = $('<div class="tiptip_holder" id="tiptip_holder-' + suffix + '" style="max-width:'+ this.opts.maxWidth +';"></div>');
			this.tiptip_content = $('<div class="tiptip_content" id="tiptip_content-' + suffix + '"></div>');
			this.tiptip_arrow = $('<div class="tiptip_arrow" id="tiptip_arrow-' + suffix + '"></div>');
			$("body").append(this.tiptip_holder.html(this.tiptip_content).prepend(this.tiptip_arrow.html('<div class="tiptip_arrow_inner" id="tiptip_arrow_inner-' + suffix + '"></div>')));
		} else {
			this.tiptip_holder = $("#tiptip_holder-" + suffix);
			this.tiptip_content = $("#tiptip_content-" + suffix);
			this.tiptip_arrow = $("#tiptip_arrow-" + suffix);
		};
  };

  TipTip.prototype.showNow = function(title) {
    var that = this;
		$(this.elements).each(function() {
			var org_elem = $(this);
      var timeout = false;
      that.activate_tiptip(org_elem, title, timeout);
    });
  };

  TipTip.prototype.clearNow = function() {
    var that = this;
		$(this.elements).each(function() {
			var org_elem = $(this);
      var timeout = false;
      that.deactivate_tiptip(timeout);
    });
  };

  TipTip.prototype.setup = function() {
    var that = this;
		$(this.elements).each(function() {
			var org_elem = $(this);
			if(that.opts.content){
				var org_title = that.opts.content;
			} else {
				var org_title = org_elem.attr(that.opts.attribute);
			};

			if(org_title != ""){
				if(!that.opts.content){
					org_elem.removeAttr(that.opts.attribute); //remove original Attribute
				}

				var timeout = false;

				if(that.opts.activation == "hover"){
					org_elem.hover(function(){
						that.activate_tiptip(org_elem, org_title, timeout);
					}, function(){
						if(!that.opts.keepAlive){
							that.deactivate_tiptip(timeout);
						}
					});
					if(that.opts.keepAlive){
						tiptip_holder.hover(function(){}, function(){
							that.deactivate_tiptip(timeout);
						});
					}
				} else if(that.opts.activation == "focus"){
					org_elem.focus(function(){
						that.activate_tiptip(org_elem, org_title, timeout);
					}).blur(function(){
            that.deactivate_tiptip(timeout);
					});
				} else if(that.opts.activation == "click"){
					org_elem.click(function(){
						that.activate_tiptip(org_elem, org_title, timeout);
						return false;
					}).hover(function(){},function(){
						if(!that.opts.keepAlive){
							that.deactivate_tiptip(timeout);
						}
					});
					if(that.opts.keepAlive){
						tiptip_holder.hover(function(){}, function(){
							that.deactivate_tiptip(timeout);
						});
					}
				}
			}				
		});
  };

  TipTip.prototype.remove_position_classes = function() {
    this.tiptip_holder.removeClass("tip_left tip_right tip_top tip_bottom tip_left_top tip_left_bottom tip_right_top tip_right_bottom");
  };

  /* @private */
  TipTip.prototype.activate_tiptip = function(org_elem, org_title, timeout) {
    this.tiptip_content.html(org_title);
    this.tiptip_holder.hide().css("margin","0");
    this.remove_position_classes();
    this.tiptip_arrow.removeAttr("style");

    this.opts.enter.call(this, this.tiptip_content);

    var top = parseInt(org_elem.offset()['top']);
    var left = parseInt(org_elem.offset()['left']);
    var org_width = parseInt(org_elem.outerWidth());
    var org_height = parseInt(org_elem.outerHeight());
    var tip_w = this.tiptip_holder.outerWidth();
    var tip_h = this.tiptip_holder.outerHeight();
    var w_compare = Math.round((org_width - tip_w) / 2);
    var h_compare = Math.round((org_height - tip_h) / 2);
    var marg_left = Math.round(left + w_compare);
    var marg_top = Math.round(top + org_height + this.opts.edgeOffset);
    var t_class = "";
    var arrow_top = "";
    var arrow_left = Math.round(tip_w - 12) / 2;

    if(this.opts.position) {
      t_class = "_" + this.opts.position;
    }
    else if(this.opts.defaultPosition == "bottom") {
      t_class = "_bottom";
    } else if(this.opts.defaultPosition == "top") { 
      t_class = "_top";
    } else if(this.opts.defaultPosition == "left") {
      t_class = "_left";
    } else if(this.opts.defaultPosition == "right") {
      t_class = "_right";
    }

    var right_compare = (w_compare + left) < parseInt($(window).scrollLeft());
    var left_compare = (tip_w + left) > parseInt($(window).width());

    if(this.opts.position == "right" || (! ["left", "right"].include(this.opts.position) && ((right_compare && w_compare < 0) || (t_class == "_right" && !left_compare) || (t_class == "_left" && left < (tip_w + this.opts.edgeOffset + 5))))) { 
      t_class = "_right";
      arrow_top = Math.round(tip_h - 13) / 2;
      arrow_left = -12;
      marg_left = Math.round(left + org_width + this.opts.edgeOffset);
      marg_top = Math.round(top + h_compare);
    } else if(this.opts.position == "left" || (! ["left", "right"].include(this.opts.position) && ((left_compare && w_compare < 0) || (t_class == "_left" && !right_compare)))) {
      t_class = "_left";
      arrow_top = Math.round(tip_h - 13) / 2;
      arrow_left =  Math.round(tip_w);
      marg_left = Math.round(left - (tip_w + this.opts.edgeOffset + 5));
      marg_top = Math.round(top + h_compare);
    }

    var top_compare = (top + org_height + this.opts.edgeOffset + tip_h + 8) > parseInt($(window).height() + $(window).scrollTop());
    var bottom_compare = ((top + org_height) - (this.opts.edgeOffset + tip_h + 8)) < 0;

    if(top_compare || (t_class == "_bottom" && top_compare) || (t_class == "_top" && !bottom_compare)){
      if(t_class == "_top" || t_class == "_bottom"){
        t_class = "_top";
      } else {
        t_class = t_class+"_top";
      }
      arrow_top = tip_h;
      marg_top = Math.round(top - (tip_h + 5 + this.opts.edgeOffset));
    } else if(bottom_compare | (t_class == "_top" && bottom_compare) || (t_class == "_bottom" && !top_compare)){
      if(t_class == "_top" || t_class == "_bottom"){
        t_class = "_bottom";
      } else {
        t_class = t_class+"_bottom";
      }
      arrow_top = -12;						
      marg_top = Math.round(top + org_height + this.opts.edgeOffset);
    }

    if(t_class == "_right_top" || t_class == "_left_top"){
      marg_top = marg_top + 5;
    } else if(t_class == "_right_bottom" || t_class == "_left_bottom"){		
      marg_top = marg_top - 5;
    }
    if(t_class == "_left_top" || t_class == "_left_bottom"){	
      marg_left = marg_left + 5;
    }
    this.tiptip_arrow.css({"margin-left": arrow_left+"px", "margin-top": arrow_top+"px"});
    this.tiptip_holder.css({"margin-left": marg_left+"px", "margin-top": marg_top+"px"}).addClass("tip"+t_class);

    if (timeout){ clearTimeout(timeout); }

    var that = this;
    timeout = setTimeout(function(){ that.tiptip_holder.stop(true,true).fadeIn(that.opts.fadeIn); }, that.opts.delay);	
  };

  /* @private */
  TipTip.prototype.deactivate_tiptip = function(timeout) {
    this.opts.exit.call(this, this.tiptip_content);
    if (timeout){ clearTimeout(timeout); }
    this.tiptip_holder.fadeOut(this.opts.fadeOut);
  };

	$.fn.tipTip = function(options) {
    (new TipTip(this, options)).setup();
	  return this; 	
	};

  $.fn.tipTipNow = function(content, options) {
    (new TipTip(this, options)).showNow(content);
    return this;
  };

  $.fn.tipTipClear = function(options) {
    (new TipTip(this, options)).clearNow();
    return this;
  };

})(jQuery);  	
