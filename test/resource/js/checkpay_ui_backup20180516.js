var isIOS = function(){
	return navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
};

var btnTxtClear = {
	init:function(){
		this.inputWrap = $('.inputbox-m');
		this.elinput = this.inputWrap.find('input');
		this.btn = this.inputWrap.find('.btn-clear-text');
		this.textarea = jQuery('textarea');
		this.fixedBtn = jQuery('.fixed-bottom-section');
		this.fixedQuickBtn = jQuery('.btn-quick-write');
		this.addEvent();
	},
	addEvent:function(){
		this.set();
		this.elinput.change(function(){ btnTxtClear.elShow(jQuery(this)) });
		this.elinput.keydown(function(){ btnTxtClear.elShow(jQuery(this)) });
		this.elinput.keyup(function(){ btnTxtClear.elShow(jQuery(this)) });
		this.elinput.focusout(function(){ btnTxtClear.elHide(jQuery(this));  });
		this.btn.on('click',function(){ btnTxtClear.elDel(jQuery(this)) })
	},
	set:function(){
		this.elinput.each(function(){
			var _this = jQuery(this);
			if(_this.val()){
				_this.parent().find('.btn-clear-text').show(); 
				if(jQuery('.dummy-placeholder')){
					_this.parent().find('.dummy-placeholder').hide();
				}
			}
		});
	},
	elShow:function(paramtarget){
		var _this = paramtarget;
		var val = _this.val();
		if(val){_this.parent().find('.btn-clear-text').show();this.dummyHide(paramtarget);}
	},
	elHide:function(paramtarget){
		var _this = paramtarget;
		var val = _this.val();
		if(!val){_this.parent().find('.btn-clear-text').hide();this.dummyShow(paramtarget);}
	},
	elDel:function(parambtn){
		var _btnThis = parambtn;
		_btnThis.parent().find('input').val('');
		_btnThis.hide();
		this.dummyShow(parambtn);
	},
	dummyHide:function(target){
		var _this = target;
		if(_this.parent().find('.dummy-placeholder')){
			_this.parent().find('.dummy-placeholder').hide();
		}
	},
	dummyShow:function(target){
		var _this = target;
		if(_this.parent().find('.dummy-placeholder')){
			_this.parent().find('.dummy-placeholder').show();
		}
	}
};

var popPos = {
	init:function(paramPop){
		if(paramPop != null){
			this.popWrap = paramPop;
			this.pop = this.popWrap.find('.pop');
		}else{
			this.pop = jQuery('.pop');
		}
		this.popC = this.pop.height()/2;
		this.set();
	},
	set:function(){
		if(!this.pop.hasClass('pop-form')){
			this.pop.css('margin-top',-this.popC);
		}
	}
};

var scrollList = {
	init:function(){
		this.scrollList = jQuery('.scroll-list-section');
		this.header = jQuery('.header');
		this.searchzone = jQuery('.list-search-section');
		this.scrollHeightSet();
		
	},
	scrollHeightSet:function(){		
		var winHeight = jQuery(window).height();
		var slPrevEl = this.scrollList.prevAll();
		var sum = 0;
		slPrevEl.each(function(){
			var elHeight = Number(jQuery(this).outerHeight(true));
			sum += elHeight;
		});
		var prevAllHeight = sum + this.header.outerHeight(true); 
		var scrollHeight = winHeight - prevAllHeight;
		this.scrollList.css('height', scrollHeight);
	},
};
function dataToggle(param){
	var _this = $(param);
	var _thisP = _this.parents('.list-search-section')
	_this.hasClass('bst-show') ? _this.removeClass('bst-show') : _this.addClass('bst-show');
	_thisP.hasClass('search-off') ?_thisP.removeClass('search-off') : _thisP.addClass('search-off');
	scrollList.scrollHeightSet();
	
}
var floatingHeader ={
	init:function(){
		this.fh = jQuery('.floating-back-header');
		this.fhOnlyHeight = 45; // step으로 나눠져 있어서 header가 여러개라 고정으로 넣음. 헤더만 내려올 때 높이값
		this.fhFmHeight = 90;// header + floating-menu 높이값
		this.fhHeight = this.fh.find('.floating-menu').length > 0 ? this.fhFmHeight : this.fhOnlyHeight; // 
		this.addEvent();
	},
	addEvent:function(){
		if(isIOS() && this.fh){
			this.fh.addClass('floating-sticky');
		}else if(!isIOS() && this.fh){
			floatingHeader.fhActvie(jQuery(this))
		}
	},
	fhActvie:function(paramtarget){
		var _this = paramtarget;
			jQuery('.content').css('padding-top',this.fhHeight);
			this.fh.addClass('floating-fixed');
	}
};

var btnFixed = {
		init:function(){
			this.fixedBtn = jQuery('.fixed-bottom-section');
			this.fixedQuickBtn = jQuery('.btn-quick-write');
			this.set();
		},
		set:function(){
			var winHeight = jQuery(window).height();
			
			var fixedBtnHeight = jQuery(".btn-submit").height();
			this.fixedBtn.css({'position':'fixed', 'top': winHeight-fixedBtnHeight + 'px'});
			
			var fixedQuickBtnHeight = jQuery('.btn-quick-write').height();
			this.fixedQuickBtn.css({'position':'fixed', 'top': winHeight-fixedQuickBtnHeight-10 + 'px'});
		}
	};


window.onload = function() {
	popPos.init();
	floatingHeader.init();
	btnTxtClear.init();
	var intro = {
		init:function(){
			this.mySwipe.init();
		},
		mySwipe : {
			init: function(){
        				this.pagerLength = jQuery('.intro-swipe').find('.intro-pager a').length;
		           		this.setSwipe();
			 },
        			setSwipe: function(){
            				this.mytripswipe = new Swipe(jQuery('.intro-swipe')[0], {
                				auto:false, speed:500, continuous: false, startSlide:0, disableScroll: false,
			                	callback: function(index, elem){
						jQuery('.intro-swipe').find('.intro-pager a').removeClass('on');
						jQuery('.intro-swipe').find('.intro-pager a').eq(index).addClass('on');
						if(!jQuery('.intro-swipe').hasClass('set-info') && index == 0){
							jQuery('.intro-swipe').find('.intro-controls').find('.ic-prev').hide();
		        				}else if(index == intro.mySwipe.pagerLength-1){
							jQuery('.intro-swipe').find('.intro-controls').find('.ic-next').hide();
		        				}else{
		        					jQuery('.intro-swipe').find('.intro-controls').find('.ic-prev').show();
		        					jQuery('.intro-swipe').find('.intro-controls').find('.ic-next').show();
		        				}
			                	}
            				});
				jQuery('.intro-swipe').find('.intro-pager a').click(function(){
					var spIndex = jQuery(this).index();
					intro.mySwipe.mytripswipe.slide(spIndex);
				});
				jQuery('.intro-swipe').find('.intro-controls .ic-prev').click(function(){
					intro.mySwipe.mytripswipe.prev();
				});
				jQuery('.intro-swipe').find('.intro-controls .ic-next').click(function(){
					intro.mySwipe.mytripswipe.next();
				});
				if(jQuery('.intro-swipe').find('.intro-pager').find('.on').index() == 0){
					jQuery('.intro-swipe').find('.intro-controls').find('.ic-prev').hide();
        				}
			}
		}
	}
	intro.init();

	var chkSelectBox = {
		init:function(){
			this.box = jQuery('.payment-box');
			this.radio = this.box.find("input[type='radio']");
			this.addEvent();
		},
		addEvent: function(){
			this.radio.on('click', function(){ chkSelectBox.active(jQuery(this)); });
		},
		active: function(paramtarget){
			var _this = paramtarget;
			var _thisBox = _this.parent().parent('.payment-box');
			this.box.removeClass('payment-select-box');
			_thisBox.addClass('payment-select-box');
		}
	};
	chkSelectBox.init();	

	var boardAccordion = {
		init:function(){
			this.baWrap = jQuery('.board-accordion');
			this.baBtn = this.baWrap.find('button');
			this.addEvent();
		},
		addEvent:function(){
			jQuery(document).on('click','.board-accordion button', function(){ boardAccordion.baActive(jQuery(this))});
		},
		baActive:function(paramtarget){
			var _this = paramtarget;
			if(_this.next('.answer')){
				if(_this.parent().hasClass('answer-on')){
					_this.parent().removeClass('answer-on');
					_this.next('.answer').slideUp();
				}else{
					_this.parent().addClass('answer-on');
					_this.next('.answer').slideDown();
				}
			}
			
		}
	};
	boardAccordion.init();

	var calendarHeight = {
		init:function(){
			this.calendarCell = jQuery('.calendar-table').find('tbody').find('td');
			this.cellW = this.calendarCell.width();
			this.calendarCell.css('height',this.cellW);
		}
	};
	calendarHeight.init();

	var tabCont = {
		init:function(tab, cont){
			this.tab = jQuery('.'+ tab).children('li').children('button');
			this.cont = jQuery('.' + cont);
			this.addEvent(cont);
		},
		addEvent:function(tcCont){
			this.tab.on('click', function(){ tabCont.tcActive(jQuery(this), tcCont)})
		},
		tcActive:function(paramtarget, paramcont){
			var _this = paramtarget;
			var idx = _this.parent().index();
			var thisTabConts = _this.parent().parent().parent().find('.'+paramcont);
			_this.parent().parent().children('li').removeClass('on');
			_this.parent().addClass('on');
			thisTabConts.hide();
			thisTabConts.eq(idx).show();
		}
	};
	tabCont.init('tcs-tab', 'tcs-ct');
	tabCont.init('blp-tab', 'blp-cont');

	var selectM ={
		init:function(){
			this.defaultBtn = jQuery('.sds-default');
			this.closeBtn = jQuery('.sds-close');
			this.listWrap = jQuery('.sds-list-wrap');
			this.listBtn = jQuery('.sds-list').find('button');
			this.valInput= jQuery('.sds-value')
			this.addEvent();
		},
		addEvent:function(){
			this.defaultBtn.on('click', function(){selectM.smShow(jQuery(this)) })
			this.closeBtn.on('click', function(){selectM.smHide(jQuery(this)) })
			this.listBtn.on('click', function(){selectM.smSel(jQuery(this)) })
		},
		smShow:function(paramtarget){
			var _this = paramtarget;
			if(_this.parent().hasClass('sds-on-style')){
				_this.parent().removeClass('sds-on-style');
			}else{
				$('.select-d-section').removeClass('sds-on-style');
				_this.parent().addClass('sds-on-style');
			}
		},
		smHide:function(paramtarget){
			var _this = paramtarget;
			_this.parent().parent().removeClass('sds-on-style');
		},
		smSel:function(paramtarget){
			var _this = paramtarget;
			var _thisText = _this.text();
			var _thisVal = _this.val();
			var _thisSection = _this.parent().parent().parent().parent();
			_thisSection.find('.sds-default').text(_thisText);
			_thisSection.find('.sds-value').val(_thisVal);
			_thisSection.removeClass('sds-on-style');
		}
	}
	selectM.init();

	var completeMove = {
		init:function(){
			this.el = jQuery('.btn-complete').find('span');
			this.set();
		},
		set:function(){
			setInterval(function(){completeMove.change()}, 1000);
		},
		change:function(){

			if(this.el.hasClass('bg-bc')){
				this.el.removeClass('bg-bc');
				this.el.addClass('bg-bc-on');
			}else if(this.el.hasClass('bg-bc-on')){
				this.el.removeClass('bg-bc-on');
				this.el.addClass('bg-bc');
			}
		}
	}
	completeMove.init();
	
	btnFixed.init();
};