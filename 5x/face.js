var thisTextarea;
var faceDic = new Array(); 
faceDic["[$发怒$]"] = '[5X:0101]'; 
faceDic["[$微笑$]"]= '[5X:0102]';
faceDic["[$流鼻血$]"]= '[5X:0103]';
faceDic["[$撇嘴$]"]= '[5X:0104]';
faceDic["[$犯困$]"]= '[5X:0105]';
faceDic["[$大哭$]"]= '[5X:0106]';
faceDic["[$奸笑$]"]= '[5X:0107]';
faceDic["[$酷$]"]= '[5X:0108]';
faceDic["[$要死$]"]= '[5X:0109]';
faceDic["[$囧$]"]= '[5X:0110]';
faceDic["[$羞羞$]"]= '[5X:0111]';
faceDic["[$真诚$]"]= '[5X:0112]';
faceDic["[$惊吓$]"]= '[5X:0113]';
faceDic["[$吐$]"]= '[5X:0114]';
faceDic["[$衰$]"]= '[5X:0115]';
faceDic["[$无语$]"]= '[5X:0116]';
faceDic["[$哇哦$]"]= '[5X:0117]';
faceDic["[$晕$]"]= '[5X:0118]';
faceDic["[$惊讶$]"]= '[5X:0119]';
faceDic["[$无聊$]"]= '[5X:0120]';
faceDic["[$痴笑$]"]= '[5X:0121]';
faceDic["[$口水$]"]= '[5X:0122]';
faceDic["[$尴尬$]"]= '[5X:0123]';
faceDic["[$呀$]"]= '[5X:0124]';
faceDic["[$呆$]"]= '[5X:0125]';
faceDic["[$绿了$]"]= '[5X:0126]';
faceDic["[$花心$]"]= '[5X:0127]';
faceDic["[$咧嘴$]"]= '[5X:0128]';
faceDic["[$红眼$]"]= '[5X:0129]';
faceDic["[$偷笑$]"]= '[5X:0130]';
faceDic["[$鄙视$]"]= '[5X:0131]';
faceDic["[$ok$]"]= '[5X:0132]';
faceDic["[$哭笑$]"]= '[5X:0133]';
faceDic["[$再见$]"]= '[5X:0134]';
faceDic["[$抱剑$]"]= '[5X:0135]';
faceDic["[$吐血$]"]= '[5X:0136]';
faceDic["[$小黄$]"]= '[5X:0137]';
faceDic["[$小紫$]"]= '[5X:0138]';
faceDic["[$小绿$]"]= '[5X:0139]';
faceDic["[$小红$]"]= '[5X:0140]';
faceDic["[$好棒$]"]= '[5X:0141]';
faceDic["[$跪了$]"]= '[5X:0142]';
faceDic["[$五体投地$]"]= '[5X:0143]';
faceDic["[$开枪$]"]= '[5X:0144]';
faceDic["[$偷看$]"]= '[5X:0145]';
faceDic["[$双手持枪$]"]= '[5X:0146]';
faceDic["[$抽烟$]"]= '[5X:0147]';
faceDic["[$宝剑$]"]= '[5X:0148]';
faceDic["[$剁手$]"]= '[5X:0149]';
faceDic["[$心$]"]= '[5X:0150]';
faceDic["[$月亮$]"]= '[5X:0151]';
faceDic["[$韩老尸$]"]= '[5X:0152]';
faceDic["[$好的$]"]= '[5X:0153]';
faceDic["[$感叹号$]"]= '[5X:0154]';
faceDic["[$赞$]"]= '[5X:0155]';
faceDic["[$帅$]"]= '[5X:0156]';
faceDic["[$牛逼$]"]= '[5X:0157]';
faceDic["[$睡了$]"]= '[5X:0158]';
faceDic["[$信息$]"]= '[5X:0159]';
faceDic["[$礼盒$]"]= '[5X:0160]';
	$.fn.extend({
		insertAtCaret: function(myValue){
		var $t=$(this)[0];
		if (document.selection) {
			this.focus();
			sel = document.selection.createRange();
			sel.text = myValue;
			this.focus();
		}
		else if ($t.selectionStart || $t.selectionStart == '0') {
			var startPos = $t.selectionStart;
			var endPos = $t.selectionEnd;
			var scrollTop = $t.scrollTop;
			$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
			this.focus();
			$t.selectionStart = startPos + myValue.length;
			$t.selectionEnd = startPos + myValue.length;
			$t.scrollTop = scrollTop;
		}
		else {
			this.value += myValue;
			this.focus();
		}
		}
	});
	function replaceFace(){
			var thisTextareaValue=thisTextarea.val();		
			var reg=/(\[\$)([\u4e00-\u9fa5,a-z]*)(\$\])/g;
			var aaa=thisTextareaValue.match(reg);
			if(aaa!=null){
				for(var i=0;i<aaa.length;i++){	
					thisTextareaValue=thisTextareaValue.replace(aaa[i],faceDic[aaa[i]]);
				}	
			}
			return thisTextareaValue;
	}
	function reReplaceFace(faceStr){
		for(key in faceDic){
			if(faceDic[key]==faceStr){
				faceStr=key;
			}
		}
		thisTextarea.insertAtCaret(faceStr);
	}
	function readReplaceFace(){
		var thisTextareaValue=thisTextarea.val();		
		var reg=/(\[5X:)([0-9]*)(\])/g;
		var aaa=thisTextareaValue.match(reg);
		if(aaa!=null){
			for(var i=0;i<aaa.length;i++){	
				for(key in faceDic){
					if(faceDic[key]==aaa[i]){
						thisTextareaValue=thisTextareaValue.replace(aaa[i],key);
					}
				}
			}
			thisTextarea.val(thisTextareaValue);
		}
	}
	function faceBoxHtml(positionTop,positionLeft){
		$(".face-box").slideUp(200,function(){
			$(this).remove();
		}); 
		var html='<div class="face-box">'+
                    '<span class="arrow"><em></em><b></b></span>'+
                    '<dl>';
                    for(var i=1;i<=60;i++){
                    	if(i<10){
                    		i='0'+i;
                    	}
                        html+='<dd style="float:none;margin-left:0px"><a href="javascript:;" faceStr="[5X:01'+i+']"><img src="/images/5xface/01'+i+'.png"/></a></dd>';
                    }
             html+= '</dl>'+
                 '</div>'; 
        thisDom.after(html);
        $(".face-box").css({
        	"top": positionTop,
        	"left":positionLeft
        });
        $(".face-box").slideDown(200);      
	}
$(document).ready(function($) {
	$("body").on("click",".face-btn",function(e) {
		e.stopPropagation();
		$('.face-btn').removeClass('face-btn-active');
		$(this).addClass('face-btn-active');
		thisDom=$(this);
		thisTextarea=$(this).parent(".button-box").prev("textarea");
		positionTop=thisDom.position().top;
		positionLeft=thisDom.position().left-432;
		faceBoxHtml(positionTop,positionLeft);
	});
	$("body").on("click",".face-box dd a",function(e) {
		e.stopPropagation();
		faceStr=$(this).attr("faceStr");
		reReplaceFace(faceStr);
	});
	$("body").click(function(e) {
		$(".face-box").slideUp(50,function(){
			$(".face-box").remove();
			$('.face-btn').removeClass('face-btn-active');
		});
	});
});
