/********************************/
// TALLYPAY PLUGIN v3
// https://tallycoin.app/plugin/
/********************************/

var tallypay_mobile_state = "N";

window.onload=function(){ tallypay_start(); }

window.onhashchange = function () {
  setTimeout(function () {
    tallypay_start();
  }, 500);
};

function tallypay_start(){
	// setup widget
	var widget = document.getElementsByClassName('tallypay');

	Array.prototype.forEach.call(widget, function(el) {
		
		if(el.dataset.user_name !== undefined){
			
			var htmlid = el.dataset.user_name+"-"+Math.floor(Math.random() * 2000);
			el.setAttribute('id' , 'tallypay_wrapper_'+htmlid);			

			// Use overlay with buttons, otherwise add widget inline
			var use_overlay = 'N'; 
			
			if(el.dataset.button !== undefined){ 
				use_overlay = 'Y';
				tallypay_set_button(htmlid, el.dataset.button);
			}
			
			if(el.dataset.image !== undefined){ 
				use_overlay = 'Y';
				tallypay_set_image(htmlid, el.dataset.image);			
			}
			
			if(use_overlay == 'N'){ 
				tallypay_create_frame(htmlid);
			}			
		}
		
	});	
	
	if(window.innerWidth < window.innerHeight ){ tallypay_mobile_state = "Y"; }
}

function tallypay_iframe_loaded(htmlid, data){
	var size = data.split("|");
	var w = parseInt(size[0]) + 20; var h = parseInt(size[1]) + 20;
	if(data == "" || w < 410 || h < 530){ 
		if(window.innerHeight > window.innerWidth){
			w = window.innerWidth; h = 570; 
		}else{
			w = 380; h = 550;
		}
	}
	
	document.getElementById('tp_frame_'+htmlid).style.width = w;
	document.getElementById('tp_frame_'+htmlid).style.height = h;

	if(document.getElementById('tallypay_overlay')){ set_overlay_size(htmlid); }
	document.getElementById('tp_frame_'+htmlid).style.opacity = 1;
}

function tallypay_set_button(htmlid, btn_text){
	document.getElementById('tallypay_wrapper_'+htmlid).innerHTML = '<button id="tc_tip_btn_'+htmlid+'" onclick="tallypay_overlay(\''+htmlid+'\')" class="tc_tip_button">'+btn_text+'</button>';	
}

function tallypay_set_image(htmlid, image_url){
	document.getElementById('tallypay_wrapper_'+htmlid).innerHTML = '<div id="tc_tip_img_'+htmlid+'" onclick="tallypay_overlay(\''+htmlid+'\')" class="tc_tip_image"><img src="'+image_url+'"></div>';	
}

function tallypay_create_frame(htmlid){
	
	var page_tag = ''; if(document.getElementById('tallypay_wrapper_'+htmlid).dataset.page_tag !== undefined){ page_tag = '&page_tag='+document.getElementById('tallypay_wrapper_'+htmlid).dataset.page_tag; }
	var theme = ''; if(document.getElementById('tallypay_wrapper_'+htmlid).dataset.theme !== undefined){ theme = '&theme='+document.getElementById('tallypay_wrapper_'+htmlid).dataset.theme; }
	var user_name = document.getElementById('tallypay_wrapper_'+htmlid).dataset.user_name;
	
	var iframe = document.createElement('iframe');
	iframe.id = 'tp_frame_'+htmlid;
	iframe.src='https://tallycoin.app/plugin/tallypay_frame.php?size='+window.innerWidth+'|'+window.innerHeight+'&user_name='+user_name+page_tag+theme;

	if(window.innerWidth > 420){ iframe.width = 420; }else{ iframe.width = window.innerWidth; }
	if(window.innerHeight > 570){ iframe.height = 570; }else{ iframe.height = window.innerHeight; }
	iframe.style.border = 0;
	iframe.style.opacity = 0;
		
	document.getElementById('tallypay_wrapper_'+htmlid).appendChild(iframe);
	
	window.addEventListener("message", (event) => {	tallypay_iframe_message(htmlid, event.data); }, false);
}

function tallypay_iframe_message(htmlid, e){
	var json = JSON.parse(e);
	if(json.size !== undefined){ tallypay_iframe_loaded(htmlid, json.size); }
	if(json.onpayment !== undefined){ eval(document.getElementById('tallypay_wrapper_'+htmlid).dataset.onpayment); }	
}

function tallypay_overlay(htmlid){

	if(!document.getElementById('tallypay_overlay')){
		var overlay_bg = document.createElement('div');
		overlay_bg.id = 'tallypay_overlay';
		overlay_bg.style = 'width:100%;height:100%;overflow:hidden; position:fixed; top:0; left:0; z-index:9999; text-align: center;';
		overlay_bg.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpENUFGMEQ5OTUwNDFFOTExODk1QkEwRjhBRUIyOTM4QSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5REJDMjdBQjQ1M0IxMUU5QTUzOEFBOTAzMkZGMjVFOSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5REJDMjdBQTQ1M0IxMUU5QTUzOEFBOTAzMkZGMjVFOSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQ1QUYwRDk5NTA0MUU5MTE4OTVCQTBGOEFFQjI5MzhBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQ1QUYwRDk5NTA0MUU5MTE4OTVCQTBGOEFFQjI5MzhBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+T+UlegAAANNJREFUeNrs0zEBAAAIA6CtfzVDWcDXDzrQJBPgVEFAEBAEBAFBQBAQBAQBQUAQQBAQBAQBQUAQEAQEAUFAEBBEEBAEBAFBQBAQBAQBQUAQEAQQBAQBQUAQEAQEAUFAEBAEBAEEAUFAEBAEBAFBQBAQBAQBBAFBQBAQBAQBQUAQEAQEAUEAQUAQEAQEAUFAEBAEBAFBAEFAEBAEBAFBQBAQBAQBQUAQQBAQBAQBQUAQEAQEAUFAEBBEEBAEBAFBQBAQBAQBQUAQEAQQBAQBQeDTCjAA/9dQFbEV1jYAAAAASUVORK5CYII=')";
		overlay_bg.style.backgroundRepeat = 'repeat';
		document.body.appendChild(overlay_bg);
		
		tallypay_create_frame(htmlid);
		
		// move frame into overlay
		var iframe = document.getElementById('tp_frame_'+htmlid);
		document.getElementById('tp_frame_'+htmlid).remove();	
		document.getElementById('tallypay_overlay').appendChild(iframe);
		iframe.style.borderRadius = '10px';
		iframe.style.position = 'absolute';		
	}
}

function tallypay_close_overlay(){
	if(document.getElementById('tallypay_overlay')){
		document.getElementById('tallypay_close_btn').removeEventListener('click', tallypay_close_overlay);
		document.getElementById('tallypay_close_btn').remove();
		document.getElementById('tallypay_overlay').remove();
	}
}

function set_overlay_size(htmlid){	
	
	if(!document.getElementById('tallypay_close_btn')){
		var close_btn = document.createElement('div');
		close_btn.id = "tallypay_close_btn";
		close_btn.style = 'position:absolute; top:10px; right:10px; z-index:999; color:white; font-size:1rem; cursor:pointer; font-family: Arial;';
		close_btn.innerHTML = '[ close ]';
		close_btn.addEventListener('click', tallypay_close_overlay);
		document.getElementById('tallypay_overlay').appendChild(close_btn);	
	}
	
	if(tallypay_mobile_state == "Y"){
		var pos_from_left = '0';
		document.getElementById('tp_frame_'+htmlid).style.bottom = '0px';
		close_btn.style.fontSize = '1.2rem';
	}else{
		var content_size = document.getElementById('tp_frame_'+htmlid).getBoundingClientRect();

		var pos_from_top = (parseFloat(parent.innerHeight) - parseFloat(content_size.height))/2;
		var pos_from_left = (parseFloat(parent.innerWidth) - parseFloat(content_size.width))/2;
		
		document.getElementById('tp_frame_'+htmlid).style.top = pos_from_top+'px';
	}
		
	document.getElementById('tp_frame_'+htmlid).style.left = pos_from_left+'px';	

}