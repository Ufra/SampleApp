var mob = window.mob || {};
window.addEventListener("load", function() { window.scrollTo(0, 1); });

$(document).ready(function(){
	window.scrollTo(0, 1);
	mob.validation.init();
	
});

mob.validation={
	init: function(){
		this.initForm();
		
		$('.pwdHelp').bind("click", this.togglePopupOverlay);
		
		$(".show_overlay").bind("click", mob.overlay.show);
		
		$('#mainContainer li a').bind('click', function(){
			$(this).closest('#mainContainer').hide();
			$('#'+this.href.split('#')[1]).removeClass('hide');
			$('#'+this.href.split('#')[1]).animate({left:'5'}, 400);
			// Attaching click event to cancel link at the bottom of each section...
			$("a[href='#cancel']").bind('click', function(){
				$(this).closest('section').addClass('hide');
				$('#mainContainer').show();
			});
		});
		
		$(".showPageOverlay").bind("click", this.pageOverlay);
		$(".showPageOverlay").bind("click", function(){
			var windowHt = $(window).height(),
				overlayHt = $(".pageOverlay").height(),
				scrollableHt = $(".chooseOne").height(),
				calculatedHt = parseInt(windowHt*.8);
			if(overlayHt > calculatedHt){
				$(".pageOverlay").css("height", calculatedHt+"px");
				$(".chooseOne").css("height", calculatedHt-36+"px");
			}
		});
		$(".chooseOne li label").bind('click', this.chooseOne);
		//$(".chooseOne input[type='radio']").change(this.chooseOne);
	},
	
	togglePopupOverlay: function(e){
		e.stopPropagation();
		var $popupOverlay = $('.popover');
		$popupOverlay.toggle();
		if($popupOverlay.is(':visible')){
			$('body').bind('click', mob.validation.hidePopupOverlay);
		}else{
			$('body').unbind('click');
		}
	},
	hidePopupOverlay: function(e){
		if($(e.target).closest('.popover').length ==0 || e.target.id == 'close'){
			$('.popover').hide();
			$('body').unbind('click');
		}
	},
	pageOverlay: function(e){
		mob.overlay.lightBox.showLightBox("section");
		$(".pageOverlay").removeClass("hide");
		$(".pageOverlay .reset").bind("click", function(){
			mob.overlay.lightBox.hideLightBox("section");
			$(".pageOverlay").addClass("hide");
		});
	},
	initForm: function(){
		String.prototype.validEmail = function(){
			//var filter = /^.+@.+\..{1,32}$/;
			var emailRegex = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
			if (emailRegex.test(this)) {
				return true;
			}else {
				return false;
			}
		};
		String.prototype.validPhone = function(){
			var phoneRegex = /^([+]{0,1})([0-9-]{8,18})$/;
			if (phoneRegex.test(this)) {
				return true;
			}else {
				return false;
			}
		};
		var $input = $('input'),
		i,
		newForm;
		for(i=0; i<$input.length; i++){
			newForm = new mob.form($input[i])	
		}
			
		$("#createPassword").bind("keyup", function(){
			var $helpSpan = $("#createPassword").closest("li").find("span.pwdHelp");
			$(this).val()!="" ? $helpSpan.addClass("hide") :$helpSpan.removeClass("hide");
		});
	},
	chooseOne: function(e){
		e.preventDefault();
		//alert("I am in chooseOne Method");
		$(this).closest('li').find("input[type='radio']").trigger('click');
		
		var $selectedQue =$(".pageOverlay").find("input[type='radio']:checked"),
		selText = $($selectedQue[0].nextElementSibling).text(),		
		eleId = $selectedQue.data("role"),
		$clonedEle = $("#"+eleId).closest("li"),
		$queParentLi = $(".showPageOverlay").closest("li");
		
		$(".pageOverlay").addClass("hide");
		mob.overlay.lightBox.hideLightBox("section");
		$(".showPageOverlay").val(selText);
		if($queParentLi.next().hasClass("withLabel")){
			$queParentLi.next().appendTo(".ansContainer ul");
		}
		$queParentLi.after($clonedEle.removeClass("hide"));
		//$(".showPageOverlay").closest("ul").find("input[type='submit']").validate();		//addClass("active")[0].disabled=false;
	}
};

mob.form = function(ele){
	this.ele = ele;
	this.init();
};

mob.form.prototype={
	init: function(){
		var input = this.ele,
		$input = $(input),
		iType = $input[0].type;
		//mob.form.errorBox = [];
		input.validate = this.validate;
		if(iType == 'email' || iType == 'password' || iType == 'tel' || iType == 'text'){
            $input.bind('focus', this.focus);
            $input.bind('blur', this.blur);
            $input.bind('keyup', this.keyUp);
			$input.bind('keydown', this.keyDown);
			$input.resetter = false;
		//	$input.resetter = new mob.form.resetter(input);
			
		//Binding functions for create password page.
			if((input.id == 'createPassword') || (input.id=='confirmPwd')){
				input.id == 'createPassword' ? input.fellowSibling = (confirmPwd) : input.fellowSibling = (createPassword);
				input.checkPasswordEntry = this.checkPasswordEntry;
			}
		}else if(iType == 'submit'){
			$input.bind("click",this.submit);
			$input.xhrNetworError = this.xhrNetworkError;
			$input.xhrDone = this.xhrDone;
			if ('ontouchstart' in window) {
				$input.bind('touchstart', this.mouseDown);
				$input.bind('touchend', this.mouseUp);
			} else {
				$input.bind('mousedown', this.mouseDown);
				$input.bind('mouseup', this.mouseUp);
			}
		}
	},
	mouseDown: function(event){
		//console.log("mouse down");
		//event.preventDefault();
		/*mob.overlay.showNativeOverlay({
			text: "Updating password please wait",
			btns:[	//{ text:"OK", action: function(){console.log('Ok Button Clicked');}, type:"primary"},
					{text:"Cancel", action: function(){console.log('Cancel Button clicked');}}
				],
			spinner: "no"
		});*/
		//return false;
	},
	mouseUp: function(){
	
	},
	focus: function(){
		$(this).closest('li').addClass('focus');
	},
	blur: function(e){
		$(this).closest('li').removeClass('focus');	
		if((this.id == 'confirmPwd')&& this.value!="" && !$(this).closest('li').find('.validPwd').is(':visible')){
			$(this).closest('li').find('.validPwd').addClass('invalidPwd').show();
		}
	},
	keyUp: function(){
		var $form = $(this).closest("form"),
			$inputs = $form.find("input"),
			ilen = $inputs.length,
			i;
			this.flag=false;

		for(i=0; i<ilen; i++){
			var input = $inputs[i],
			$input = $(input);
			iType = input.type,
			iVal = input.value;
			if(!this.flag && (iType=='email'|| iType=='number' || iType=='text' || iType=='tel' || iType == 'password')){
				iVal=="" ?	this.flag=true : this.flag = false;

				if(this.checkPasswordEntry){
					this.flag = this.checkPasswordEntry();
				}
			}
			if(iType == 'submit' || iType =='button'){
				if(this.flag){
					input.disabled=true;
					$input.removeClass("active");
				}else{
					input.disabled=false;
					$input.addClass("active");
				}
			}
		}
		if(!this.resetter){
			this.resetter = true;
			$resetter = $("<span class='reset'>x</span>");
			$resetter.insertAfter($(this));
			$resetter[0].ele = this;
			$resetter.bind("click", mob.resetter.click);
		}else if(!$resetter.is(":visible")){
			$resetter.show();
		
		}
		
	},
	keyDown: function(){
		
	}, 
	submit: function(e){
		e.preventDefault();
		/*
			you have to pass text which is gonna 
		*/
		mob.overlay.showNativeOverlay({
			text: "Updating password please wait"
		});
		if(this.validate()){
			if(mob.form.whichError!=''){
				$('#'+mob.form.whichError).removeClass('hide');
			}
			e.preventDefault();
			return ;
		}
		this.form.submit();
		return true;
	},
	validate: function(){
		var $form = $(this).closest("form"),
		$inputs = $form.find("input"),
		ilen = $inputs.length, i,
		flag = false;
		mob.form.whichError='';
		for(i=0; i<ilen; i++){
			var input = $inputs[i],
			$input = $(input),
			iType = input.type,
			iVal = input.value;
			if((iType=='email' && !iVal.validEmail()) || (iType=='tel' && !iVal.validPhone()) || (iVal=="" && ( iType=='number' || iType=='text'))){
				// This is an invalid input field
				flag=true;
				if(iType=='email'){
					mob.form.whichError='error-email';
				}else if(iType=='tel'){
					mob.form.whichError='error-tel';
				}
			}
			if(iType == 'submit' || iType =='button'){
				if(flag){
					input.disabled=true;
					$input.removeClass("active");
				}else{
					input.disabled=false;
					$input.addClass("active");
				}
			}
		}
		return flag; // flag true indicates some of the entry in invalid.
	},
	xhrNetworkError: function(){
		return true;
	},
	xhrDone: function(){
		return true;
	},
	checkPasswordEntry: function(){
		var pwdRegex = /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W]).*$/,
			$ticIcon = $(this).closest('li').find('.validPwd');
			
		if(this.id == 'createPassword'){
			var $fellowTicIcon = $(this.fellowSibling).closest('li').find('.validPwd');
			if($(this).val().match(pwdRegex)){
				$ticIcon.show();
				if(this.fellowSibling.value == this.value){
					$fellowTicIcon.removeClass('invalidPwd').show();
					return false;
				}else{
					$fellowTicIcon.addClass('invalidPwd');
					return true;	// true means input field is not valid
				}
			}else{
				$ticIcon.hide();
				$fellowTicIcon.addClass('invalidPwd');
				return true;
				
			}
		}else{
			if(!this.fellowSibling.value.match(pwdRegex) || this.value=="") {
				$ticIcon.removeClass('invalidPwd').hide();
				return true; 		// true means input field is not valid
			}else if(this.value == this.fellowSibling.value){
				$ticIcon.removeClass('invalidPwd').show();
				return false;
			}else if($ticIcon.is(':visible')){
				$ticIcon.addClass('invalidPwd');
				return true;
			}
		}
	}
};


mob.resetter = {
	click: function(){
		var input = this.ele;
		input.value = "";
		$(this).hide();
	}


};




mob.form.resetter = function (ele) {
    this.ele = ele;
    this.init();
};
mob.form.resetter.prototype = {
    init: function () {
		var input = this.ele,
		$input=$(input),
		resetter = input.nextElementSibling;
		resetter.ele = input;
		$resetter = $(resetter);
		$resetter.bind('click', this.click);
		$input.bind('keyup', this.toggleResetter);
	},
    toggleResetter: function(){
		if(this.value!=""){
			$(this.nextElementSibling).removeClass("hide");
		}else{
			$(this.nextElementSibling).addClass("hide");
		}
	},
    click: function () {
		$(this).addClass('hide');
        $(this.ele).val('').trigger('keyup');
    }
};


mob.overlay = {
	show: function(){
		$(".overlay").removeClass("hide");
		mob.overlay.lightBox.showLightBox("section")
		$(".overlay .cancel").bind("click", mob.overlay.hide);
		
		var top= window.innerHeight-$('.overlay').height()-10;
		$('.overlay').css('top', top+'px');
		
		$(window).bind('orientationchange', function(e){
			var top= window.innerHeight-$('.overlay').height()-10;
			$('.overlay').css('top', top+'px');
		});
		/*switch(window.orientation){
			case 0:
				top = $(window).height()
			currMode = "portrait";
			break;
			
			case -90:
			currMode = "landscape";
			break;
	 
			case 90:
			currMode = "landscape";
			break;
	 
			case 180:
			currMode = "landscape";
			break;
		}*/
	},
	
	hide: function(){
		$(".overlay").addClass("hide");
		mob.overlay.lightBox.hideLightBox("section")		
	},
	
	showNativeOverlay: function(obj){
		$('#nativePopup .text').text(obj.text);
		$('#nativePopup').show();
		if(!obj.spinner){
			$("#nativePopup .container").addClass('spinner').show();
		}else if((obj.btns) && (!$('.container input').is(':visible'))){
			
			//$("#nativePopup").css('height','25%');
			for(var i=0; i<obj.btns.length; i++){
				var $input = $("<input type='button' value="+obj.btns[i].text+"></input>");
				if(obj.btns.length==2 && i==0){
					$input.addClass('inline');
				}
				if(obj.btns[i].type == 'primary'){
					$input.addClass('primary');
					$input.bind('click', obj.btns[i].action);
				}else{
					$input.bind('click', function(){
						$('#nativePopup').hide();
					});
				}
				$input.appendTo($('#nativePopup .container')).show();
			}
		}
		console.log("Showing the iphone native dialogue box");
	}
};

mob.overlay.lightBox = {
	showLightBox: function(sel){
		$div = $("<div class='lightBox'></div>");
		$div.prependTo(sel);
	},
	
	hideLightBox: function(sel){
		$(sel).children(".lightBox").remove();
	}
};