/*
 * Copyright (c) 2008-2013 Michal Wojciechowski, http://odyniec.net/
 */
(function($){var abs=Math.abs,max=Math.max,min=Math.min,round=Math.round;function div(){return $('<div/>')}$.imgAreaSelect=function(img,options){var $img=$(img),imgLoaded,$box=div(),$area=div(),$border=div().add(div()).add(div()).add(div()),$outer=div().add(div()).add(div()).add(div()),$handles=$([]),$areaOpera,left,top,imgOfs={left:0,top:0},imgWidth,imgHeight,$parent,parOfs={left:0,top:0},zIndex=0,position='absolute',startX,startY,scaleX,scaleY,resize,minWidth,minHeight,maxWidth,maxHeight,aspectRatio,shown,x1,y1,x2,y2,selection={x1:0,y1:0,x2:0,y2:0,width:0,height:0},docElem=document.documentElement,ua=navigator.userAgent,$p,d,i,o,w,h,adjusted;function viewX(x){return x+imgOfs.left-parOfs.left}function viewY(y){return y+imgOfs.top-parOfs.top}function selX(x){return x-imgOfs.left+parOfs.left}function selY(y){return y-imgOfs.top+parOfs.top}function evX(event){return event.pageX-parOfs.left}function evY(event){return event.pageY-parOfs.top}function getSelection(noScale){var sx=noScale||scaleX,sy=noScale||scaleY;return{x1:round(selection.x1*sx),y1:round(selection.y1*sy),x2:round(selection.x2*sx),y2:round(selection.y2*sy),width:round(selection.x2*sx)-round(selection.x1*sx),height:round(selection.y2*sy)-round(selection.y1*sy)}}function setSelection(x1,y1,x2,y2,noScale){var sx=noScale||scaleX,sy=noScale||scaleY;selection={x1:round(x1/sx||0),y1:round(y1/sy||0),x2:round(x2/sx||0),y2:round(y2/sy||0)};selection.width=selection.x2-selection.x1;selection.height=selection.y2-selection.y1}function adjust(){if(!imgLoaded||!$img.width())return;imgOfs={left:round($img.offset().left),top:round($img.offset().top)};imgWidth=$img.innerWidth();imgHeight=$img.innerHeight();imgOfs.top+=($img.outerHeight()-imgHeight)>>1;imgOfs.left+=($img.outerWidth()-imgWidth)>>1;minWidth=round(options.minWidth/scaleX)||0;minHeight=round(options.minHeight/scaleY)||0;maxWidth=round(min(options.maxWidth/scaleX||1<<24,imgWidth));maxHeight=round(min(options.maxHeight/scaleY||1<<24,imgHeight));if($().jquery=='1.3.2'&&position=='fixed'&&!docElem['getBoundingClientRect']){imgOfs.top+=max(document.body.scrollTop,docElem.scrollTop);imgOfs.left+=max(document.body.scrollLeft,docElem.scrollLeft)}parOfs=/absolute|relative/.test($parent.css('position'))?{left:round($parent.offset().left)-$parent.scrollLeft(),top:round($parent.offset().top)-$parent.scrollTop()}:position=='fixed'?{left:$(document).scrollLeft(),top:$(document).scrollTop()}:{left:0,top:0};left=viewX(0);top=viewY(0);if(selection.x2>imgWidth||selection.y2>imgHeight)doResize()}function update(resetKeyPress){if(!shown)return;$box.css({left:viewX(selection.x1),top:viewY(selection.y1)}).add($area).width(w=selection.width).height(h=selection.height);$area.add($border).add($handles).css({left:0,top:0});$border.width(max(w-$border.outerWidth()+$border.innerWidth(),0)).height(max(h-$border.outerHeight()+$border.innerHeight(),0));$($outer[0]).css({left:left,top:top,width:selection.x1,height:imgHeight});$($outer[1]).css({left:left+selection.x1,top:top,width:w,height:selection.y1});$($outer[2]).css({left:left+selection.x2,top:top,width:imgWidth-selection.x2,height:imgHeight});$($outer[3]).css({left:left+selection.x1,top:top+selection.y2,width:w,height:imgHeight-selection.y2});w-=$handles.outerWidth();h-=$handles.outerHeight();switch($handles.length){case 8:$($handles[4]).css({left:w>>1});$($handles[5]).css({left:w,top:h>>1});$($handles[6]).css({left:w>>1,top:h});$($handles[7]).css({top:h>>1});case 4:$handles.slice(1,3).css({left:w});$handles.slice(2,4).css({top:h})}if(resetKeyPress!==false){if($.imgAreaSelect.onKeyPress!=docKeyPress)$(document).unbind($.imgAreaSelect.keyPress,$.imgAreaSelect.onKeyPress);if(options.keys)$(document)[$.imgAreaSelect.keyPress]($.imgAreaSelect.onKeyPress=docKeyPress)}if(msie&&$border.outerWidth()-$border.innerWidth()==2){$border.css('margin',0);setTimeout(function(){$border.css('margin','auto')},0)}}function doUpdate(resetKeyPress){adjust();update(resetKeyPress);x1=viewX(selection.x1);y1=viewY(selection.y1);x2=viewX(selection.x2);y2=viewY(selection.y2)}function hide($elem,fn){options.fadeSpeed?$elem.fadeOut(options.fadeSpeed,fn):$elem.hide()}function areaMouseMove(event){var x=selX(evX(event))-selection.x1,y=selY(evY(event))-selection.y1;if(!adjusted){adjust();adjusted=true;$box.one('mouseout',function(){adjusted=false})}resize='';if(options.resizable){if(y<=options.resizeMargin)resize='n';else if(y>=selection.height-options.resizeMargin)resize='s';if(x<=options.resizeMargin)resize+='w';else if(x>=selection.width-options.resizeMargin)resize+='e'}$box.css('cursor',resize?resize+'-resize':options.movable?'move':'');if($areaOpera)$areaOpera.toggle()}function docMouseUp(event){$('body').css('cursor','');if(options.autoHide||selection.width*selection.height==0)hide($box.add($outer),function(){$(this).hide()});$(document).unbind('mousemove',selectingMouseMove);$box.mousemove(areaMouseMove);options.onSelectEnd(img,getSelection())}function areaMouseDown(event){if(event.which!=1)return false;adjust();if(resize){$('body').css('cursor',resize+'-resize');x1=viewX(selection[/w/.test(resize)?'x2':'x1']);y1=viewY(selection[/n/.test(resize)?'y2':'y1']);$(document).mousemove(selectingMouseMove).one('mouseup',docMouseUp);$box.unbind('mousemove',areaMouseMove)}else if(options.movable){startX=left+selection.x1-evX(event);startY=top+selection.y1-evY(event);$box.unbind('mousemove',areaMouseMove);$(document).mousemove(movingMouseMove).one('mouseup',function(){options.onSelectEnd(img,getSelection());$(document).unbind('mousemove',movingMouseMove);$box.mousemove(areaMouseMove)})}else $img.mousedown(event);return false}function fixAspectRatio(xFirst){if(aspectRatio)if(xFirst){x2=max(left,min(left+imgWidth,x1+abs(y2-y1)*aspectRatio*(x2>x1||-1)));y2=round(max(top,min(top+imgHeight,y1+abs(x2-x1)/aspectRatio*(y2>y1||-1))));x2=round(x2)}else{y2=max(top,min(top+imgHeight,y1+abs(x2-x1)/aspectRatio*(y2>y1||-1)));x2=round(max(left,min(left+imgWidth,x1+abs(y2-y1)*aspectRatio*(x2>x1||-1))));y2=round(y2)}}function doResize(){x1=min(x1,left+imgWidth);y1=min(y1,top+imgHeight);if(abs(x2-x1)<minWidth){x2=x1-minWidth*(x2<x1||-1);if(x2<left)x1=left+minWidth;else if(x2>left+imgWidth)x1=left+imgWidth-minWidth}if(abs(y2-y1)<minHeight){y2=y1-minHeight*(y2<y1||-1);if(y2<top)y1=top+minHeight;else if(y2>top+imgHeight)y1=top+imgHeight-minHeight}x2=max(left,min(x2,left+imgWidth));y2=max(top,min(y2,top+imgHeight));fixAspectRatio(abs(x2-x1)<abs(y2-y1)*aspectRatio);if(abs(x2-x1)>maxWidth){x2=x1-maxWidth*(x2<x1||-1);fixAspectRatio()}if(abs(y2-y1)>maxHeight){y2=y1-maxHeight*(y2<y1||-1);fixAspectRatio(true)}selection={x1:selX(min(x1,x2)),x2:selX(max(x1,x2)),y1:selY(min(y1,y2)),y2:selY(max(y1,y2)),width:abs(x2-x1),height:abs(y2-y1)};update();options.onSelectChange(img,getSelection())}function selectingMouseMove(event){x2=/w|e|^$/.test(resize)||aspectRatio?evX(event):viewX(selection.x2);y2=/n|s|^$/.test(resize)||aspectRatio?evY(event):viewY(selection.y2);doResize();return false}function doMove(newX1,newY1){x2=(x1=newX1)+selection.width;y2=(y1=newY1)+selection.height;$.extend(selection,{x1:selX(x1),y1:selY(y1),x2:selX(x2),y2:selY(y2)});update();options.onSelectChange(img,getSelection())}function movingMouseMove(event){x1=max(left,min(startX+evX(event),left+imgWidth-selection.width));y1=max(top,min(startY+evY(event),top+imgHeight-selection.height));doMove(x1,y1);event.preventDefault();return false}function startSelection(){$(document).unbind('mousemove',startSelection);adjust();x2=x1;y2=y1;doResize();resize='';if(!$outer.is(':visible'))$box.add($outer).hide().fadeIn(options.fadeSpeed||0);shown=true;$(document).unbind('mouseup',cancelSelection).mousemove(selectingMouseMove).one('mouseup',docMouseUp);$box.unbind('mousemove',areaMouseMove);options.onSelectStart(img,getSelection())}function cancelSelection(){$(document).unbind('mousemove',startSelection).unbind('mouseup',cancelSelection);hide($box.add($outer));setSelection(selX(x1),selY(y1),selX(x1),selY(y1));if(!(this instanceof $.imgAreaSelect)){options.onSelectChange(img,getSelection());options.onSelectEnd(img,getSelection())}}function imgMouseDown(event){if(event.which!=1||$outer.is(':animated'))return false;adjust();startX=x1=evX(event);startY=y1=evY(event);$(document).mousemove(startSelection).mouseup(cancelSelection);return false}function windowResize(){doUpdate(false)}function imgLoad(){imgLoaded=true;setOptions(options=$.extend({classPrefix:'imgareaselect',movable:true,parent:'body',resizable:true,resizeMargin:10,onInit:function(){},onSelectStart:function(){},onSelectChange:function(){},onSelectEnd:function(){}},options));$box.add($outer).css({visibility:''});if(options.show){shown=true;adjust();update();$box.add($outer).hide().fadeIn(options.fadeSpeed||0)}setTimeout(function(){options.onInit(img,getSelection())},0)}var docKeyPress=function(event){var k=options.keys,d,t,key=event.keyCode;d=!isNaN(k.alt)&&(event.altKey||event.originalEvent.altKey)?k.alt:!isNaN(k.ctrl)&&event.ctrlKey?k.ctrl:!isNaN(k.shift)&&event.shiftKey?k.shift:!isNaN(k.arrows)?k.arrows:10;if(k.arrows=='resize'||(k.shift=='resize'&&event.shiftKey)||(k.ctrl=='resize'&&event.ctrlKey)||(k.alt=='resize'&&(event.altKey||event.originalEvent.altKey))){switch(key){case 37:d=-d;case 39:t=max(x1,x2);x1=min(x1,x2);x2=max(t+d,x1);fixAspectRatio();break;case 38:d=-d;case 40:t=max(y1,y2);y1=min(y1,y2);y2=max(t+d,y1);fixAspectRatio(true);break;default:return}doResize()}else{x1=min(x1,x2);y1=min(y1,y2);switch(key){case 37:doMove(max(x1-d,left),y1);break;case 38:doMove(x1,max(y1-d,top));break;case 39:doMove(x1+min(d,imgWidth-selX(x2)),y1);break;case 40:doMove(x1,y1+min(d,imgHeight-selY(y2)));break;default:return}}return false};function styleOptions($elem,props){for(var option in props)if(options[option]!==undefined)$elem.css(props[option],options[option])}function setOptions(newOptions){if(newOptions.parent)($parent=$(newOptions.parent)).append($box.add($outer));$.extend(options,newOptions);adjust();if(newOptions.handles!=null){$handles.remove();$handles=$([]);i=newOptions.handles?newOptions.handles=='corners'?4:8:0;while(i--)$handles=$handles.add(div());$handles.addClass(options.classPrefix+'-handle').css({position:'absolute',fontSize:0,zIndex:zIndex+1||1});if(!parseInt($handles.css('width'))>=0)$handles.width(5).height(5);if(o=options.borderWidth)$handles.css({borderWidth:o,borderStyle:'solid'});styleOptions($handles,{borderColor1:'border-color',borderColor2:'background-color',borderOpacity:'opacity'})}scaleX=options.imageWidth/imgWidth||1;scaleY=options.imageHeight/imgHeight||1;if(newOptions.x1!=null){setSelection(newOptions.x1,newOptions.y1,newOptions.x2,newOptions.y2);newOptions.show=!newOptions.hide}if(newOptions.keys)options.keys=$.extend({shift:1,ctrl:'resize'},newOptions.keys);$outer.addClass(options.classPrefix+'-outer');$area.addClass(options.classPrefix+'-selection');for(i=0;i++<4;)$($border[i-1]).addClass(options.classPrefix+'-border'+i);styleOptions($area,{selectionColor:'background-color',selectionOpacity:'opacity'});styleOptions($border,{borderOpacity:'opacity',borderWidth:'border-width'});styleOptions($outer,{outerColor:'background-color',outerOpacity:'opacity'});if(o=options.borderColor1)$($border[0]).css({borderStyle:'solid',borderColor:o});if(o=options.borderColor2)$($border[1]).css({borderStyle:'dashed',borderColor:o});$box.append($area.add($border).add($areaOpera)).append($handles);if(msie){if(o=($outer.css('filter')||'').match(/opacity=(\d+)/))$outer.css('opacity',o[1]/100);if(o=($border.css('filter')||'').match(/opacity=(\d+)/))$border.css('opacity',o[1]/100)}if(newOptions.hide)hide($box.add($outer));else if(newOptions.show&&imgLoaded){shown=true;$box.add($outer).fadeIn(options.fadeSpeed||0);doUpdate()}aspectRatio=(d=(options.aspectRatio||'').split(/:/))[0]/d[1];$img.add($outer).unbind('mousedown',imgMouseDown);if(options.disable||options.enable===false){$box.unbind('mousemove',areaMouseMove).unbind('mousedown',areaMouseDown);$(window).unbind('resize',windowResize)}else{if(options.enable||options.disable===false){if(options.resizable||options.movable)$box.mousemove(areaMouseMove).mousedown(areaMouseDown);$(window).resize(windowResize)}if(!options.persistent)$img.add($outer).mousedown(imgMouseDown)}options.enable=options.disable=undefined}this.remove=function(){setOptions({disable:true});$box.add($outer).remove()};this.getOptions=function(){return options};this.setOptions=setOptions;this.getSelection=getSelection;this.setSelection=setSelection;this.cancelSelection=cancelSelection;this.update=doUpdate;var msie=(/msie ([\w.]+)/i.exec(ua)||[])[1],opera=/opera/i.test(ua),safari=/webkit/i.test(ua)&&!/chrome/i.test(ua);$p=$img;while($p.length){zIndex=max(zIndex,!isNaN($p.css('z-index'))?$p.css('z-index'):zIndex);if($p.css('position')=='fixed')position='fixed';$p=$p.parent(':not(body)')}zIndex=options.zIndex||zIndex;if(msie)$img.attr('unselectable','on');$.imgAreaSelect.keyPress=msie||safari?'keydown':'keypress';if(opera)$areaOpera=div().css({width:'100%',height:'100%',position:'absolute',zIndex:zIndex+2||2});$box.add($outer).css({visibility:'hidden',position:position,overflow:'hidden',zIndex:zIndex||'0'});$box.css({zIndex:zIndex+2||2});$area.add($border).css({position:'absolute',fontSize:0});img.complete||img.readyState=='complete'||!$img.is('img')?imgLoad():$img.one('load',imgLoad);if(!imgLoaded&&msie&&msie>=7)img.src=img.src};$.fn.imgAreaSelect=function(options){options=options||{};this.each(function(){if($(this).data('imgAreaSelect')){if(options.remove){$(this).data('imgAreaSelect').remove();$(this).removeData('imgAreaSelect')}else $(this).data('imgAreaSelect').setOptions(options)}else if(!options.remove){if(options.enable===undefined&&options.disable===undefined)options.enable=true;$(this).data('imgAreaSelect',new $.imgAreaSelect(this,options))}});if(options.instance)return $(this).data('imgAreaSelect');return this}})(jQuery);

/*
 * Custom JS jQmap
 */
(function(){
	
	var jQmap = {
		
		$el: function (){
		
			jQmap.$parent			= $('#jQmap');
			jQmap.$thumb     	    = $('#jQmap-thumb');
			jQmap.$showcase  	    = $('.jQmap-showcase');

			// @tools ( top button )

			jQmap.$tools	  	    = $('.jQmap-tools');
			jQmap.$tCreateMap     	= $('#t-createArea');
			jQmap.$tSave 		    = $('#t-save');
			jQmap.$tHTML			= $('#t-html');

			// @PopUp ( button + event & forma )
			
			jQmap.$popup          	= $('.jQpup');
			jQmap.$popupOverview	= $('.jQpup-overview');
			jQmap.$popupClose     	= $('.jQpup .attr-popup-close, .jQpup-overview');
			jQmap.$popupButtons 	= $('.jQpup .form-button');

			// @PopUp formas
				
			jQmap.$formaURL 		= $('#popup-URL');	   		 	// text
			jQmap.$formaTarget 		= $('#popup-target');  		 	// checkbox
			jQmap.$formaToHTML 		= $('#popup-to_html'); 		 	// textarea 


			jQmap.$formaStyle  		= $('.b-form-style'); 	    	// forma style
			jQmap.$formaArea  		= $('.b-form-style.area'); 	    // forma create
			jQmap.$formaHTML  		= $('.b-form-style.to-html');   // forma generate html

			// @PopUp forma buttons

			jQmap.$bCreate       	= $('#popup-create');
			jQmap.$bSave        	= $('#popup-save');
			jQmap.$bDelete       	= $('#popup-delete');
			jQmap.$bCancel      	= $('.popup-cancel');

		},

		// Save data
		memory: {
			map 		    : '',
			editID 	    	: '',
			$edit			: '',
			mapData			: {},
			coordinate		: []	// Save cordinate maps
		},		

		// Generate HTML tools button & prepend
		Tools: function () {

			var bClass = 'jQmap-button',
				iClass = 'jQmap-icon jQmap-icon-'
				tools  = '<div class="jQmap-tools">';

				// Create area
				tools += 	'<div class="'   + bClass + '" id="t-createArea">';
				tools +=		'<i class="' + iClass + 'rectangle"></i>';
				tools += 		'<br>Создать<br>область';
				tools +=	'</div>';

				// Download IMG

				tools += 	'<div class="'   + bClass + '" id="t-downloadIMG">';
				tools +=		'<i class="' + iClass + 'plus"></i>';
				tools += 		'<br>Загрузить<br>изображение';
				tools += 		'<input id="fileupload" type="file" name="files[]" data-url="server/php/" multiple>';
				tools +=	'</div>';

				// Generate HTML
				tools += 	'<div class="'   + bClass + '" id="t-html">';
				tools +=		'<i class="' + iClass + 'html"></i>';
				tools += 		'<br>Сгенерировать<br>HTML';
				tools +=	'</div>';

				// Save
				tools += 	'<div class="'   + bClass + ' hidden" id="t-save">';
				tools +=		'<i class="' + iClass + 'save"></i>';
				tools += 		'<br>Сохранить<br>область';
				tools +=	'</div>';

				tools += '</div>';

			$('#jQmap').prepend( tools );

		},

		// Generate HTML PopUp & append
		PopUp: function(){

			if( $('.jQpup-overview').length === 0 ){

				var close 		= 'attr-popup-close',
					button  	= 'form-button',
					offset  	= 'small offset-left_5',
					formaStyle  = 'forma-style';

					jQpup = '<div class="jQpup-overview">';
					jQpup +=	'<div class="jQpup">';
					jQpup +=		'<div class="jQpup-close '+ close +'">X</div>';
					jQpup +=		'<div class="b-form-style area">';
					jQpup +=			'<div class="offset-bottom_10">';
					jQpup +=				'<input type="text" id="popup-URL" data-autofocus="autofocus" placeholder="Введите URL" class="'+ formaStyle +' forma-el-width_2">';
					jQpup +=				'<div class="forma-example offset-top_3 offset-left_5">Пример: http://your-site-url.com</div>';
					jQpup +=			'</div>';
					jQpup +=			'<div class="offset-bottom_15 offset-left_5">';
					jQpup +=				'<label class="checkbox-lable">';
					jQpup +=					'<input type="checkbox" id="popup-target" class="'+ formaStyle +'"> Open in new window ?';
					jQpup +=				'</label>';
					jQpup +=			'</div>';
					jQpup +=			'<div class="text-right">';
					jQpup +=				'<button class="popup-cancel '+ button +' silver small '+ close +'">Отмена</button>';
					jQpup +=				'<button id="popup-create" class="'+ button +' orange '+ close + ' ' + offset +'">Создать область</button>';
					jQpup +=				'<button id="popup-delete" class="'+ button +' silver '+ close + ' ' + offset +'">Удалить</button>';
					jQpup +=				'<button id="popup-save" class="'+ button +' orange '+ close + ' ' + offset +'">Сохранить</button>';
					jQpup +=			'</div>';
					jQpup +=		'</div>';
					jQpup +=		'<div class="b-form-style to-html">';
					jQpup +=			'<div class="offset-bottom_15">';
					jQpup +=				'<textarea id="popup-to_html" data-autofocus="autofocus" class="'+ formaStyle +'"></textarea>';
					jQpup +=			'</div>';
					jQpup +=			'<div class="text-right">';
					jQpup +=				'<button class="popup-cancel '+ button +' silver small '+ close +'">Отмена</button>';
					jQpup +=			'</div>';
					jQpup +=		'</div>';
					jQpup +=	'</div>';
					jQpup +='</div>';

				$('body').append( jQpup );

			}

		},
		
		// initialize
		Init: function () {

			// Append tools 
			jQmap.Tools();

			// File upload
			jQmap.Upload();

			// Prepend PopUp
			jQmap.PopUp();

			// Elements save
			jQmap.$el();

			// Add events
			jQmap.Events();

		},
		
		// @Autoresize showcase & tools
		Autoresize: function () {

			var thumb_w  = jQmap.$thumb.outerWidth ( true ),
				thumb_h  = jQmap.$thumb.outerHeight( true );
				
			jQmap.$showcase.width( thumb_w ).height( thumb_h );
			jQmap.$tools   .width( thumb_w );

		},
		
		// @Events 
		Events: function () {

			// @Tools: Open PopUp for create area || revert map data 
			jQmap.$tCreateMap.click(function(){
				$('.imgareaselect-outer').is(':visible') ? jQmap.CheckEnable( 'revert' ) : jQmap.PopUpCreateMap();
			});

			// @Tools: Open PopUp with Generate HTML
			jQmap.$tHTML.click(function(){ jQmap.ToHTML() });

			// @Tools: Save create area
			jQmap.$tSave.click(function(){ jQmap.SaveMap() });

			// Edit map: When click on the edit icon 
			jQmap.$parent.on( "click", '.jQmap-edit' , function(){

				// Save edit $map in memory
				jQmap.memory.$edit = $(this);
				jQmap.EditMapPopUp( jQmap.memory.$edit );

			});

			// PopUp Forma button: Save 
			jQmap.$bSave.click(function(){ jQmap.EditMap() });

			// PopUp Forma button: Delete 
			jQmap.$bDelete.click(function(){ jQmap.DeleteMap( jQmap.memory.$edit ) });

			// PopUp Forma button: Create area
			jQmap.$bCreate.click(function () { 

				// Save URL & target status
				jQmap.MapData(); 			
				
				// Checking status create map [ enable || disable ]
				jQmap.CheckEnable();	
			
			});

			// Hide PopUp when click outside PopUp
			jQmap.$popupClose.click(function(e) {

				var $click = $(e.target);

				if( $click.hasClass('jQpup-overview') || $click.hasClass('attr-popup-close') )
				{
					$(window).off('resize');
					jQmap.$popupButtons.hide();
					jQmap.$bCancel.show();
					jQmap.$popupOverview.hide();
				}

			});

			// Close PopUp, disable, revert create area when click MAP outside
			$('body').on('mousedown','.imgareaselect-outer',function () { jQmap.CheckEnable( 'revert' ) });

		},		

		PopUpCreateMap: function (){

			// Show form in popUp for start create
			jQmap.$formaArea.show();
			
			// Hide form generate HTML 
			jQmap.$formaHTML.hide();

			// @tCreateMap: tools ( top button ) for create map 
			if ( !jQmap.$tCreateMap.hasClass('active') ) {

				// Clear form data
				jQmap.$formaURL.val('');
				jQmap.$formaTarget.prop('checked', false);

				// Show button create in PopUp
				jQmap.$bCreate.show();

				// Show PopUp
				jQmap.PopUpShow();

			} else {

				// Disable create map
				jQmap.CheckEnable();

			} 

		},

		// Open PopUp
		PopUpShow: function () {

			var $self       = jQmap.$popup,
				$overview   = jQmap.$popupOverview,
				h_document  = $(document).height(),
				w_document  = $(document).width();	

			$overview.height( h_document )
					 .width(  w_document ).show();

			$self.css({ 'margin-top' : 0, 'margin-left' : 0 });
			$self.css({ 'margin-top' : '-' + parseInt( $self.outerHeight( true ) / 2 ) + 'px' });
			$self.css({ 'margin-left': '-' + parseInt( $self.outerWidth( true  ) / 2 ) + 'px' });

			// Add autofocus to tag with attribute autofocus
			var $focus = jQmap.$formaStyle.filter(':visible').find('[data-autofocus]');

			if( $focus.attr('id') === 'popup-to_html' ){

				$focus.focus(function(){

					var $this = $(this);
				    $this.select();

				    $this.mouseup(function() {
				        $this.unbind("mouseup");
				        return false;
				    });

				});
				
			} else {
				$focus.focus();
			}

			$(window).resize(function(){
				
				$overview.height( $(document).height() )
					 	 .width ( $(document).width()  );

			});			

		},

		// Checking create area [ enable || disable ]
		CheckEnable: function ( status ) {

			if ( !jQmap.$tCreateMap.hasClass('active') ) {

				jQmap.$tCreateMap.addClass('active');
				jQmap.$thumb.addClass('active');
				jQmap.$tSave.removeClass('hidden');

				// Enable create map
				jQmap.OnMap();

			} else{

				jQmap.$tCreateMap.removeClass('active');
				jQmap.$thumb.removeClass('active');
				jQmap.$tSave.addClass('hidden');
				
				/*
				 * @if 	   Click outer map area
				 * true:   Add old map to showcase
				 * false:  Disable create map
				 */	
				status === 'revert' ? jQmap.DrawMap( jQmap.memory.editID ) : jQmap.OffMap();		

			}

		},

		// Add enable map & save to memory
		OnMap: function () {
			jQmap.memory.map = jQmap.$thumb.imgAreaSelect({ handles: true, instance: true });
		},


		// Disable map
		OffMap: function () {
			jQmap.$thumb.imgAreaSelect({ remove : true });
			jQmap.memory.mapData = {};
			jQmap.memory.editID = '';
			jQmap.memory.$edit = '';
		},

		// Delete & Disable map
		DeleteMap: function () {

			var map = jQmap.memory.$edit.closest('.jQmap'),
				id = map.attr('data-jQmap');

			delete jQmap.memory.coordinate[id];

			// Remove map from showcase
			map.remove();

			// Disable map
			jQmap.OffMap();

			console.log( jQmap.memory.coordinate );

		},

		// Save data in coordinate memory
		SaveMap: function () {

			var area 	 = jQmap.memory.map.getSelection(),
				mapData  = jQmap.memory.mapData,
				ID   	 = jQmap.memory.editID,
				data 	 = {
					'width'	:area.width,
					'height':area.height,
					'x1'	:area.x1,
					'y1'	:area.y1,
					'x2'	:area.x2,
					'y2'	:area.y2,
					'url'	:mapData.url,
					'target':mapData.target
				};

			if ( area.width !== 0  ) {

				// if have map replace or add new
				ID !== '' ? jQmap.memory.coordinate[ ID ] = data : jQmap.memory.coordinate.push( data );

				// Add map in showcase
				jQmap.DrawMap( ID );

			}

			// disable create map
			jQmap.CheckEnable();

		},		

		// Add map to showcase
		DrawMap : function ( id ) {

			var cord     	= jQmap.memory.coordinate,
				data     	= cord[ id || cord.length-1 ],
				$showcase 	= jQmap.$showcase,
				$map      	= $('<div></div>'),
				$editButton	= $('<div class="jQmap-edit"><i class="jQmap-icon jQmap-icon-edit"></i></div>');

			// add map to showcase only if have edit or not empty
			if ( id !== '' || ( cord.length - 1 ) !== -1 ){

				$map.css({
					width  :data.width +'px',
					height :data.height+'px',
					left   :( ~~data.x1+10 )+'px', // 10 - paddding for #jQmap-thumb
					top    :( ~~data.y1+10 )+'px'					
				}).addClass('jQmap');

				$map.attr('data-jQmap', id || cord.length-1 )
				  	.attr('data-url', data.url )
				  	.attr('data-target', data.target );

				$map.append( $editButton );

				$showcase.append( $map );

				console.log( cord );

			}
			jQmap.OffMap();

		},

		// Open PopUp width edit map data URL & target
		EditMapPopUp: function ( el ) {

			var editMap = $( el ).closest('.jQmap');

			// Show form for create area in PopUp
			jQmap.$formaArea.show();

			// Hide form generate HTML 
			jQmap.$formaHTML.hide();

			// Show button save in PopUp
			jQmap.$bSave.show();

			// Show button delete in PopUp
			jQmap.$bDelete.show();	

			// Save edit map data in memory from fill forma
			jQmap.MapData( editMap.attr('data-url'), editMap.attr('data-target') );

			// Open PopUp
			jQmap.PopUpShow();	

		},

		// When click bSave on PopUp edit map size & position
		EditMap: function () {

			// Enable map
			jQmap.OnMap();

			var $map 		= jQmap.memory.$edit.closest('.jQmap');
				ID 			= $map.attr('data-jQmap'),
				fieldURL 	= jQmap.$formaURL.val(),
				fieldTarget = jQmap.$formaTarget.is(':checked') ? 'true' : 'false',
				map 		= jQmap.memory.map,
				data 		= jQmap.memory.coordinate[ ID ];

			map.setOptions({
				show: true,
				x1: data.x1,
				y1: data.y1,
				x2: data.x2,
				y2: data.y2
			});

			// Save new data [ URL & target ] in memory
			jQmap.MapData( fieldURL, fieldTarget );

			// Remove element from showcase
			$map.remove();

			// Save edit id
			jQmap.memory.editID = ID;

			// Disable create map
			jQmap.CheckEnable();
			
		},

		// Generate init random number
		getRandomInt: function ( min, max ) {
		    return Math.floor( Math.random() * (max - min + 1) ) + min;
		},		

		// Save data from forma create area in PopUp
		MapData: function ( url, target ) {

			// PopUp forma field
			var fieldURL, fieldTarget = '';

			if( url === '' ){
				fieldURL = '';
			} else {
				fieldURL = url || jQmap.$formaURL.val();
			}

			if ( !target ){
				fieldTarget = jQmap.$formaTarget.is(':checked') ? true : false;
			} else {
				fieldTarget = ( target === 'true' ? true : false );
			}

			// Save data from forma in memory mapData
			jQmap.memory.mapData.url 	= fieldURL;
			jQmap.memory.mapData.target = fieldTarget;

			// Fill forma when edit map
			jQmap.$formaURL.val( fieldURL );
			jQmap.$formaTarget.prop( 'checked', !!fieldTarget );

		},

		Upload:function(){
			$('#fileupload').fileupload({
				dataType: 'json',
			    add: function (e, data) {
			        data.submit();

			        var IMG = '<img src="server/php/files/';
			        	IMG+= data.originalFiles[0].name+'"';
			        	IMG+= ' alt="" class="jQmap-thumb" id="jQmap-thumb">';

			        $('.jQmap-showcase').empty().append(IMG);
			    },
			    done: function (e, data) {

			    	// Clear old data
					if( jQmap.memory.map !== '' ){
						jQmap.OffMap();
						jQmap.memory.map = '';
						jQmap.memory.coordinate = [];
					}
					jQmap.$el();
			    	jQmap.Autoresize();
			    	
			    }
			});
		},

		// Generate HTML
		ToHTML: function (){

				var i 	  = 0,
					cord  = jQmap.memory.coordinate,
					ln 	  = cord.length,
					mapID = 'jQmap-map_'+jQmap.getRandomInt( 0, 100000 ),
					area  = '';

			// Hide form for create area in PopUp
			jQmap.$formaArea.hide();

			// Show form generate HTML 
			jQmap.$formaHTML.show();

			// Show PopUp
			jQmap.PopUpShow();

			// Generate HTML
			for ( i; i < ln; i++ ){
				if( !!cord[i] ){
					area += '<area shape="rect" coords="';
					area += cord[i].x1+',';
					area += cord[i].y1+',';
					area += cord[i].x2+',';
					area += cord[i].y2+'"';
					if ( cord[i].target ) {
						area += ' target="_blank"';
					}
					area += ' href="'+cord[i].url+'">';
				}
			}

			jQmap.$formaToHTML.val( '<img src="" alt="" usemap="#'+mapID+'"><map name="'+mapID+'">'+area+'</map>' ); 
		
		}

	};

	// START )) 
	jQmap.Init();

}());